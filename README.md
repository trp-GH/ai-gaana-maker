# 🎵 AI Gaana Maker

> Turn your lyrics into AI-generated song concepts — in any genre, Hindi or English.

**Live demo:** `https://<your-username>.github.io/ai-gaana-maker`

---

## Features

- **AI-Powered** — Uses Claude AI (Anthropic) to analyze your lyrics and generate a full song concept: title, mood, tempo, key, instruments, hook, song structure, and similar artists
- **14 Genres** — Bollywood, Pop, Rock, Rap/Hip-Hop, Ghazal, Qawwali, EDM, Bhajan, Classical, Punjabi Folk, Romantic, Sad, House, Techno
- **8 Mood Options** — Optionally guide the AI's emotional direction
- **Audio Preview** — Sample audio track plays with each generated song
- **Song Detail Modal** — Click any song card to see full AI-generated details
- **Local Library** — All songs saved in browser localStorage (no login needed)
- **Credits System** — 5 free credits per browser session
- **Dark Studio UI** — Polished dark theme with smooth animations

---

## Project Structure

```
ai-gaana-maker/
├── index.html            ← Main HTML (entry point)
├── assets/
│   └── favicon.svg       ← App icon
├── css/
│   ├── reset.css         ← CSS reset
│   ├── variables.css     ← Design tokens (colors, spacing, radius)
│   ├── layout.css        ← Header, tabs, hero, page layout
│   ├── components.css    ← Cards, buttons, modals, inputs, toast
│   └── animations.css    ← All keyframe animations
└── js/
    ├── data.js           ← Static data (genres, moods, audio URLs)
    ├── api.js            ← Claude API integration
    ├── audio.js          ← Audio playback management
    ├── ui.js             ← Render helpers (cards, modal, toast, chips)
    └── app.js            ← Main state + event handlers
```

---

## Run Locally

No build step — pure HTML/CSS/JS.

```bash
# Clone
git clone https://github.com/<your-username>/ai-gaana-maker.git
cd ai-gaana-maker

# Open in browser directly
open index.html

# OR use a local dev server
npx serve .
# then open http://localhost:3000
```

---

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/ (root)` → **Save**
4. Wait ~1 minute → live at `https://<username>.github.io/ai-gaana-maker`

---

## Testing Checklist

- [ ] Page loads without errors in browser console
- [ ] Genre chips highlight correctly on click
- [ ] Mood chips toggle on/off on click
- [ ] Character counter updates as you type
- [ ] Generate button calls the AI API and shows status messages
- [ ] Song card appears with title, tags, hook, instruments
- [ ] Clicking a song card opens the detail modal
- [ ] Play button plays audio preview
- [ ] Library tab shows all saved songs
- [ ] Credits decrease after each generation
- [ ] Songs persist after page refresh
- [ ] Mobile layout looks correct on small screens

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript (ES2020) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Storage | Browser `localStorage` |
| Fonts | Google Fonts (Syne + DM Sans) |
| Audio | HTML5 `<audio>` API |
| Hosting | GitHub Pages (static) |

---

## License

MIT — free to use, modify and deploy.
