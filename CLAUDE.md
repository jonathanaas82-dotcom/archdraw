# Archdraw — Prosjektveiledning for agenter

## Prosjektoversikt
Archdraw er en avansert desktop-applikasjon for byggtegninger (arkitekttegninger).
Distribueres som `.exe` på Windows og oppdateres via GitHub Releases.
Støtter 2D-tegning og 3D-visualisering med norske byggestandarder (TEK17).

**GitHub repo:** `jonathanaas82-dotcom/archdraw`
**Eier:** jonathanaas82-dotcom

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Desktop | Electron (latest stable) |
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| 2D tegning | Konva.js + react-konva |
| 3D visualisering | Three.js + @react-three/fiber |
| State | Zustand |
| Styling | CSS Modules + CSS-variabler |
| Build | electron-builder (NSIS installer + portabel .exe) |
| Auto-update | electron-updater |
| CI/CD | GitHub Actions |

---

## Prosjektstruktur

```
archdraw/
├── electron/
│   ├── main.ts
│   ├── preload.ts
│   ├── menu.ts
│   └── ipc/
│       ├── file-handlers.ts
│       ├── export-handlers.ts
│       └── update-handlers.ts
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── data/                          # Statiske bibliotekdata
│   │   ├── wallTypes.ts               # Alle 14 vegg-type definisjoner (TEK17)
│   │   ├── materials.ts               # Materialegenskaper + standardfarger
│   │   └── ralColors.ts               # Norske RAL-farger for kledning
│   │
│   ├── types/
│   │   ├── drawing.ts                 # WallElement, DoorElement, WindowElement etc.
│   │   ├── tools.ts                   # ToolType enum
│   │   ├── project.ts                 # ProjectFile-format (JSON-skjema)
│   │   ├── walls.ts                   # WallLayer, WallTypeDefinition, WallInstance, Storey
│   │   └── calculations.ts            # CalculationResult, WallAreaEntry, UValueResult
│   │
│   ├── store/
│   │   ├── drawingStore.ts
│   │   ├── toolStore.ts
│   │   ├── viewStore.ts               # + is3DVisible, viewMode, toggle3DView()
│   │   ├── layerStore.ts
│   │   ├── historyStore.ts            # CompoundCommand støtte
│   │   ├── wallStore.ts               # WallInstance-register, fargeoverstyrelser
│   │   └── calculationStore.ts        # Avledede kalkulasjoner (read-only)
│   │
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── DrawingCanvas.tsx
│   │   │   ├── GridLayer.tsx
│   │   │   ├── WallLayer.tsx          # Konva-lag for vegg-polygoner
│   │   │   ├── WallCrossSection.tsx   # Lag-visualisering i tverrsnitt
│   │   │   ├── ElementsLayer.tsx
│   │   │   ├── DimensionsLayer.tsx
│   │   │   └── SnapIndicator.tsx
│   │   │
│   │   ├── tools/
│   │   │   ├── Toolbar.tsx
│   │   │   ├── WallTool.tsx           # Klikk-til-klikk m/ vegg-type-dialog
│   │   │   ├── DoorTool.tsx
│   │   │   ├── WindowTool.tsx
│   │   │   └── DimensionTool.tsx
│   │   │
│   │   ├── panels/
│   │   │   ├── WallTypeDialog.tsx     # Modal: velg vegg-type ved plassering
│   │   │   ├── WallPropertiesPanel.tsx # Lag-stack + fargeoverstyrelser
│   │   │   ├── CalculationPanel.tsx   # Areal, materialer, U-verdier
│   │   │   ├── LayerPanel.tsx
│   │   │   └── ProjectPanel.tsx
│   │   │
│   │   ├── viewer3d/                  # 3D-visning
│   │   │   ├── Viewer3D.tsx           # @react-three/fiber Canvas (lazy-loaded)
│   │   │   ├── Scene3D.tsx            # Komponerer vegger, lys, kamera
│   │   │   ├── WallMesh.tsx           # Ekstrudert vegg-mesh
│   │   │   ├── OpeningMesh.tsx        # Dør/vindu-åpninger
│   │   │   └── Viewer3D.module.css
│   │   │
│   │   └── ui/
│   │       ├── Menubar.tsx
│   │       ├── StatusBar.tsx
│   │       ├── ColorPicker.tsx        # RAL-fargepalette
│   │       └── Dialogs/
│   │
│   ├── hooks/
│   │   ├── useCanvasCoords.ts         # + worldToThree() konvertering
│   │   ├── useWallSync.ts             # Synkroniserer 2D↔3D via Zustand.subscribe
│   │   ├── useHistory.ts
│   │   ├── useSnapping.ts
│   │   └── useKeyboardShortcuts.ts    # F3/Tab for 3D-toggle
│   │
│   └── utils/
│       ├── geometry.ts
│       ├── snapping.ts
│       ├── serialization.ts           # + wallStore snapshot (prosjektformat v2)
│       ├── export.ts
│       ├── wallGeometry.ts            # buildWallPolygon, miterCornerJoin, laggrenser
│       ├── uValueCalc.ts              # ISO 6946 U-verdi (forenklet)
│       └── wallAreaCalc.ts            # Areal og materialkvantiteter
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
2. **Koordinatsystem:** Skjermkoordinater (px), verdenskoordinater (mm), og Three.js-enheter (1 unit = 1mm) holdes adskilt. Bruk `useCanvasCoords`-hook.
3. **Vegger som polygoner:** Vegger er 4-punkts polygoner (ikke linjer) for korrekt hjørneberegning.
4. **Undo/redo — CompoundCommand:** `commitWall()` må dispatche til både `drawingStore` og `wallStore` som én atomisk `CompoundCommand`. Undo av vegg-plassering fjerner fra begge stores.
5. **TypeScript strict:** `strict: true`. Ingen `any` uten eksplisitt kommentar.
6. **3D lazy-loading:** `Viewer3D` lastes kun ved første F3-trykk via `React.lazy`. Three.js skal ikke være i main bundle.
7. **2D og 3D canvas deler ikke DOM-node:** Konva Stage og fiber Canvas er søsken-divs. `pointer-events: none` på 3D-canvas når i split-visning.
8. **U-verdi disclaimer:** `CalculationPanel` skal alltid vise: *"U-verdier er beregnet etter forenklet ISO 6946 uten kuldebrofaktor. Ikke for TEK17-dokumentasjon."*
9. **Prosjektformat versjonering:** Prosjektfiler har `version`-felt. Gjeldende versjon: `2`. Eldre filer uten `wallStoreSnapshot` lastes med default `YV1` på alle vegger.

---

## Vegg-type bibliotek (norske standarder)

### Yttervegger (YV)
| ID | Navn | Totaltykkelse |
|----|------|---------------|
| YV1 | Bindingsverkvegg 198mm m/isolasjon | 248mm |
| YV2 | Bindingsverkvegg 148mm m/isolasjon | 198mm |
| YV3 | Massivtre/Laftvegg | 200mm |
| YV4 | Betong yttervegg | 150/200/250mm |

### Innervegger (IV)
| ID | Navn | Totaltykkelse |
|----|------|---------------|
| IV1 | Gipsvegg lett (2×12,5mm + 98mm stender) | 123mm |
| IV2 | Gipsvegg dobbel EI30/EI60 | 148mm |
| IV3 | Murverk/tegl | 100/150/200mm |
| IV4 | Betong innerveg | 150/200mm |

### Brannvegger (BV)
| ID | Brannklasse | Beskrivelse |
|----|-------------|-------------|
| BV1 | EI30 | 30 min brannmotstand |
| BV2 | EI60 | 60 min brannmotstand |
| BV3 | EI90 | 90 min brannmotstand |
| BV4 | REI120 | Bærende brannvegg 120 min |

### Skillevegger (SV)
| ID | Navn |
|----|------|
| SV1 | Enkel gips (ikke-bærende) |
| SV2 | Glassvegger/partisjoner |

### Vegg-lag (lagoppbygging utenfra-inn)
Hvert lag har: `{ name, thickness (mm), material, color }`

**Materialer:** `timber_stud`, `mineral_wool`, `cellulose`, `eps`, `vapour_barrier`, `gypsum_standard`, `gypsum_fire`, `gypsum_wet`, `concrete`, `brick_masonry`, `cladding_vertical`, `cladding_horizontal`, `cladding_timber`, `air_gap`, `wind_barrier`, `solid_timber`

---

## 3D-visning

- **Motor:** Three.js + @react-three/fiber
- **Vegg-ekstrudering:** Fra 2D-polygon til angitt etasjehøyde (standard 2400mm)
- **Kameranavigasjon:** OrbitControls (roter, pan, zoom)
- **Toggle:** F3 eller Tab — sykler mellom `2d-only` → `split` → `3d-only`
- **Synkronisering:** `useWallSync` hook kaller `invalidate()` på alle `drawingStore`-endringer
- **Ytelse:** `frameloop="demand"` på fiber Canvas (ingen kontinuerlig animasjonsloop)
- **Åpninger v1:** Dører/vinduer vises som mørke Box-mesher (ikke CSG-utskjæring — planlagt fase 7)

---

## Kalkulasjoner

- Vegg-areal per type (brutto og netto etter åpninger)
- Materialmengder (m² gips, m³ isolasjon, m² kledning)
- Romvolum og gulvareal
- U-verdi per vegg-type (ISO 6946 forenklet)
- **OBS:** Ikke for TEK17-dokumentasjon (se arkitekurregel 8)

---

## Utviklingsfaser

### Fase 0 — Prosjektoppsett
- [ ] npm init, Electron + Vite + React + TypeScript
- [ ] electron-builder konfigurasjon
- [ ] Første fungerende .exe
- [ ] GitHub Actions workflows

### Fase 1 — Canvas-grunnlag
- [ ] Konva Stage med zoom/pan
- [ ] Grid med justerbar størrelse
- [ ] Snap til grid og objekter
- [ ] Zustand-stores (drawing, tool, view, layer, history, wall, calculation)
- [ ] Undo/redo med CompoundCommand-støtte
- [ ] Lagre/åpne prosjekt (JSON v2)

### Fase 2 — Avansert vegg-tegning
- [ ] Vegg-type-bibliotek (`src/data/wallTypes.ts`)
- [ ] WallTypeDialog ved vegg-plassering
- [ ] Klikk-til-klikk ELLER manuell lengde-input
- [ ] Lag-visualisering i tverrsnitt (WallCrossSection)
- [ ] Miter-hjørneforbindelser
- [ ] Fargeoverstyrelser per vegg-instans

### Fase 3 — Byggelementer
- [ ] Dør-verktøy (åpningsbue)
- [ ] Vindu-verktøy (arkitektsymbol)
- [ ] Plassering i vegg med snap

### Fase 4 — 3D-visning
- [ ] Three.js + @react-three/fiber lazy-loaded
- [ ] Vegg-ekstrudering fra 2D
- [ ] OrbitControls kameranavigasjon
- [ ] F3/Tab toggle 2D↔3D
- [ ] Dør/vindu-åpninger (paint-over v1)

### Fase 5 — Målsetting og kalkulasjoner
- [ ] Dimensjoneringsverktøy
- [ ] Målpiler med tekst
- [ ] CalculationPanel (areal, materialer, U-verdier)

### Fase 6 — Eksport og distribusjon
- [ ] PNG/PDF-eksport
- [ ] GitHub Release workflow
- [ ] Auto-update (electron-updater)

### Fase 7 — Avansert (fremtidig)
- [ ] Lagpanel (synlighet, låsing)
- [ ] Symbolbibliotek (møbler, sanitær)
- [ ] DXF-eksport (AutoCAD-kompatibel)
- [ ] CSG-utskjæring for 3D åpninger
- [ ] Etasjehåndtering (flere etasjer)

---

## Kodekonvensjoner

- Filnavn: `PascalCase` for komponenter, `camelCase` for utils/hooks
- Komponentfiler eksporterer én default export
- Hooks starter alltid med `use`
- Typer/interfaces i `src/types/` — ikke definer inline i komponenter
- CSS Modules: `ComponentName.module.css` ved siden av komponenten
- Tester: `ComponentName.test.tsx` ved siden av filen
- `src/data/` inneholder kun statiske konstanter — ingen runtime-logikk

---

## Agent-roller og ansvar

### Prosjektleder (pipeline-orchestrator)
- Koordinerer arbeid mellom agenter
- Bryter ned features i oppgaver basert på fasene over
- Sporer fremdrift og oppdaterer sjekkbokser i denne filen
- Eskalerer blokkere til brukeren

### Arkitekt (architect-blueprint)
- Designer løsninger for nye features
- Oppdaterer denne filen ved strukturelle endringer
- Vurderer tekniske konsekvenser (spesielt geometri og 2D↔3D-sync)

### Koder (blueprint-coder)
- Implementerer fra blueprints
- Følger alle arkitekturregler
- Aldri `any`, aldri usikre IPC-kall
- Alle vegg-mutasjoner via CompoundCommand

### Gjennomgåer (code-reviewer)
- Sjekker mot arkitekturregler
- Verifiserer TypeScript strict-overholdelse
- Sjekker IPC-sikkerhet og U-verdi-disclaimer spesielt

### Tester (tester-agent)
- Full dekningsgrad på `wallGeometry.ts` og `uValueCalc.ts`
- Test undo/redo-syklus for vegg-plassering
- Test near-parallel vegg-hjørne (< 5°)
- Electron IPC-handlers testes med mock

### Debugger (debugger-agent)
- Prioriterer koordinatsystem-bugs og geometrifeil
- Sjekk alltid miter-hjørner og CompoundCommand-synkronisering ved vegg-bugs

---

## Nyttige kommandoer

```bash
npm run dev           # Start Electron i dev-modus med HMR
npm run build         # Bygg renderer + main
npm run dist          # Bygg .exe installer
npm run dist:portable # Bygg portabel .exe
npm test              # Kjør tester
```

---

## Kritiske filer

| Fil | Formål |
|-----|--------|
| `electron/main.ts` | Electron-oppstart, BrowserWindow |
| `electron/preload.ts` | Context bridge, IPC-eksponering |
| `src/data/wallTypes.ts` | Alle vegg-type definisjoner med TEK17-mål |
| `src/types/walls.ts` | Datamodell for vegger og lag |
| `src/store/drawingStore.ts` | All tegningsdata |
| `src/store/wallStore.ts` | Vegg-instanser og farger |
| `src/utils/wallGeometry.ts` | Polygon-beregning, miter-hjørner |
| `src/utils/uValueCalc.ts` | ISO 6946 U-verdi |
| `electron-builder.config.js` | .exe-bygg og GitHub-publisering |
