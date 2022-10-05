#Construction de l'API de l'application d'évaluation Piiquante (galerie de sauces piquantes).

Fonctionnalités Du point de vue des fonctionnalités, l’API va permettre à un utilisateur :

De créer un compte et de s’y connecter système d’authentification D’accéder à tous les fonctions de l’application, à savoir Créer une sauce avec la possibilité de télécharger une image Modifier sa sauce Supprimer sa sauce D’accéder à la liste de toutes les sauces Pouvoir lire les informations d’une sauce en particulier De liker ou disliker une sauce partagée par un autre utilisateur

Technos (back-end) Node.js Express MongoDB

Installation Pré-requis : utilisation de Node.js version 14.0.0.

Back-end Dans le dossier backend, taper npm install.

Utiliser le fichier .env.example pour créer un fichier .env et remplir les informations sur la base de données, la clé de chiffrement CryptoJS et la clé secrète pour le token.

Lancement du serveur : node server ou nodemon server.

URL du serveur : http://localhost:3000.

Front-end Dans le dossier frontend, taper npm install puis npm install --save-dev run-script-os. Lancement du serveur local et du site : npm run start.

URL du site : http://localhost:8081
