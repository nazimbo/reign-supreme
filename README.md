# 👑 Reign Supreme

A higher/lower guessing game about world leaders and how long they ruled.

## How to play

Two leaders are shown side by side. One has their reign duration revealed — guess whether the challenger ruled for **longer** or **shorter**. Each correct answer advances the streak. The game ends on the first mistake.

A historical fun fact is revealed after each correct answer, and again in the game over screen.

## Stack

- **Vite** + **React 18**
- **Tailwind CSS** for styling
- **lucide-react** for icons
- EN / FR language toggle

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Project structure

```
reign-supreme/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        # game logic & UI
│   ├── main.jsx       # React entry point
│   ├── index.css      # Tailwind directives
│   ├── leaders.json   # 71 world leaders dataset
│   └── i18n.js        # EN / FR translations
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Dataset

71 leaders from antiquity to the present, including monarchs, dictators, and elected officials. Each entry has:

| Field | Required | Description |
|---|---|---|
| `id` | yes | Unique integer |
| `name` | yes | Display name |
| `country` | yes | Country or empire |
| `years` | yes | Total years in power |
| `photo` | no | Wikipedia CDN portrait URL (320px). Falls back to gradient if absent or broken. |
| `factEn` | no | English fun fact shown after a correct answer |
| `factFr` | no | French fun fact (paired with `factEn`) |

## Adding leaders

Edit `src/leaders.json` — minimal entry:

```json
{ "id": 72, "name": "Leader Name", "country": "Country", "years": 15 }
```

With photo and facts:

```json
{
  "id": 72,
  "name": "Leader Name",
  "country": "Country",
  "years": 15,
  "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/.../320px-....jpg",
  "factEn": "An interesting historical anecdote.",
  "factFr": "Une anecdote historique intéressante."
}
```

IDs must be unique. The deck auto-resets when all leaders have been seen.
