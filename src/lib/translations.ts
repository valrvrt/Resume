export type Language = "en" | "fr";

export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      skills: "Skills",
      hobbies: "Hobbies",
      contact: "Contact",
    },

    // Hero
    hero: {
      title: "Valentin Revert",
      subtitle: "Nuclear Engineer",
      location: "Paris, France",
      viewWork: "View My Work",
      getInTouch: "Get In Touch",
    },

    // About
    about: {
      title: "About Me",
      workExperience: "Work Experience",
      academicStudies: "Academic Studies",
      languages: "Languages",
    },

    // Experience
    experience: [
      {
        title: "Thermohydraulic Engineer",
        company: "NAAREA",
        location: "Nanterre, France",
        period: "01/2025 - Present",
        description: [
          "Modeling of the hydraulic circuits of the XAMR fast neutron reactor to evaluate thermal, hydraulic, and neutron behavior during accident transients for safety demonstration purposes.",
          "Overseeing accident studies to inform the design of reactor equipment.",
          "Development of computational tools: hydraulic and thermal models, simulation automation, and post-processing of files for data analysis. Management of the optioneering process for the reactor drainage system.",
        ],
        technologies: ["Modelica", "Dymola", "Python", "Git"],
      },
      {
        title: "Graduation Internship - Neutronics",
        company: "NAAREA",
        location: "Nanterre, France",
        period: "04/2024 - 10/2024",
        description: [
          "Development of a digital tool combining neutronics (OpenMC) and thermal (SciPy) simulations to model temperature variations in emergency shutdown systems.",
          "2D thermal modeling of a plate heat exchanger core.",
        ],
        technologies: ["Linux", "OpenMC", "SciPy"],
      },
      {
        title: "Contracts Engineer Intern - HPC",
        company: "Assystem / Edvance",
        location: "Montrouge, France",
        period: "04/2023 - 09/2023",
        description: [
          "Management of contracts related to supplier equipment for the HPC EPR. Development of a tool to automate the tracking of the status of contract-related documents.",
        ],
        technologies: ["Excel", "Power BI"],
      },
    ],

    // Education
    education: [
      {
        degree: "Master in Nuclear Engineering",
        institution: "IMT Atlantique",
        location: "Nantes, France",
        period: "09/2021 - 09/2024",
        description: [
          "Admission through the joint entrance exam for the Ecoles des Mines.",
          "Specialization in Nuclear Engineering: nuclear physics, dosimetry, radiation protection, Monte Carlo simulation, reactor physics, nuclear propulsion.",
        ],
      },
      {
        degree: "University Exchange",
        institution: "Tokyo University (UTokyo)",
        location: "Tokyo, Japan",
        period: "09/2023 - 02/2024",
        description: [
          "One-semester research program at the University of Tokyo at the Ionizing Radiation Chemistry Laboratory.",
          "Studies in nuclear safety, materials and fuels, nonproliferation, severe accident management, applications of ionizing radiation.",
        ],
      },
      {
        degree: "Preparatory Classes (MPSI - PSI*)",
        institution: "Fenelon Sainte Marie",
        location: "Paris, France",
        period: "09/2019 - 07/2021",
        description: [
          "Intensive preparation for entrance exams to top French engineering schools (Grandes Ecoles).",
          "Focus on mathematics, physics, and engineering sciences.",
        ],
      },
    ],

    // Languages spoken
    spokenLanguages: [
      { language: "French", level: "Native" },
      { language: "English", level: "IELTS 7.5/9 (C1)" },
      { language: "Spanish", level: "B2" },
      { language: "Japanese", level: "A1" },
    ],

    // Projects
    projects: {
      title: "Projects & Work",
      subtitle:
        "Professional engineering tools, personal coding projects, and creative experiments spanning nuclear simulation, physics visualization, and software development.",
      categories: {
        professional: "Professional",
        personal: "Personal",
        academic: "Academic",
      },
      items: [
        // Professional Projects
        {
          title: "Dymola Simulation Automation",
          description:
            "Automated the entire Dymola simulation launching process using the Python-Dymola interface. Enabled launching hundreds of simulations automatically, eliminating manual supervision and saving significant engineering time on complex transient studies.",
          tags: ["Python", "Dymola", "Automation"],
          category: "professional",
        },
        {
          title: "Simulation Post-Processing Suite",
          description:
            "Data analysis pipeline for processing large volumes of Dymola simulation outputs. Uses Pandas and Matplotlib to rapidly analyze complex scenarios on the XAMR fast neutron reactor, enabling engineers to extract insights from hundreds of result files efficiently.",
          tags: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
          category: "professional",
        },
        {
          title: "Neutronics-Thermal Coupling Tool",
          description:
            "Digital tool combining OpenMC Monte Carlo neutronics simulations with SciPy thermal calculations to model temperature variations in emergency shutdown systems for nuclear reactor safety analysis.",
          tags: ["OpenMC", "SciPy", "Python", "Monte Carlo"],
          category: "professional",
        },
        // Academic Projects
        {
          title: "EV Battery Range Calculator",
          description:
            "Partnership project with Ventura Systems using the Google Maps API to determine mean vehicle speed profiles along any route. Integrated with MATLAB simulation to calculate battery requirements for electric vehicles completing specific journeys.",
          tags: ["Google Maps API", "MATLAB", "EV Simulation"],
          category: "academic",
        },
        // Personal Projects - Simulations
        {
          title: "N-Body Galaxy Simulation",
          description:
            "Large-scale astrophysical simulation modeling 20,000+ particles with realistic gravitational physics. Features Barnes-Hut algorithm for O(N log N) performance, Numba JIT compilation, spiral galaxy generation, and two-galaxy collision scenarios.",
          tags: ["Python", "NumPy", "Numba", "Arcade"],
          category: "personal",
        },
        {
          title: "Double Pendulum Chaos Visualizer",
          description:
            "Interactive visualization of chaotic dynamics with multiple coupled double pendulums. Demonstrates sensitive dependence on initial conditions with color-coded motion trails. Fully vectorized physics with Numba optimization.",
          tags: ["Python", "NumPy", "Numba", "Physics"],
          category: "personal",
        },
        {
          title: "Conway's Game of Life",
          description:
            "Interactive cellular automaton implementation with configurable birth/survival rules. Features real-time rendering, pause/edit modes, and SciPy convolution for efficient neighbor counting on a 100x100 grid.",
          tags: ["Python", "NumPy", "SciPy", "Arcade"],
          category: "personal",
        },
        // Personal Projects - Games
        {
          title: "DUNE Imperium Game Engine",
          description:
            "Complete board game engine for DUNE: Imperium Uprising featuring AI bots, card management, combat mechanics, and both CLI and FastAPI web interfaces. Includes comprehensive test suite with 45+ test files.",
          tags: ["Python", "FastAPI", "Game AI", "TypeScript"],
          category: "personal",
        },
        {
          title: "Bouncing Balls Arena Game",
          description:
            "Arcade physics game with bouncing balls competing against shrinking concentric rings. Features real-time physics, particle effects, World Cup variant with 10 nations, and confetti animations.",
          tags: ["Python", "Arcade", "Game Physics"],
          category: "personal",
        },
        {
          title: "Card Game Statistical Analysis",
          description:
            "Monte Carlo simulation of 10 million card game matches to analyze winning strategies. Generates statistical visualizations of deck strength metrics and high-card distributions.",
          tags: ["Python", "Matplotlib", "Statistics"],
          category: "personal",
        },
        // Creative/Graphics Projects
        {
          title: "GLSL Shader Experiments",
          description:
            "Collection of fragment shaders including animated Mandelbrot set explorer with smooth zooming, kaleidoscopic pattern generators, and an interactive tweaking tool with real-time parameter controls using ModernGL and ImGui.",
          tags: ["GLSL", "ModernGL", "Fractals", "ImGui"],
          category: "personal",
        },
        // Older Projects
        {
          title: "Instagram Automation Bot",
          description:
            "Social media automation tool (2019) capable of scrolling, liking, commenting, following users, and posting pictures automatically. Built for learning web automation and API interaction patterns.",
          tags: ["Python", "Selenium", "Web Automation"],
          category: "personal",
        },
      ],
    },

    // Skills
    skills: {
      title: "Skills & Tools",
      programming: "Programming & Software",
      engineering: "Nuclear Engineering",
      programmingTools: [
        "Python",
        "Dymola",
        "OpenModelica",
        "OpenMC",
        "SciPy",
        "Pandas",
        "NumPy",
        "Git",
        "Linux",
        "Excel",
        "Power BI",
      ],
      engineeringSkills: [
        "Thermohydraulic Modeling",
        "Neutronics Simulation",
        "Monte Carlo Methods",
        "Reactor Physics",
        "Radiation Protection",
        "Dosimetry",
        "Nuclear Safety",
        "Heat Transfer Analysis",
        "Safety Demonstration",
        "Technical Reporting",
      ],
    },

    // Hobbies
    hobbies: {
      title: "Interests & Hobbies",
      items: [
        {
          title: "Reading",
          description:
            "Science fiction, technical literature, and philosophy",
        },
        {
          title: "Travel",
          description: "Exploring cultures and experiencing new perspectives",
        },
        {
          title: "Photography",
          description: "Capturing moments and architectural details",
        },
        {
          title: "Hiking",
          description: "Mountain trails and nature exploration",
        },
      ],
    },

    // Contact
    contact: {
      title: "Get In Touch",
      subtitle:
        "Interested in discussing nuclear engineering projects, research collaborations, or career opportunities? Feel free to reach out.",
      info: "Contact Information",
      email: "Email",
      location: "Location",
      phone: "Phone",
      connect: "Connect with me",
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        message: "Message",
        messagePlaceholder: "Your message...",
        send: "Send Message",
        sending: "Sending...",
        success:
          "Message sent! (This is a demo - connect your backend for real submissions)",
      },
    },

    // Footer
    footer: {
      description:
        "Nuclear Engineer specializing in thermohydraulic modeling and neutronics simulation for next-generation reactors.",
      quickLinks: "Quick Links",
      connect: "Connect",
      madeWith: "Made with",
      allRights: "All rights reserved.",
      backToTop: "Back to top",
    },
  },

  fr: {
    // Navigation
    nav: {
      home: "Accueil",
      about: "Parcours",
      projects: "Projets",
      skills: "Compétences",
      hobbies: "Loisirs",
      contact: "Contact",
    },

    // Hero
    hero: {
      title: "Valentin Revert",
      subtitle: "Ingénieur Nucléaire",
      location: "Paris, France",
      viewWork: "Voir Mes Projets",
      getInTouch: "Me Contacter",
    },

    // About
    about: {
      title: "Mon Parcours",
      workExperience: "Expérience Professionnelle",
      academicStudies: "Formation Académique",
      languages: "Langues",
    },

    // Experience
    experience: [
      {
        title: "Ingénieur Thermohydraulique",
        company: "NAAREA",
        location: "Nanterre, France",
        period: "01/2025 - Présent",
        description: [
          "Modélisation des circuits hydrauliques du réacteur à neutrons rapides XAMR pour évaluer le comportement thermique, hydraulique et neutronique lors de transitoires accidentels à des fins de démonstration de sûreté.",
          "Supervision des études d'accidents pour orienter la conception des équipements du réacteur.",
          "Développement d'outils de calcul : modèles hydrauliques et thermiques, automatisation des simulations et post-traitement des fichiers pour l'analyse des données. Gestion du processus d'optioneering pour le système de drainage du réacteur.",
        ],
        technologies: ["Modelica", "Dymola", "Python", "Git"],
      },
      {
        title: "Stage de Fin d'Études - Neutronique",
        company: "NAAREA",
        location: "Nanterre, France",
        period: "04/2024 - 10/2024",
        description: [
          "Développement d'un outil numérique couplant des simulations neutroniques (OpenMC) et thermiques (SciPy) pour modéliser les variations de température dans les systèmes d'arrêt d'urgence.",
          "Modélisation thermique 2D d'un cœur d'échangeur de chaleur à plaques.",
        ],
        technologies: ["Linux", "OpenMC", "SciPy"],
      },
      {
        title: "Stage Ingénieur Contrats - HPC",
        company: "Assystem / Edvance",
        location: "Montrouge, France",
        period: "04/2023 - 09/2023",
        description: [
          "Gestion des contrats liés aux équipements fournisseurs pour l'EPR HPC. Développement d'un outil pour automatiser le suivi de l'état des documents contractuels.",
        ],
        technologies: ["Excel", "Power BI"],
      },
    ],

    // Education
    education: [
      {
        degree: "Diplôme d'Ingénieur - Génie Nucléaire",
        institution: "IMT Atlantique",
        location: "Nantes, France",
        period: "09/2021 - 09/2024",
        description: [
          "Admission sur concours commun des Écoles des Mines.",
          "Spécialisation en Génie Nucléaire : physique nucléaire, dosimétrie, radioprotection, simulation Monte Carlo, physique des réacteurs, propulsion nucléaire.",
        ],
      },
      {
        degree: "Échange Universitaire",
        institution: "Université de Tokyo (UTokyo)",
        location: "Tokyo, Japon",
        period: "09/2023 - 02/2024",
        description: [
          "Programme de recherche d'un semestre à l'Université de Tokyo au Laboratoire de Chimie des Rayonnements Ionisants.",
          "Études en sûreté nucléaire, matériaux et combustibles, non-prolifération, gestion des accidents graves, applications des rayonnements ionisants.",
        ],
      },
      {
        degree: "Classes Préparatoires (MPSI - PSI*)",
        institution: "Fénelon Sainte Marie",
        location: "Paris, France",
        period: "09/2019 - 07/2021",
        description: [
          "Préparation intensive aux concours d'entrée des grandes écoles d'ingénieurs françaises.",
          "Focus sur les mathématiques, la physique et les sciences de l'ingénieur.",
        ],
      },
    ],

    // Languages spoken
    spokenLanguages: [
      { language: "Français", level: "Langue maternelle" },
      { language: "Anglais", level: "IELTS 7.5/9 (C1)" },
      { language: "Espagnol", level: "B2" },
      { language: "Japonais", level: "A1" },
    ],

    // Projects
    projects: {
      title: "Projets & Travaux",
      subtitle:
        "Outils d'ingénierie professionnels, projets personnels de programmation et expériences créatives couvrant la simulation nucléaire, la visualisation physique et le développement logiciel.",
      categories: {
        professional: "Professionnel",
        personal: "Personnel",
        academic: "Académique",
      },
      items: [
        // Projets Professionnels
        {
          title: "Automatisation Simulations Dymola",
          description:
            "Automatisation complète du processus de lancement des simulations Dymola via l'interface Python-Dymola. Permet de lancer des centaines de simulations automatiquement, éliminant la supervision manuelle et économisant un temps d'ingénierie considérable sur les études de transitoires complexes.",
          tags: ["Python", "Dymola", "Automatisation"],
          category: "professional",
        },
        {
          title: "Suite de Post-Traitement Simulations",
          description:
            "Pipeline d'analyse de données pour traiter de grands volumes de résultats Dymola. Utilise Pandas et Matplotlib pour analyser rapidement des scénarios complexes sur le réacteur à neutrons rapides XAMR, permettant aux ingénieurs d'extraire des insights de centaines de fichiers efficacement.",
          tags: ["Python", "Pandas", "Matplotlib", "Analyse de Données"],
          category: "professional",
        },
        {
          title: "Outil Couplage Neutronique-Thermique",
          description:
            "Outil numérique combinant des simulations neutroniques Monte Carlo OpenMC avec des calculs thermiques SciPy pour modéliser les variations de température dans les systèmes d'arrêt d'urgence pour l'analyse de sûreté des réacteurs nucléaires.",
          tags: ["OpenMC", "SciPy", "Python", "Monte Carlo"],
          category: "professional",
        },
        // Projets Académiques
        {
          title: "Calculateur Autonomie Batterie VE",
          description:
            "Projet en partenariat avec Ventura Systems utilisant l'API Google Maps pour déterminer les profils de vitesse moyenne d'un véhicule sur n'importe quel trajet. Intégré avec une simulation MATLAB pour calculer les besoins en batterie des véhicules électriques.",
          tags: ["Google Maps API", "MATLAB", "Simulation VE"],
          category: "academic",
        },
        // Projets Personnels - Simulations
        {
          title: "Simulation N-Corps Galactique",
          description:
            "Simulation astrophysique à grande échelle modélisant plus de 20 000 particules avec une physique gravitationnelle réaliste. Algorithme Barnes-Hut pour performance O(N log N), compilation JIT Numba, génération de galaxies spirales et scénarios de collision.",
          tags: ["Python", "NumPy", "Numba", "Arcade"],
          category: "personal",
        },
        {
          title: "Visualiseur Chaos Pendule Double",
          description:
            "Visualisation interactive de la dynamique chaotique avec plusieurs pendules doubles couplés. Démontre la sensibilité aux conditions initiales avec des traînées de mouvement colorées. Physique entièrement vectorisée avec optimisation Numba.",
          tags: ["Python", "NumPy", "Numba", "Physique"],
          category: "personal",
        },
        {
          title: "Jeu de la Vie de Conway",
          description:
            "Implémentation d'automate cellulaire interactif avec règles de naissance/survie configurables. Rendu temps réel, modes pause/édition, et convolution SciPy pour comptage efficace des voisins sur une grille 100x100.",
          tags: ["Python", "NumPy", "SciPy", "Arcade"],
          category: "personal",
        },
        // Projets Personnels - Jeux
        {
          title: "Moteur de Jeu DUNE Imperium",
          description:
            "Moteur de jeu de plateau complet pour DUNE: Imperium Uprising avec bots IA, gestion de cartes, mécaniques de combat, et interfaces CLI et web FastAPI. Suite de tests complète avec plus de 45 fichiers de test.",
          tags: ["Python", "FastAPI", "IA de Jeu", "TypeScript"],
          category: "personal",
        },
        {
          title: "Jeu d'Arène Balles Rebondissantes",
          description:
            "Jeu de physique arcade avec des balles rebondissantes en compétition contre des anneaux concentriques rétrécissants. Physique temps réel, effets de particules, variante Coupe du Monde avec 10 nations, et animations de confettis.",
          tags: ["Python", "Arcade", "Physique de Jeu"],
          category: "personal",
        },
        {
          title: "Analyse Statistique Jeu de Cartes",
          description:
            "Simulation Monte Carlo de 10 millions de parties de cartes pour analyser les stratégies gagnantes. Génère des visualisations statistiques des métriques de force de deck et distributions de cartes hautes.",
          tags: ["Python", "Matplotlib", "Statistiques"],
          category: "personal",
        },
        // Projets Créatifs/Graphiques
        {
          title: "Expérimentations Shaders GLSL",
          description:
            "Collection de fragment shaders incluant un explorateur Mandelbrot animé avec zoom fluide, générateurs de motifs kaléidoscopiques, et un outil de réglage interactif avec contrôles temps réel via ModernGL et ImGui.",
          tags: ["GLSL", "ModernGL", "Fractales", "ImGui"],
          category: "personal",
        },
        // Anciens Projets
        {
          title: "Bot d'Automatisation Instagram",
          description:
            "Outil d'automatisation réseaux sociaux (2019) capable de défiler, liker, commenter, suivre des utilisateurs et poster des images automatiquement. Développé pour apprendre l'automatisation web et les patterns d'interaction API.",
          tags: ["Python", "Selenium", "Automatisation Web"],
          category: "personal",
        },
      ],
    },

    // Skills
    skills: {
      title: "Compétences & Outils",
      programming: "Programmation & Logiciels",
      engineering: "Génie Nucléaire",
      programmingTools: [
        "Python",
        "Dymola",
        "OpenModelica",
        "OpenMC",
        "SciPy",
        "Pandas",
        "NumPy",
        "Git",
        "Linux",
        "Excel",
        "Power BI",
      ],
      engineeringSkills: [
        "Modélisation Thermohydraulique",
        "Simulation Neutronique",
        "Méthodes Monte Carlo",
        "Physique des Réacteurs",
        "Radioprotection",
        "Dosimétrie",
        "Sûreté Nucléaire",
        "Analyse Transfert Thermique",
        "Démonstration de Sûreté",
        "Rédaction Technique",
      ],
    },

    // Hobbies
    hobbies: {
      title: "Centres d'Intérêt",
      items: [
        {
          title: "Lecture",
          description:
            "Science-fiction, littérature technique et philosophie",
        },
        {
          title: "Voyages",
          description:
            "Explorer les cultures et découvrir de nouvelles perspectives",
        },
        {
          title: "Photographie",
          description: "Capturer des moments et des détails architecturaux",
        },
        {
          title: "Randonnée",
          description: "Sentiers de montagne et exploration de la nature",
        },
      ],
    },

    // Contact
    contact: {
      title: "Me Contacter",
      subtitle:
        "Intéressé par des projets d'ingénierie nucléaire, des collaborations de recherche ou des opportunités de carrière ? N'hésitez pas à me contacter.",
      info: "Coordonnées",
      email: "Email",
      location: "Localisation",
      phone: "Téléphone",
      connect: "Retrouvez-moi sur",
      form: {
        name: "Nom",
        namePlaceholder: "Votre nom",
        email: "Email",
        emailPlaceholder: "votre.email@exemple.com",
        message: "Message",
        messagePlaceholder: "Votre message...",
        send: "Envoyer",
        sending: "Envoi en cours...",
        success:
          "Message envoyé ! (Ceci est une démo - connectez votre backend pour de vraies soumissions)",
      },
    },

    // Footer
    footer: {
      description:
        "Ingénieur Nucléaire spécialisé en modélisation thermohydraulique et simulation neutronique pour les réacteurs de nouvelle génération.",
      quickLinks: "Liens Rapides",
      connect: "Réseaux",
      madeWith: "Fait avec",
      allRights: "Tous droits réservés.",
      backToTop: "Retour en haut",
    },
  },
};

export type Translations = typeof translations.en;
