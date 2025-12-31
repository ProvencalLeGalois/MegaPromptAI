
import { TaskType, PromptLength } from './types';

export const translations = {
  FR: {
    title: "PromptMaster AI",
    subtitle: "Optimiseur de prompt intelligent via Gemini",
    originalPrompt: "Prompt Original",
    placeholder: "Décrivez ce que vous voulez que l'IA fasse...",
    templatesLabel: "Modèles rapides",
    optimizeBtn: "Optimiser le Prompt",
    optimizing: "Optimisation en cours...",
    recent: "Récents",
    searchHistory: "Rechercher dans l'historique...",
    noHistory: "Aucun historique pour le moment.",
    readyTitle: "Prêt à optimiser",
    readyDesc: "Saisissez un prompt à gauche pour voir la magie de l'ingénierie de prompt opérer.",
    loadingDesc: "Structure de l'instruction en cours...",
    qualityScore: "Score de Qualité",
    optimizedTitle: "Prompt Optimisé",
    copy: "Copier",
    copied: "Copié !",
    role: "Rôle",
    task: "Tâche",
    context: "Contexte",
    format: "Format",
    lengthLabel: "Format de sortie",
    lengths: {
      [PromptLength.SHORT]: "Court",
      [PromptLength.MEDIUM]: "Moyen",
      [PromptLength.LARGE]: "Large",
      [PromptLength.MEGA]: "Mega"
    },
    lengthDescs: {
      [PromptLength.SHORT]: "Concise et direct. Idéal pour des tâches simples et rapides.",
      [PromptLength.MEDIUM]: "Équilibré. Ajoute un rôle clair et quelques contraintes de base.",
      [PromptLength.LARGE]: "Détaillé. Inclut un contexte riche, des étapes précises et des contraintes avancées.",
      [PromptLength.MEGA]: "Ultra-complet. Intègre des exemples (few-shot), des raisonnements complexes et une structure multi-niveaux."
    },
    tasks: {
      [TaskType.GENERAL]: "Général",
      [TaskType.CODING]: "Codage",
      [TaskType.CREATIVE]: "Créativité",
      [TaskType.ACADEMIC]: "Académique",
      [TaskType.BUSINESS]: "Business",
    },
    templates: [
      { name: "Article de Blog", text: "Rédige un article de blog captivant sur les bienfaits de la méditation pour la productivité.", type: TaskType.CREATIVE },
      { name: "Générer du Code", text: "Crée une fonction Python pour scraper des titres d'actualités à partir d'une URL donnée en utilisant BeautifulSoup.", type: TaskType.CODING },
      { name: "Résumé de Texte", text: "Résume les points clés de ce long texte technique en gardant un ton pédagogique et concis.", type: TaskType.GENERAL },
      { name: "Email Pro", text: "Rédige un email professionnel pour proposer un partenariat stratégique à une entreprise de la tech.", type: TaskType.BUSINESS },
      { name: "Analyse Critique", text: "Analyse les arguments principaux de cette étude sur le changement climatique et identifie les biais potentiels.", type: TaskType.ACADEMIC }
    ]
  },
  EN: {
    title: "PromptMaster AI",
    subtitle: "Intelligent prompt optimizer via Gemini",
    originalPrompt: "Original Prompt",
    placeholder: "Describe what you want the AI to do...",
    templatesLabel: "Quick Templates",
    optimizeBtn: "Optimize Prompt",
    optimizing: "Optimizing...",
    recent: "Recent",
    searchHistory: "Search history...",
    noHistory: "No history yet.",
    readyTitle: "Ready to optimize",
    readyDesc: "Enter a prompt on the left to see prompt engineering magic happen.",
    loadingDesc: "Structuring instruction...",
    qualityScore: "Quality Score",
    optimizedTitle: "Optimized Prompt",
    copy: "Copy",
    copied: "Copied!",
    role: "Role",
    task: "Task",
    context: "Context",
    format: "Format",
    lengthLabel: "Output Format",
    lengths: {
      [PromptLength.SHORT]: "Short",
      [PromptLength.MEDIUM]: "Medium",
      [PromptLength.LARGE]: "Large",
      [PromptLength.MEGA]: "Mega"
    },
    lengthDescs: {
      [PromptLength.SHORT]: "Concise and direct. Best for simple, quick tasks.",
      [PromptLength.MEDIUM]: "Balanced. Adds a clear role and basic constraints.",
      [PromptLength.LARGE]: "Detailed. Includes rich context, precise steps, and advanced constraints.",
      [PromptLength.MEGA]: "Ultra-complete. Includes few-shot examples, chain-of-thought, and multi-level structure."
    },
    tasks: {
      [TaskType.GENERAL]: "General",
      [TaskType.CODING]: "Coding",
      [TaskType.CREATIVE]: "Creative",
      [TaskType.ACADEMIC]: "Academic",
      [TaskType.BUSINESS]: "Business",
    },
    templates: [
      { name: "Blog Post", text: "Write an engaging blog post about the benefits of meditation for productivity.", type: TaskType.CREATIVE },
      { name: "Code Snippet", text: "Create a Python function to scrape news headlines from a given URL using BeautifulSoup.", type: TaskType.CODING },
      { name: "Summarize", text: "Summarize the key points of this long technical text while keeping a pedagogical and concise tone.", type: TaskType.GENERAL },
      { name: "Business Email", text: "Write a professional email to propose a strategic partnership to a tech company.", type: TaskType.BUSINESS },
      { name: "Academic Analysis", text: "Analyze the main arguments of this study on climate change and identify potential biases.", type: TaskType.ACADEMIC }
    ]
  },
  ES: {
    title: "PromptMaster AI",
    subtitle: "Optimizador de prompts inteligente mediante Gemini",
    originalPrompt: "Prompt Original",
    placeholder: "Describe lo que quieres que haga la IA...",
    templatesLabel: "Plantillas rápidas",
    optimizeBtn: "Optimizar Prompt",
    optimizing: "Optimizando...",
    recent: "Recientes",
    searchHistory: "Buscar en el historial...",
    noHistory: "Sin historial aún.",
    readyTitle: "Listo para optimizar",
    readyDesc: "Introduce un prompt a la izquierda para ver la magia de la ingeniería de prompts.",
    loadingDesc: "Estructurando instrucción...",
    qualityScore: "Puntuación de Calidad",
    optimizedTitle: "Prompt Optimizado",
    copy: "Copiar",
    copied: "¡Copiado!",
    role: "Rol",
    task: "Tarea",
    context: "Contexto",
    format: "Formato",
    lengthLabel: "Formato de salida",
    lengths: {
      [PromptLength.SHORT]: "Corto",
      [PromptLength.MEDIUM]: "Medio",
      [PromptLength.LARGE]: "Grande",
      [PromptLength.MEGA]: "Mega"
    },
    lengthDescs: {
      [PromptLength.SHORT]: "Conciso y directo. Ideal para tareas simples y rápidas.",
      [PromptLength.MEDIUM]: "Equilibrado. Añade un rol claro y algunas restricciones básicas.",
      [PromptLength.LARGE]: "Detallado. Incluye contexto rico, pasos precisos y restricciones avanzadas.",
      [PromptLength.MEGA]: "Ultra-completo. Integra ejemplos (few-shot), razonamiento complejo y estructura multinivel."
    },
    tasks: {
      [TaskType.GENERAL]: "General",
      [TaskType.CODING]: "Programación",
      [TaskType.CREATIVE]: "Creatividad",
      [TaskType.ACADEMIC]: "Académico",
      [TaskType.BUSINESS]: "Negocios",
    },
    templates: [
      { name: "Post de Blog", text: "Escribe una entrada de blog atractiva sobre los beneficios de la meditación para la productividad.", type: TaskType.CREATIVE },
      { name: "Código", text: "Crea una función de Python para extraer titulares de noticias de una URL dada usando BeautifulSoup.", type: TaskType.CODING },
      { name: "Resumen", text: "Resume los puntos clave de este largo texto técnico manteniendo un tono pedagógico y conciso.", type: TaskType.GENERAL },
      { name: "Email Pro", text: "Escribe un correo electrónico profesional para proponer una asociación estratégica a una empresa tecnológica.", type: TaskType.BUSINESS },
      { name: "Análisis Académico", text: "Analiza los argumentos principales de este estudio sobre el cambio climático e identifica posibles sesgos.", type: TaskType.ACADEMIC }
    ]
  },
  DE: {
    title: "PromptMaster AI",
    subtitle: "Intelligenter Prompt-Optimierer via Gemini",
    originalPrompt: "Originaler Prompt",
    placeholder: "Beschreiben Sie, was die KI tun soll...",
    templatesLabel: "Schnellvorlagen",
    optimizeBtn: "Prompt optimieren",
    optimizing: "Optimierung läuft...",
    recent: "Verlauf",
    searchHistory: "Verlauf durchsuchen...",
    noHistory: "Noch kein Verlauf vorhanden.",
    readyTitle: "Bereit zur Optimierung",
    readyDesc: "Geben Sie links einen Prompt ein, um die Magie des Prompt-Engineerings zu erleben.",
    loadingDesc: "Anweisung wird strukturiert...",
    qualityScore: "Qualitätsbewertung",
    optimizedTitle: "Optimierter Prompt",
    copy: "Kopieren",
    copied: "Kopiert!",
    role: "Rolle",
    task: "Aufgabe",
    context: "Kontext",
    format: "Format",
    lengthLabel: "Ausgabeformat",
    lengths: {
      [PromptLength.SHORT]: "Kurz",
      [PromptLength.MEDIUM]: "Mittel",
      [PromptLength.LARGE]: "Groß",
      [PromptLength.MEGA]: "Mega"
    },
    lengthDescs: {
      [PromptLength.SHORT]: "Prägnant und direkt. Ideal für einfache, schnelle Aufgaben.",
      [PromptLength.MEDIUM]: "Ausgewogen. Fügt eine klare Rolle und grundlegende Einschränkungen hinzu.",
      [PromptLength.LARGE]: "Detailliert. Enthält reichhaltigen Kontext, präzise Schritte und fortgeschrittene Einschränkungen.",
      [PromptLength.MEGA]: "Ultra-komplett. Enthält Few-Shot-Beispiele, komplexes Denken und mehrstufige Struktur."
    },
    tasks: {
      [TaskType.GENERAL]: "Allgemein",
      [TaskType.CODING]: "Programmierung",
      [TaskType.CREATIVE]: "Kreativ",
      [TaskType.ACADEMIC]: "Akademisch",
      [TaskType.BUSINESS]: "Business",
    },
    templates: [
      { name: "Blogpost", text: "Schreibe einen fesselnden Blogbeitrag über die Vorteile von Meditation für die Produktivität.", type: TaskType.CREATIVE },
      { name: "Code-Snippet", text: "Erstellen Sie eine Python-Funktion, um Schlagzeilen von einer bestimmten URL mit BeautifulSoup zu scrapen.", type: TaskType.CODING },
      { name: "Zusammenfassen", text: "Fassen Sie die Kernpunkte dieses langen technischen Textes in einem pädagogischen und prägnanten Ton zusammen.", type: TaskType.GENERAL },
      { name: "Business-E-Mail", text: "Schreiben Sie eine professionelle E-Mail, um einem Technologieunternehmen eine strategische Partnerschaft vorzuschlagen.", type: TaskType.BUSINESS },
      { name: "Akademische Analyse", text: "Analysieren Sie die Hauptargumente dieser Studie zum Klimawandel und identifizieren Sie potenzielle Verzerrungen.", type: TaskType.ACADEMIC }
    ]
  }
};
