# Fedi Limem : base de connaissances

## Profil
Élève ingénieur tunisien, dernière année du cycle ingénieur IA & Data Science à ITEAM (Tunis). Parti de l'IoT et de l'embarqué, passionné par les modèles de langage. Accroche : « Je construis une IA qui cite ses sources et résout de vraies contraintes. » Il aime tout le chemin, du jeu de données jusqu'à l'outil que les gens utilisent vraiment.
Contact : fedilimem7@gmail.com · linkedin.com/in/fedi-limem-8808a8279 · github.com/fedifedifedi · fedifedifedi.github.io (CV en FR et EN).

## Points forts (d'après ses projets)
- IA fiable : ses assistants citent leurs sources et disent quand l'information manque (DocBot, LMAgent).
- Bout en bout : des données à l'outil utilisable (FediDraw qui tourne dans le navigateur, DocBot complet avec son espace admin, chatbot Gradio livré chez Talan).
- Évaluation honnête et chiffrée : 92,8 % (FediDraw), 81 % (PrediT'Kick).
- Profil large : LLM/RAG, deep learning et vision, ML classique, optimisation sous contraintes, DevOps, IoT.
- Recommandation de Salah Sammari (Fondateur, CEO & CTO, Tradrly IT Solutions) : « Je recommande Fedi Limem fortement et sans réserve pour tout poste en data science, machine learning ou IA. »

## Expérience
- Wind Consulting, Tunisie (été 2026), DevOps & automatisation IA : plateforme ChatOps sécurisée pour gérer l'infrastructure depuis Telegram ; 16 microservices StackStorm, secrets Vault, mémoire vectorielle Qdrant avec RAG (GPT-4o mini), monitoring Grafana, Docker. Livrée à l'équipe ; projet interne.
- Talan Tunisie (juin–août 2025), stagiaire IA : fine-tuning de Qwen2.5-Coder-0.5B avec LoRA sur les bonnes pratiques logicielles (Java, SOLID, Clean Code, Git, SonarQube), servi en chatbot Gradio avec historique ; projet interne.

## Formation
Ingénieur IA & Data Science, ITEAM University, Tunis (2025–2027) · 1re année cycle ingénieur, génie informatique, ESPRIT Monastir (2024–2025) · Licence systèmes informatiques, IoT & embarqué, ISI Mahdia (2024) · Bac sciences expérimentales (2021).

## Projets
- Panacea : plateforme IA qui relit l'herbier de Nicholas Culpeper (1653) pour retrouver les remèdes oubliés et dégager des pistes de recherche ; 328 plantes découpées, 24 fiches structurées par LLM (Gemini) avec citations vérifiées mot pour mot, 4 324 molécules (Wikidata) et 15 753 articles PubMed croisés ; score de « piste innovante » (usage ancien riche, peu étudiée), graphe de connaissances, assistant RAG hybride (BM25 + embeddings, recherche PubMed ciblée) qui sépare savoir ancien et science moderne, avec mode de secours si le LLM ne répond pas. Python, Gemini, Streamlit, Plotly. Code sur github.com/fedifedifedi/panacea.
- Door Bina : application web de jeu de piste à vélo à travers 8 lieux de Carthage (Dar El Hout, Byrsa, cathédrale Saint-Louis, Beït al-Hikma, théâtre romain…). Voyage 3D temps réel (Three.js / WebGL) avec monuments low-poly et position GPS du visiteur en direct, détection automatique de l'arrivée sur un lieu ; carte Leaflet ; audioguide en français, anglais, arabe et derja tunisienne (voix neuronales, 2 voix par langue) ; interface multilingue avec arabe de droite à gauche ; à chaque étape une question et une lettre cachée, des tampons dans un passeport numérique, et un classement par QR codes de score signés (le groupe en tête gagne un cadeau historique). HTML, CSS, JavaScript sans framework, déployé sur GitHub Pages. Site : fedifedifedi.github.io/door-bina ; code sur github.com/fedifedifedi/door-bina.
- DocBot : assistant RAG pour PME ; répond à partir des documents de l'entreprise, renvoie au passage exact et dit quand l'info n'existe pas ; espace admin (documents, historique). Next.js, Prisma, PostgreSQL. Vidéo de démo disponible ; code sur github.com/fedifedifedi/docbot.
- FediDraw : reconnaît un dessin pendant qu'on le trace ; CNN PyTorch entraîné sur 300 000 dessins Quick Draw, 92,8 % de précision sur 30 catégories (98 % top 5), modèle ONNX de 1,5 Mo dans le navigateur sans serveur, Lighthouse 100. PyTorch, ONNX, TypeScript, Vite.
- LMAgent : agent qui rédige une lettre de motivation par offre à partir d'un CV (PDF ou photo) ; chaque phrase cite sa source dans le profil, puis critique, réécriture et export PDF. Next.js, TypeScript, Gemini, Zod, Prisma, libSQL.
- FediSonar : prototype réalisé en une journée pour un entretien INRAE ; détecte les objets en mouvement dans des vidéos de caméra acoustique, vers le comptage automatique de poissons migrateurs. Python, OpenCV, vision par ordinateur. Code sur github.com/fedifedifedi/fedisonar.
- Fedi's Planner : emplois du temps scolaires sans conflit avec CP-SAT ; replanification minimale en cas d'absence, explique les contraintes contradictoires ; modèle réduit d'un facteur 14, scores 3 à 6× meilleurs qu'un glouton. Python, OR-Tools, FastAPI, Next.js, pytest.
- PrediT'Kick (ITEAM, avec Oussama Jbeli) : analyse football sur 9 048 joueurs FIFA 23, 245 équipes, 58 892 matchs ; 81 % de précision sur les postes. Python, Random Forest, XGBoost.
- TaskApp : gestionnaire de tâches full-stack (statuts, échéances, filtres, tableau de bord). Express, React, Prisma, PostgreSQL, Zod, tests Playwright, CI, Docker. Code sur github.com/fedifedifedi/taskapp.
- KπBIOS : plateforme IA, données, IoT et génie logiciel pour transformer les données d'entreprise en décisions.
- Assistant de révision : PDF de cours transformés en réponses sourcées, fiches et quiz, avec répétition espacée.
- Smart Water Management (IoT) : suivi de la consommation d'eau, détection d'usages anormaux, alertes temps réel.
- DiagSein IA (ITEAM, avec Oussama Jbeli) : aide au diagnostic du cancer du sein par machine learning.
- Ask Fedi : cet assistant ; un LLM qui répond uniquement à partir de cette base de connaissances, servi par un Worker Cloudflare qui garde la clé API côté serveur. API Groq, JavaScript.

## Compétences
IA générative : LoRA, RAG, agents LLM, sorties structurées (Zod), prompt engineering, Qwen2.5-Coder, Gemini, GPT-4o mini, Qdrant. ML & optimisation : Python, Random Forest, XGBoost, exploration et modélisation de données, OR-Tools CP-SAT. Vision : PyTorch, CNN, OpenCV, ONNX. DevOps : StackStorm, Vault, Docker, Grafana, microservices, Git, pytest. Web : Next.js, React, TypeScript, FastAPI, Prisma, Gradio, PHP/Symfony, Java. Bases : PostgreSQL, MySQL, SQL Server, SQLite. IoT : Arduino, ESP32, capteurs.

## Certifications
Get Started with Databricks for Generative AI (Databricks × Simplilearn, oct. 2026) · Machine Learning Using Python (Simplilearn, oct. 2026) · Excel Dashboard for Beginners (Microsoft × Simplilearn, oct. 2026) · Artificial Intelligence Masterclass + ChatGPT Prize (Udemy, avr. 2026) · Python et SQL pour débutants (Udemy, févr. 2026) · Langage Python (Spectrum Training Center, 2022). Les cours Simplilearn sont des attestations de fin de cours, pas des certifications officielles Databricks ou Microsoft.

## Langues
Arabe (maternelle), français (courant), anglais (intermédiaire), espagnol (intermédiaire).

## Centres d'intérêt
Football, veille IA et nouvelles technologies, montage vidéo et création de contenu.
