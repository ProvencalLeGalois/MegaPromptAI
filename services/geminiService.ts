
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedResult, TaskType, Language, PromptLength, ChatMessage, AspectRatio } from "../types.js";

export class PromptService {
  /**
   * Vérifie uniquement la présence de la clé API.
   * On se fie au SDK pour la validation réelle lors de l'appel.
   */
  private getApiKey(AIzaSyCGJG9AV_edPeta35NjdYH8M91IlDQcWRU): string {
    const key = process.env.API_KEY;
    if (!key || key.trim() === "") {
      throw new Error("API_KEY_MISSING: La clé API est absente de l'environnement.");
    }
    return key;
  }

  private getAI() {
    const apiKey = this.getApiKey(AIzaSyCGJG9AV_edPeta35NjdYH8M91IlDQcWRU);
    return new GoogleGenAI({ apiKey });
  }

  async optimize(prompt: string, taskType: TaskType, language: Language, length: PromptLength): Promise<OptimizedResult> {
    try {
      const ai = this.getAI();
      const isPro = taskType === TaskType.CODING || length === PromptLength.MEGA;
      const model = isPro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

      const response = await ai.models.generateContent({
        model: model,
        contents: `Optimise : "${prompt}". Catégorie : ${taskType}. Taille : ${length}. Langue : ${language}.`,
        config: {
          systemInstruction: "Tu es un ingénieur de prompt expert. Réponds uniquement en JSON selon le schéma.",
          responseMimeType: "application/json",
          thinkingConfig: isPro ? { thinkingBudget: 4000 } : undefined,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalPrompt: { type: Type.STRING },
              optimizedPrompt: { type: Type.STRING },
              explanation: { type: Type.STRING },
              score: { type: Type.NUMBER },
              components: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  task: { type: Type.STRING },
                  context: { type: Type.STRING },
                  format: { type: Type.STRING }
                },
                required: ["role", "task", "context", "format"]
              }
            },
            required: ["originalPrompt", "optimizedPrompt", "explanation", "score", "components"]
          }
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("L'IA n'a retourné aucun contenu.");
      return JSON.parse(text.trim());
    } catch (e: any) {
      this.handleApiError(e, "Optimisation");
      throw e;
    }
  }

  async chat(message: string, history: ChatMessage[]): Promise<string> {
    try {
      const ai = this.getAI();
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction: "Tu es PromptMaster AI, un assistant intelligent et serviable." }
      });
      const response = await chat.sendMessage({ message });
      return response.text || "";
    } catch (e: any) {
      this.handleApiError(e, "Chat");
      throw e;
    }
  }

  async generateImage(prompt: string, aspectRatio: AspectRatio): Promise<string> {
    try {
      // Pour l'image, on réinitialise l'instance au moment de l'appel pour être sûr d'avoir la clé sélectionnée
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: { aspectRatio }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("Aucune image n'a pu être générée par le modèle.");
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_REQUIRED");
      }
      this.handleApiError(e, "Image");
      throw e;
    }
  }

  async analyzeImage(prompt: string, base64Image: string, mimeType: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Image.split(',')[1], mimeType } },
            { text: prompt || "Analyse cette image en détail." }
          ]
        }
      });
      return response.text || "Aucune analyse disponible.";
    } catch (e: any) {
      this.handleApiError(e, "Vision");
      throw e;
    }
  }

  private handleApiError(error: any, context: string) {
    console.error(`[Gemini Error - ${context}]:`, error);
    
    let message = error.message || "Une erreur inconnue est survenue.";
    
    // Identification des erreurs d'authentification renvoyées par l'API
    if (message.includes("API_KEY_INVALID") || message.includes("invalid API key") || message.includes("401")) {
      throw new Error("Clé API invalide : Veuillez vérifier votre configuration dans le panneau de contrôle.");
    }
    if (message.includes("API_KEY_MISSING")) {
      throw new Error("Clé API manquante : Aucune clé n'est configurée.");
    }
    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      throw new Error("Limite de requêtes atteinte : Trop d'appels. Réessayez dans une minute.");
    }
    if (message.includes("500") || message.includes("503")) {
      throw new Error("Service indisponible : Le serveur Gemini rencontre des difficultés temporaires.");
    }
    
    throw new Error(`${context} : ${message}`);
  }
}

export const promptService = new PromptService();
