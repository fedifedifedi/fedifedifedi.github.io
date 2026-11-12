# Base de connaissances : Fedi Limem

Source unique de l'assistant « Ask Fedi » du portfolio https://fedifedifedi.github.io.
Tout ce qui n'est pas écrit ici est inconnu de l'assistant.
Les lignes marquées [À COMPLÉTER] sont à remplir par Fedi ; tant qu'elles restent ainsi,
l'assistant doit considérer l'information comme non disponible.

## Identité et contact

- Nom : Fedi Limem.
- Profil : élève ingénieur tunisien, en dernière année du cycle ingénieur en IA et Data Science à ITEAM (Tunisie).
- Accroche du portfolio : « Je construis une IA qui cite ses sources et résout de vraies contraintes. »
- Titre sur sa carte de visite : AI Engineer.
- E-mail : fedilimem7@gmail.com
- LinkedIn : https://www.linkedin.com/in/fedi-limem-8808a8279/
- GitHub : https://github.com/fedifedifedi
- Portfolio : https://fedifedifedi.github.io (CV téléchargeable en français et en anglais).

## Présentation (texte « À propos » du portfolio)

Fedi a commencé par l'IoT et les systèmes embarqués, puis s'est passionné pour les modèles de langage.
Depuis, il a fine-tuné Qwen avec LoRA, construit des assistants RAG qui citent leurs sources,
branché une plateforme ChatOps sur Telegram, appris à un modèle à prédire des matchs de football,
construit un agent qui écrit des lettres de motivation sans rien inventer, et un solveur qui construit
des emplois du temps scolaires. Il aime tout le chemin, du jeu de données jusqu'à l'outil que les gens
utilisent vraiment.

## Points forts

Ce que le portfolio met en avant :
- Une IA fiable : ses assistants citent leurs sources et disent quand l'information n'existe pas
  (DocBot, LMAgent), au lieu d'inventer.
- Le projet de bout en bout : des données jusqu'à un outil déployé et utilisable (DocBot déployé sur
  Railway, FediDraw qui tourne dans le navigateur, chatbot Gradio livré chez Talan).
- Une évaluation honnête et mesurée : FediSonar est évalué avec une séparation stricte réglage/test ;
  FediDraw atteint 92,8 % de précision sur 30 catégories ; PrediT'Kick 81 % sur les postes des joueurs.
- Un profil large : LLM et RAG, deep learning et vision, machine learning classique, optimisation sous
  contraintes (CP-SAT), DevOps et IoT.
- Une recommandation écrite de Salah Sammari (Fondateur, CEO & CTO de Tradrly IT Solutions) :
  « Je recommande Fedi Limem fortement et sans réserve pour tout poste en data science, machine
  learning ou IA. » La lettre complète est en PDF sur le portfolio.

[À COMPLÉTER] Points forts formulés par Fedi lui-même, avec un exemple concret pour chacun.
[À COMPLÉTER] Qualités humaines et façon de travailler en équipe (soft skills).

## Ce qu'il fait (domaines)

1. Fine-tuning de LLM : adapter des modèles de langage à un domaine avec LoRA, de la préparation des
   données jusqu'à un chatbot que l'on peut tester.
2. RAG et assistants IA : des assistants qui répondent à partir de vos propres documents et montrent
   d'où vient chaque réponse, grâce à la recherche vectorielle.
3. Machine learning et données : nettoyer, explorer et modéliser de vrais jeux de données avec
   Random Forest, XGBoost et la stack Python habituelle.
4. DevOps et automatisation : microservices, gestion des secrets et monitoring, pour que les outils
   d'IA tournent en sécurité hors du notebook.
5. IoT et systèmes embarqués : capteurs, surveillance en temps réel et alertes, le domaine par lequel
   il a commencé.
6. Optimisation et planification : transformer des règles réelles en modèles solubles grâce à la
   programmation par contraintes, et expliquer le résultat quand il n'y en a pas.

## Expérience

### Wind Consulting (Tunisie) : DevOps & automatisation IA, été 2026
Plateforme ChatOps sécurisée qui permet aux ingénieurs de gérer l'infrastructure depuis Telegram :
16 microservices orchestrés avec StackStorm, secrets dans HashiCorp Vault, mémoire vectorielle Qdrant
avec une couche RAG (GPT-4o mini) qui répond aux questions opérationnelles, monitoring Grafana,
Docker. Plateforme livrée à l'équipe. Projet interne : pas de captures d'écran publiques.

### Talan Tunisie : stagiaire IA, juin à août 2025
Fine-tuning de Qwen2.5-Coder-0.5B avec LoRA sur les bonnes pratiques du génie logiciel (Java, SOLID,
Clean Code, Git, SonarQube), puis intégration dans un chatbot Gradio interactif avec historique des
échanges, livré prêt à l'emploi. Projet interne : pas de captures d'écran publiques.

## Formation

- 2025 – 2027 : diplôme d'ingénieur, IA & Data Science, ITEAM University, Tunis (2e et 3e années du cycle ingénieur ; dernière année en cours).
- 2024 – 2025 : 1re année du cycle ingénieur en génie informatique, ESPRIT Monastir.
- 2024 : licence en ingénierie des systèmes informatiques, IoT & embarqué, ISI Mahdia.
- 2021 : baccalauréat sciences expérimentales, lycée de Ksour Essef.

## Projets

### DocBot (projet personnel)
Assistant RAG pour les petites entreprises : on importe les documents de l'entreprise, on pose des
questions en langage naturel, et les réponses sont fondées sur ces fichiers. Chaque réponse renvoie
au passage exact du document ; quand l'information n'existe pas, DocBot le dit au lieu d'inventer.
Espace administrateur protégé par mot de passe : ajout de documents et historique des conversations.
Technologies : Next.js, Prisma, PostgreSQL. Déployé sur Railway.
Code : https://github.com/fedifedifedi/docbot
[À COMPLÉTER] Lien vers la démo en ligne, modèle LLM et méthode de recherche utilisés.

### FediDraw : reconnaissance de dessins en temps réel (projet personnel)
Une IA qui reconnaît un dessin pendant qu'on le trace. Un CNN entraîné avec PyTorch sur 300 000 dessins
Quick Draw atteint 92,8 % de précision sur 30 catégories (98 % en top 5). Le modèle ONNX de 1,5 Mo
tourne directement dans le navigateur, sans serveur (environ 1 ms). Mode jeu et page qui explique
son fonctionnement. Score Lighthouse de 100.
Technologies : PyTorch, ONNX, TypeScript, Vite.
Code : https://github.com/fedifedifedi/fedidraw

### LMAgent : agent IA de lettres de motivation (projet personnel)
Rédige une lettre adaptée à chaque offre, directement à partir d'un CV (PDF ou photo). Chaque phrase
cite la partie du profil dont elle vient, donc l'agent ne peut rien inventer. Il analyse l'offre,
rédige, critique sa propre lettre, la réécrit et exporte un PDF propre d'une page.
Technologies : Next.js, TypeScript, Gemini, Zod, Prisma, libSQL, GSAP.
Code : https://github.com/fedifedifedi/LMAgent

### FediSonar : comptage de poissons en vidéo sonar (projet personnel)
Détecte, suit et compte les poissons dans des vidéos sonar. Évalué sur 69 clips réels du Caltech Fish
Counting Dataset avec une séparation stricte réglage/test : erreur de comptage réduite de 64,7 % à
29,7 % sur des clips jamais vus.
Technologies : Python, OpenCV, vision par ordinateur, suivi d'objets, évaluation.
Code : https://github.com/fedifedifedi/fedisonar

### Fedi's Planner : emplois du temps par optimisation (projet personnel)
Construit des emplois du temps scolaires sans conflit avec le solveur CP-SAT de Google. Quand un
enseignant est absent, il replanifie en déplaçant le moins de cours possible. Quand aucun emploi du
temps n'existe, il indique exactement quelles contraintes se contredisent. Une reformulation exacte des
contraintes de salles a réduit le modèle d'un facteur 14 (résolution 6 à 8 fois plus rapide), avec des
scores 3 à 6 fois meilleurs qu'un algorithme glouton.
Technologies : Python, OR-Tools, FastAPI, Next.js, pytest.
Code : https://github.com/fedifedifedi/fedis-planner

### Plateforme ChatOps IA (Wind Consulting)
Voir l'expérience Wind Consulting ci-dessus.

### Fine-tuning de LLM (Talan Tunisie)
Voir l'expérience Talan ci-dessus.

### PrediT'Kick (ITEAM, avec Oussama Jbeli)
Quand le machine learning rencontre le football : une plateforme d'analyse construite sur 9 048 joueurs
FIFA 23, 245 équipes et 58 892 vrais matchs. 81 % de précision sur la prédiction des postes des joueurs.
Technologies : Python, Random Forest, XGBoost.
[À COMPLÉTER] Rôle de Fedi dans ce projet à deux.

### TaskApp (projet personnel)
Gestionnaire de tâches full-stack : connexion, création de tâches, suivi du statut et des échéances,
retards visibles d'un coup d'œil, avec recherche, filtres et tableau de bord. API Express, Prisma,
PostgreSQL ; front React avec schémas Zod partagés ; tests Playwright, CI, Docker, déployé sur Railway.
Code : https://github.com/fedifedifedi/taskapp

### KπBIOS
Plateforme qui combine IA, analyse de données, IoT et génie logiciel pour transformer les données
d'entreprise en décisions.
[À COMPLÉTER] Contexte, rôle de Fedi, technologies, résultats.

### Assistant de révision (projet personnel)
Transforme des PDF de cours en réponses sourcées, fiches et quiz, avec une répétition espacée pour
planifier les révisions.
[À COMPLÉTER] Technologies et lien.

### Smart Water Management (IoT & embarqué)
Surveille la consommation d'eau, détecte les usages anormaux et envoie des alertes en temps réel.
[À COMPLÉTER] Technologies et contexte.

### DiagSein IA (ITEAM, avec Oussama Jbeli)
Outil d'aide à la décision développé pour le cours d'IA avancée, pour assister le diagnostic du cancer
du sein par machine learning.
[À COMPLÉTER] Méthode et résultats.

## Compétences

- IA générative & LLM : fine-tuning LoRA, RAG, agents LLM, sorties structurées (Zod), prompt engineering,
  Qwen2.5-Coder, API Gemini, GPT-4o mini, Qdrant (recherche vectorielle).
- ML, données & optimisation : Python, Random Forest, XGBoost, nettoyage et exploration de données,
  modélisation, OR-Tools CP-SAT.
- Deep learning & vision : PyTorch, réseaux convolutifs (CNN), augmentation de données, matrice de
  confusion, export ONNX, ONNX Runtime Web, OpenCV.
- DevOps & automatisation : StackStorm, HashiCorp Vault, Docker, Grafana, microservices, bots Telegram,
  Git / GitHub, pytest.
- Web : Next.js, React, TypeScript, Vite, FastAPI, Prisma, Gradio, GSAP, PHP / Symfony, Java / JavaFX.
- Bases de données : PostgreSQL, MySQL, SQL Server, SQLite / libSQL.
- IoT & embarqué : Arduino, ESP32, capteurs, surveillance en temps réel.

## Certifications

- Get Started with Databricks for Generative AI : Databricks × Simplilearn SkillUp, octobre 2026
  (attestation de fin de cours en ligne, pas une certification officielle Databricks).
- Machine Learning Using Python : Simplilearn SkillUp, octobre 2026.
- Excel Dashboard for Beginners : Microsoft × Simplilearn SkillUp, octobre 2026
  (attestation de fin de cours en ligne, pas une certification officielle Microsoft).
- Artificial Intelligence Masterclass + ChatGPT Prize : Udemy (SuperDataScience), avril 2026, 12 heures.
- Python et SQL pour les (grands) débutants : Udemy (ELOA Formation), février 2026, 11 heures.
- Langage de programmation Python : Spectrum Training Center, Tunis, septembre 2022, 3 jours.

## Langues

Arabe (langue maternelle), français (courant), anglais (intermédiaire), espagnol (intermédiaire).

## Centres d'intérêt (d'après son CV)

Football, veille IA et nouvelles technologies, montage vidéo et création de contenu.

## Informations non disponibles

Tout ce qui n'apparaît pas ci-dessus : préférences personnelles, vie privée, salaire, numéro de
téléphone, etc. Pour toute autre question, contacter Fedi par e-mail : fedilimem7@gmail.com.
