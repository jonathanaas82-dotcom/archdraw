# Archdraw — Prosjektveiledning for agenter

## Prosjektoversikt
Archdraw er en avansert desktop-applikasjon for byggtegninger (arkitekttegninger).
Distribueres som `.exe` på Windows og oppdateres via GitHub Releases.

**GitHub repo:** `jonathanaas82-dotcom/archdraw`
**Eier:** jonathanaas82-dotcom

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Desktop | Electron (latest stable) |
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| Tegning | Konva.js + react-konva |
| State | Zustand |
| Styling | CSS Modules + CSS-variabler |
| Build | electron-builder (NSIS installer + portabel .exe) |
| Auto-update | electron-updater |
| CI/CD | GitHub Actions |

---

## Prosjektstruktur

```
archdraw/
├── electron/               # Main process (Node.js)
│   ├── main.ts
│   ├── preload.ts
│   ├── ipc/
│   │   ├── file-handlers.ts
│   │   ├── export-handlers.ts
│   │   └── update-handlers.ts
│   └── menu.ts
│
├── src/                    # Renderer process (React)
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── canvas/
│   │   ├── tools/
│   │   ├── panels/
│   │   └── ui/
│   ├── store/
│   │   ├── drawingStore.ts
│   │   ├── toolStore.ts
│   │   ├── viewStore.ts
│   │   ├── layerStore.ts
│   │   └── historyStore.ts
│   ├── hooks/
│   ├── types/
│   │   ├── drawing.ts
│   │   ├── tools.ts
│   │   └── project.ts
│   └── utils/
│       ├── geometry.ts
│       ├── snapping.ts
│       ├── serialization.ts
│       └── export.ts
│
├── assets/
│   ├── icon.ico
│   └── symbols/
│
├── .github/workflows/
│   ├── build.yml
│   └── release.yml
│
├── electron-builder.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Arkitekturregler (VIKTIG — følges alltid)

1. **IPC-sikkerhet:** All kommunikasjon mellom `electron/` og `src/` går via `contextBridge` i `preload.ts`. Ingen direkte Node.js-kall fra renderer.
2. **Koordinatsystem:** Skjermkoordinater (px) og verdenskoordinater (mm ved gitt målestokk) skal alltid holdes adskilt. Bruk `useCanvasCoords`-hook for konvertering.
3. **Vegger som polygoner:** Vegger representeres som 4-punkts polygoner (ikke enkle linjer) for korrekt hjørneberegning.
4. **Undo/redo:** Alle mutasjoner på `drawingStore` skal gå gjennom historikk-middleware. Bruk command-pattern.
5. **TypeScript strict:** `strict: true` i tsconfig. Ingen `any`-typer uten eksplisitt kommentar.

---

## Utviklingsfaser

### Fase 0 — Prosjektoppsett ✅ / 🔲
- [ ] npm init, Electron + Vite + React + TypeScript
- [ ] electron-builder konfigurasjon
- [ ] Første fungerende .exe
- [ ] GitHub Actions workflows

### Fase 1 — Canvas-grunnlag
- [ ] Konva Stage med zoom/pan
- [ ] Grid med justerbar størrelse
- [ ] Snap til grid og objekter
- [ ] Zustand-stores (drawing, tool, view, layer, history)
- [ ] Undo/redo (min 50 steg)
- [ ] Lagre/åpne prosjekt som JSON

### Fase 2 — Vegg-tegning
- [ ] Klikk-til-klikk vegg-verktøy
- [ ] Snap til endepunkter
- [ ] Vegg-tykkelse som parameter
- [ ] T-kryss og hjørneforbindelser
- [ ] Gummiband-forhåndsvisning

### Fase 3 — Byggelementer
- [ ] Dør-verktøy (åpningsbue)
- [ ] Vindu-verktøy (arkitektsymbol)
- [ ] Plassering i vegg med snap

### Fase 4 — Målsetting
- [ ] Dimensjoneringsverktøy
- [ ] Målpiler med tekst
- [ ] Målestokk-konvertering

### Fase 5 — Eksport og distribusjon
- [ ] PNG-eksport (høy DPI)
- [ ] PDF-eksport
- [ ] GitHub Release workflow
- [ ] Auto-update integrert

### Fase 6 — Avansert
- [ ] Lagpanel (synlighet, låsing)
- [ ] Symbolbibliotek (møbler, sanitær)
- [ ] DXF-eksport (AutoCAD-kompatibel)
- [ ] Romarealkalkulator

---

## Kodekonvensjoner

- Filnavn: `PascalCase` for komponenter, `camelCase` for utils/hooks
- Komponentfiler eksporterer én default export
- Hooks starter alltid med `use`
- Typer/interfaces i `src/types/` — ikke definer inline i komponenter
- CSS Modules: `ComponentName.module.css` ved siden av komponenten
- Tester: `ComponentName.test.tsx` ved siden av filen

---

## Agent-roller og ansvar

### Prosjektleder (pipeline-orchestrator)
- Koordinerer arbeid mellom agenter
- Bryter ned features i oppgaver
- Sporer fremdrift mot faser over
- Eskalerer blokkere til brukeren

### Arkitekt (architect-blueprint)
- Designer løsninger for nye features
- Oppdaterer denne filen ved strukturelle endringer
- Vurderer tekniske konsekvenser

### Koder (blueprint-coder)
- Implementerer fra blueprints
- Følger arkitekturreglene over
- Aldri `any`, aldri usikre IPC-kall

### Gjennomgåer (code-reviewer)
- Sjekker mot arkitekturregler
- Verifiserer TypeScript strict-overholdelse
- Sjekker IPC-sikkerhet spesielt

### Tester (tester-agent)
- Skriver tester for all ny logikk
- Geometri-utils og snapping-logikk skal ha full dekningsgrad
- Electron IPC-handlers testes med mock

### Debugger (debugger-agent)
- Analyserer feilmeldinger og stack traces
- Prioriterer koordinatsystem-bugs og geometrifeil

---

## Nyttige kommandoer

```bash
npm run dev          # Start Electron i dev-modus med HMR
npm run build        # Bygg renderer + main
npm run dist         # Bygg .exe installer
npm run dist:portable # Bygg portabel .exe
npm test             # Kjør tester
```

---

## Viktige filer å kjenne til

| Fil | Formål |
|-----|--------|
| `electron/main.ts` | Electron-oppstart, BrowserWindow |
| `electron/preload.ts` | Context bridge, IPC-eksponering |
| `src/store/drawingStore.ts` | All tegningsdata og operasjoner |
| `src/types/drawing.ts` | Datamodell for tegningselementer |
| `src/utils/geometry.ts` | Geometriberegninger (kritisk for korrekthet) |
| `electron-builder.config.js` | .exe-bygg og GitHub-publisering |
