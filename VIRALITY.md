# Reign Supreme — Idées pour rendre le jeu viral

## 1. OG Meta Tags (10 min)
Quand quelqu'un partage le lien sur Twitter/WhatsApp/iMessage, il y a un aperçu vide. Ajouter les balises `og:title`, `og:description`, `og:image` dans `index.html` et une image 1200×630 dans `/public/og-image.png`. Chaque lien partagé devient une pub gratuite.

## 2. Carte de score emoji style Wordle (30 min)
Remplacer le texte de partage générique par une grille visuelle :
```
Reign Supreme 👑
Score : 7
👑👑👑👑👑👑👑❌

Jouer : https://...
```
Le visuel attire l'œil dans un fil d'actualité. Les gens reconnaissent le format Wordle et cliquent.

## 3. Défi du jour (2–3 h)
Même séquence de dirigeants pour tout le monde chaque jour (générée par la date comme seed). Effet Wordle : comparaison sociale + habitude de revenir chaque jour. Ajouter un compteur de jours consécutifs en localStorage.

## 4. Badges et paliers de score (1 h)
Attribuer un titre à chaque score atteint — affiché sur l'écran de fin et dans le texte de partage :
- 0–2 : Vassal
- 3–5 : Duc
- 6–9 : Roi
- 10–14 : Empereur
- 15+ : Souverain Suprême 👑

"J'ai atteint le rang d'Empereur dans Reign Supreme 👑" → plus mémorable qu'un simple chiffre.

## 5. Lien de défi direct (1 h)
Générer un lien `?challenge=7` qui affiche "Peux-tu battre un score de 7 ?" à l'accueil. Le joueur qui reçoit le lien a un objectif précis, pas juste "joue à ce jeu". Friction minimale, motivation maximale.

## 6. Classement hebdomadaire / reset (30 min)
Avoir une colonne `week` dans Supabase et afficher un classement de la semaine en cours. Le reset hebdomadaire crée un sentiment d'opportunité : "Cette semaine je peux être premier."

## 7. Affichage du dirigeant le plus souvent raté (passif)
Sur l'écran de fin, afficher "72 % des joueurs se trompent sur Ramsès II". Crée une envie de revenir pour "corriger" l'erreur et de partager l'anecdote.

## 8. Mode 1v1 en temps réel (3–5 h)
Deux joueurs voient la même paire et répondent en simultané. Le premier à répondre correctement gagne le round. Compétition directe = le canal de partage le plus fort qui existe ("viens jouer contre moi").

## 9. Capture d'écran du podium (1 h)
Bouton "Copier mon score" qui génère côté client (Canvas API) une image PNG avec le nom du joueur, le score, et le classement mondial. Image collable directement dans Instagram Stories ou Discord.

## 10. Partage natif avec image (30 min)
Sur mobile, l'API `navigator.share` accepte des fichiers. Générer l'image Canvas et la passer dans `navigator.share({ files: [imageFile] })` pour que l'image apparaisse directement dans WhatsApp/iMessage, pas juste un lien.

---

## Priorité suggérée

| Priorité | Idée | Effort | Impact viral |
|----------|------|--------|--------------|
| 1 | OG Meta Tags | Très faible | Élevé (chaque lien) |
| 2 | Carte emoji Wordle | Faible | Élevé (rétention visuelle) |
| 3 | Lien de défi direct | Faible | Très élevé (invite ciblée) |
| 4 | Badges / titres | Moyen | Moyen (identité) |
| 5 | Défi du jour | Moyen | Très élevé (habitude quotidienne) |
| 6 | Capture d'écran PNG | Moyen | Élevé (Instagram/Discord) |
| 7 | Mode 1v1 | Élevé | Maximum |
