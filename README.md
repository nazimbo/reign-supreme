# 👑 Reign Supreme

A higher/lower guessing game about world leaders and how long they ruled.

## How to play

Two leaders are shown side by side. One has their reign duration revealed — guess whether the challenger ruled for **longer** or **shorter**. Each correct answer advances the streak. The game ends on the first mistake.

A historical fun fact is revealed after each correct answer and on the game over screen (can be toggled off from the menu).

## Features

- **Global leaderboard** — submit your score with a username after any game; scores are persisted in Supabase. The submission form also appears at the top of the leaderboard screen if you navigate there without submitting first.
- **Score validation** — all-whitespace names are rejected (red border); a live character counter (`X/20`) is shown while typing.
- **Fun facts toggle** — enable or disable historical facts from the main menu; preference is saved to `localStorage`.
- **High score** — best session score persisted in `localStorage`.
- **Portraits** — Wikipedia CDN photos where available; falls back to a per-leader colour gradient.
- **EN / FR** — full bilingual support (UI, facts, instructions).

## Stack

- **Vite** + **React 18**
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **Supabase** for leaderboard persistence

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The leaderboard uses a `scores` table and a `submit_score(p_name, p_score)` RPC function in Supabase.

## Project structure

```
reign-supreme/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        # game logic & UI
│   ├── main.jsx       # React entry point
│   ├── index.css      # Tailwind directives
│   ├── leaders.json   # world leaders dataset
│   ├── i18n.js        # EN / FR translations
│   └── supabase.js    # Supabase client
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Dataset

Each leader entry in `src/leaders.json`:

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
