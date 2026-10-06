# BugDex — Gotta Find 'Em All 🌿🔍

**BugDex** is an AI-powered real-world insect collection game and digital field journal. Users head outdoors, photograph insects, spiders, and arthropods they encounter in daily life, and use **Google Gemini Multimodal Vision AI** to identify their taxonomy, biology, and ecological role. Every discovered specimen transforms into an interactive, holographic collectible card saved directly to their personal BugDex.

---

## 🌟 Features

- **AI-Powered Insect Identification**: Snap a live photograph or upload an image to identify insects down to their common name, scientific name (*Binomial nomenclature*), Order, and Family.
- **Multimodal Gemini Vision Analysis**: Deep morphological analysis evaluating elytra, wing venation, coloration, antennae, and body segments with zero hallucination.
- **Living BugDex Collection**:
  - Grid and field-journal views with search by common/scientific name.
  - Multi-tier filtering by rarity and taxonomic Order (*Coleoptera, Lepidoptera, Hymenoptera, Mantodea, Odonata, Hemiptera, Orthoptera, etc.*).
  - Deduplication: Repeated observations increment sighting counts (`x3`) and award repeat observation XP without cluttering the collection.
- **Collectible Holographic Cards**: Rarity tiers (**COMMON**, **UNCOMMON**, **RARE**, **VERY RARE**, and **LEGENDARY**) featuring animated foil sheen, confidence rating, ecology facts, habitat, diet, and field notes.
- **XP & Leveling Gamification**: Earn XP on every discovery, level up across ranks (*Novice Bug Catcher → Backyard Explorer → Field Researcher → Expert Naturalist → Master Entomologist → Legendary Grandmaster*), and maintain consecutive daily exploration streaks.
- **Daily Outdoor Quests**: Daily expeditions (*"Find an insect with wings"*, *"Find an insect on a flower"*, *"Find a micro marvel smaller than your fingernail"*). Submit photos to Gemini for instant automated quest verification and bonus XP.
- **Field Achievement Badges**: Collectible milestones (🐛 *First Bug*, 🔎 *Bug Hunter*, 🦋 *Collector*, 🌿 *Nature Explorer*, 🌙 *Night Hunter*, 🏆 *Bug Master*, 👑 *Crown of Nature*, 🔥 *Streak Adventurer*).
- **Safety & Handling Guidance**: Automatic safety alerts for venomous or stinging species (*"Observe from a safe distance. Do not touch or disturb the insect."*) and ecological role highlights for gentle pollinators.
- **Mobile-First UX & Haptic Audio**: Optimized for outdoor mobile phone ergonomics with bottom navigation, camera shortcuts, and synthesized nature sound effects powered by the Web Audio API.
- **Privacy-Friendly Data Persistence**: Fast, client-side persistence with `localStorage`, general location tagging (*Garden, Campus, Park, Trail, Balcony* — no precise GPS required), and JSON data export/import.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark nature glassmorphism & holographic card animations
- **AI / Multimodal API**: [Google Gemini Multimodal REST API](https://ai.google.dev/) (`gemini-flash-lite-latest` / `gemini-3.5-flash-lite` / `gemini-3.6-flash`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Custom lightweight Web Audio API Synthesizer
- **Storage**: Clean client-side abstraction over `localStorage`

---

## 🤖 AI Integration

Gemini Multimodal Vision powers the core intelligence in `src/services/gemini.js`:

### 1. Image Processing & Multimodal Input
Images from device cameras, file uploads, or specimen previews are decoded and converted into base64 image buffers via `convertImageToRawBase64()`. They are sent directly in the `inline_data` payload to the Gemini endpoint.

### 2. Structured JSON Output
Gemini is prompted with biological taxonomy instructions and structured schema mode (`response_mime_type: "application/json"`) at a temperature of `0.1` to eliminate guessing.

#### Expected Response Schema:
```json
{
  "is_insect": true,
  "common_name": "Seven-Spotted Ladybug",
  "scientific_name": "Coccinella septempunctata",
  "order": "Coleoptera",
  "family": "Coccinellidae",
  "confidence": 95,
  "description": "A well-known red beetle with seven black spots, renowned as a natural garden ally against aphids.",
  "appearance": "Glossy scarlet dome-shaped elytra with seven distinct black spots.",
  "habitat": "Gardens, crop fields, hedges, and flowerbeds.",
  "diet": "Voracious predator of aphids and scale insects.",
  "interesting_facts": [
    "A single ladybug can consume over 5,000 aphids during its lifetime.",
    "When threatened, it can reflex-bleed a foul-tasting alkaloid to deter predators."
  ],
  "human_safety": "Harmless to humans. Beneficial garden pollinator/predator.",
  "rarity": "COMMON"
}
```

### 3. Non-Insect & Uncertainty Handling
- If the image contains a human, furniture, or unidentifiable background, Gemini flags `"is_insect": false`. The UI alerts the user with guidance to center the specimen.
- Identifications never claim 100% certainty (clamped between 65%–97%) to reflect real-world biological identification nuances.

### 4. AI Quest Verification
When submitting a photograph for a daily outdoor challenge, `verifyQuest()` passes the image and challenge description to Gemini, evaluating whether the subject satisfies the criteria (e.g. *has wings, is on a flower, is a butterfly*) and returning an explanation and XP reward.

---

## ⚡ Gemini Model

### 1. Selected Model Hierarchy
BugDex implements an ultra-low-latency priority chain defined in `src/services/gemini.js`:

1. **`gemini-flash-lite-latest`** *(Primary)*
2. **`gemini-3.5-flash-lite`**
3. **`gemini-3.1-flash-lite`**
4. **`gemini-2.5-flash-lite`**
5. **`gemini-3.6-flash`** *(Fallback)*

### 2. Why Flash-Lite was Selected
- **Near-Zero Latency**: Flash-Lite models deliver near-instant response times, essential for outdoor mobile users scanning insects on the move.
- **Multimodal Visual Acuity**: Accurately interprets subtle morphological patterns (elytra spots, wing venation, raptorial legs).
- **Cost & Quota Efficiency**: Flash-Lite models use minimal token overhead and offer higher request throughput.

### 3. Limitations & Rate Limits
- Free tier keys from Google AI Studio operate within standard per-minute request quotas (RPM/TPM).
- If rate limits are reached, the service gracefully surfaces a temporary rate limit notice without crashing the UI.

---

## 🔑 Getting a Gemini API Key

To run BugDex with live AI classification:

1. Visit [Google AI Studio API Keys](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key**.
4. Copy your API key.

> [!WARNING]
> **Never commit your API key to GitHub or public repositories.** Keep keys in `.env` or `.env.local` which are excluded in `.gitignore`.

---

## ⚙️ Environment Variables

Create a file named `.env` or `.env.local` in the project root:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- `npm` (version 9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TarunTXE/BugDex.git
   cd BugDex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your API Key**:
   Create `.env` or `.env.local` and add your key:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:5173/`

### Production Build
To create an optimized production build:
```bash
npm run build
```
To preview the build locally:
```bash
npm run preview
```

---

## 🌿 Respect Nature & Outdoor Safety

BugDex encourages nature exploration and biodiversity awareness. 
- Always observe wildlife from a safe and respectful distance.
- Never touch, handle, capture, or disturb unknown or potentially stinging insects.
- Respect natural habitats and leave no trace. 🍃
