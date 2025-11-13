
**Daily Muse (mood-muse)**

- **Project Description**: Daily Muse is a lightweight mood journaling web app that helps users record short text entries, auto-detects the user's emotion from the entry, fetches an inspirational quote based on the detected mood, and visualizes mood trends over time.

**Technologies Used**
- **Frontend**: `React` (v19) with `TypeScript` for typed components.
- **Build / Tooling**: `Vite` for dev server and build.
- **Styling**: `Tailwind CSS` (with PostCSS & Autoprefixer).
- **Charts**: `Recharts` for the mood trend visualization.
- **Animations**: `framer-motion` (available in dependencies for UI transitions).
- **Persistence**: browser `localStorage` for saving journal entries.

**Key Features and Challenges**
- **Feature — Mood analysis**: Users submit a short journal entry; the app sends the text to an emotion-analysis API to detect the prevailing mood.
- **Feature — Contextual quotes**: After mood detection the app fetches a motivational quote related to that mood.
- **Feature — Persistent journal**: Entries are stored locally and shown in a scrollable list.
- **Feature — Trends visualization**: Mood entries are mapped to a numeric scale and plotted using a line chart over the selected time range.
- **Feature — Dark mode**: Toggleable dark mode persisted in `localStorage`.
- **Challenge — Third-party APIs**: The app depends on two external APIs (emotion analysis and quotes). Handling API failures, missing results, and rate limits are primary concerns.

**Architecture Decisions**
- **Context API for global state**: `MoodProvider` (in `src/context/MoodContext.tsx`) centralizes state (entries, current mood, quotes, loading/error, dark mode) so components can remain small and focused.
- **Small, focused components**: UI is split into presentational and container components under `src/components` for clarity and reusability (e.g., `MoodInput`, `EntryList`, `MoodGraph`, `QuoteCard`).
- **Separation of concerns**: API calls live in `src/utils/api.ts`, persistence in `src/utils/localStorage.ts`, and color/mapping logic in `src/utils/moodColors.ts`.
- **Local persistence first**: To keep the app simple and private, entries are stored in `localStorage` (no backend required). This choice favors quick offline usage and privacy at the cost of cross-device sync.

**Setup Instructions**
- **Prerequisites**: Node.js (recommended v18+), `npm` or `pnpm`/`yarn`.
- **Clone & install**:
	- Open a terminal in the project folder and run:

		```bash
		cd "c:\Users\Stella\Desktop\Web Practices\Basecamp ENG\Mood Journal\daily-muse"
		npm install
		```

- **API keys**: The app expects two external keys (ParallelDots for emotion analysis and API Ninjas for quotes). By default the placeholders are in `src/utils/api.ts`:

	- `PARALLEL_DOTS_API_KEY` — for emotion analysis.
	- `API_NINJAS_KEY` — for quote lookup.

- **Run**:

	```bash
	npm run dev
	```

- **Build / Preview**:

	```bash
	npm run build
	npm run preview
	```

**Architecture Overview**
- **Top-level folders**:
	- `src/` — application source.
	- `src/components/` — UI components (`MoodInput`, `EntryList`, `MoodGraph`, `QuoteCard`, `DarkModeToggle`, `Loader`, `ErrorMessage`).
	- `src/context/` — `MoodContext.tsx` (provider) and `useMood.ts` (context hook).
	- `src/utils/` — `api.ts` (external calls), `localStorage.ts` (persistence helpers), and `moodColors.ts` (visual mapping).
	- `src/pages/index.tsx` — home page composing the main UI.

- **Data & flow**:
	1. User types an entry in `MoodInput` and submits.
	2. `MoodProvider.analyzeMood()` calls `analyzeEmotion()` from `src/utils/api.ts` and updates `currentMood` and `quote`.
	3. When an entry is created it is inserted into `entries` and persisted via `saveEntries()` (localStorage).
	4. `EntryList` reads `entries` from context and displays them; `MoodGraph` converts mood labels to numeric values and renders the chart.

**Technical Decisions**
- **Context vs external state manager**: Chose Context + custom hook (`useMood`) because the app state surface is small and doesn't require the complexity of Redux or other external libraries.
- **Chart mapping**: Moods are mapped to numeric values (`src/components/MoodGraph.tsx`) for visualization; this mapping is deliberate and can be tuned if you want a different mood scale.
- **Local-only persistence**: Simplifies the stack and avoids needing a server; trade-offs include no syncing and limited backups — export/import could be added later.
- **Error & loading UX**: The provider exposes `loading` and `error` flags; components show `Loader` and `ErrorMessage` and provide retry paths for API interactions.
- **Accessibility**: Buttons, forms and key UI parts include `aria` attributes and semantic HTML to improve screen-reader interaction.

**Files of interest**
- **`src/context/MoodContext.tsx`**: central provider that performs API calls, manages entries and theme, and persists data.
- **`src/utils/api.ts`**: wrapper for the emotion and quote APIs (replace keys here or request an env-vars patch).
- **`src/utils/localStorage.ts`**: `loadEntries` and `saveEntries` helpers.
- **`src/components/MoodInput.tsx`**: handles user text input and submission flow.
- **`src/components/MoodGraph.tsx`**: converts entries into chart data and renders `Recharts` line chart.

**Notes / Next steps (recommended)**
- Move API keys into environment variables and update `src/utils/api.ts` to use Vite env variables and add `.env.example` with expected keys.
- Add a small export/import JSON feature so users can backup/restore entries across devices.
- Add unit tests around `localStorage` helpers and `moodColors` mapping.
- Add a CI step to run `npm run lint` and type checks on PRs.

