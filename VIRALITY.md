# Reign Supreme — Idées pour rendre le jeu viral

## 1. OG Meta Tags ✅
Balises `og:title`, `og:description`, `og:image` + Twitter Card dans `index.html`. Image 1200×630 dans `/public/og-image.png`. Chaque lien partagé devient une pub gratuite.

## 2. Carte de score emoji style Wordle ✅
Le texte de partage génère une grille visuelle (👑 = correct, 💀 = raté) via `buildShareText()` dans `App.jsx`. Partage via `navigator.share` (mobile) ou copie dans le presse-papiers (desktop).
```
Reign Supreme 👑
Score : 7
👑👑👑👑👑👑👑💀

https://...
```

## 3. Défi du jour (2–3 h)
Même séquence de dirigeants pour tout le monde chaque jour (générée par la date comme seed). Effet Wordle : comparaison sociale + habitude de revenir chaque jour. Ajouter un compteur de jours consécutifs en localStorage.

## 4. Badges et paliers de score ✅
Titre attribué à chaque score, affiché sur l'écran de fin et dans le texte de partage :
- 0–2 : ⚔️ Vassal
- 3–5 : 🎖️ Duc
- 6–9 : 🤴 Roi
- 10–14 : 🏛️ Empereur
- 15+ : 👑 Souverain Suprême

Implémenté via `getBadge(score)` dans `App.jsx`. Badge visible sur game over + inclus dans le share text.

## 5. Lien de défi direct ✅
Lien `?challenge=7` qui affiche "Peux-tu battre un score de 7 ?" sur le menu. Le share génère automatiquement un lien `?challenge=N` avec le score du joueur. Implémenté via URL params + `challengeBanner` i18n.

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

> **Note :** `navigator.share` est déjà utilisé pour le partage texte (idée 2). Il reste à ajouter la génération d'image (idée 9) puis passer le fichier image dans le share.

---

## Statut d'implémentation

| # | Idée | Statut | Notes |
|---|------|--------|-------|
| 1 | OG Meta Tags | ✅ Done | `index.html` + `public/og-image.png` |
| 2 | Carte emoji Wordle | ✅ Done | `buildShareText()` → 👑/💀 grid + `navigator.share` / clipboard |
| 3 | Défi du jour | ❌ À faire | Seed par date, streak localStorage |
| 4 | Badges / titres | ✅ Done | `getBadge(score)` → game over + share text |
| 5 | Lien de défi direct | ✅ Done | `?challenge=N` URL param + banner menu + share URL |
| 6 | Classement hebdo | ❌ À faire | Colonne `week` Supabase |
| 7 | Leader le plus raté | ❌ À faire | Nécessite tracking serveur |
| 8 | Mode 1v1 | ❌ À faire | Plus gros chantier |
| 9 | Capture PNG | ❌ À faire | Canvas API côté client |
| 10 | Partage natif image | ⚠️ Partiel | Share texte OK, manque génération image (dépend de #9) |

## Priorité suggérée (restant)

| Priorité | Idée | Effort | Impact viral |
|----------|------|--------|--------------|
| 1 | Défi du jour | Moyen | Très élevé (habitude quotidienne) |
| 2 | Capture d'écran PNG | Moyen | Élevé (Instagram/Discord) |
| 3 | Partage natif image | Faible (si #2 fait) | Élevé (WhatsApp/iMessage) |
| 4 | Classement hebdo | Moyen | Moyen (renouvellement) |
| 5 | Leader le plus raté | Moyen | Moyen (curiosité) |
| 6 | Mode 1v1 | Élevé | Maximum |
