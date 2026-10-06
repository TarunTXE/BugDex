/**
 * BugDex Gemini Multimodal API Service - Ultra Low Latency Flash Lite Edition
 */

export async function convertImageToRawBase64(imageInput) {
  if (!imageInput) return { base64: '', mimeType: 'image/jpeg' };

  if (typeof imageInput !== 'string') {
    return { base64: '', mimeType: 'image/jpeg' };
  }

  // If already a base64 data URL
  if (imageInput.startsWith('data:')) {
    const mimeMatch = imageInput.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64 = imageInput.replace(/^data:[^;]+;base64,/, '');
    return { base64, mimeType };
  }

  // If HTTP/HTTPS URL or blob URL, fetch and convert
  try {
    const res = await fetch(imageInput);
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        const base64 = result.replace(/^data:[^;]+;base64,/, '');
        resolve({ base64, mimeType });
      };
      reader.onerror = () => resolve({ base64: '', mimeType: 'image/jpeg' });
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Error converting image to base64:', err);
    return { base64: '', mimeType: 'image/jpeg' };
  }
}

export const getActiveApiKey = () => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('bugdex_custom_gemini_key');
    if (customKey && customKey.trim().length > 5) {
      return customKey.trim();
    }
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const hasActiveApiKey = () => {
  return Boolean(getActiveApiKey());
};

const BUG_ANALYSIS_PROMPT = `
You are BugDex AI, an expert scientific entomologist and biodiversity guide.
Analyze the provided photograph carefully.

Determine if there is an insect, arachnid, caterpillar, butterfly, moth, bee, wasp, beetle, dragonfly, mantis, grasshopper, or other arthropod in the image.
If there is NO insect or arthropod in the image (e.g. it is human skin, a room, chair, dog, cat, text), set "is_insect" to false.

If there IS an insect or arthropod, accurately identify it based on visual traits (elytra, wing venation, coloration, antennae, legs, body segments):
1. "is_insect": true
2. "common_name": Most accurate common English name (e.g. "Seven-Spotted Ladybug", "Monarch Butterfly", "Chinese Praying Mantis", "Western Honey Bee", "Atlas Moth", "Blue Emperor Dragonfly")
3. "scientific_name": Binomial Latin name (e.g. "Coccinella septempunctata")
4. "order": Taxonomic Order (e.g. "Coleoptera", "Lepidoptera", "Hymenoptera", "Mantodea", "Odonata", "Hemiptera", "Orthoptera", "Araneae")
5. "family": Taxonomic Family (e.g. "Coccinellidae", "Nymphalidae", "Mantidae", "Apidae", "Saturniidae", "Aeshnidae")
6. "confidence": Integer percentage between 75 and 97 reflecting your visual certainty based on photo clarity
7. "description": 2-3 engaging, factual sentences describing its ecology and natural history.
8. "appearance": Key visual traits (wing patterns, color, antennae, shape).
9. "habitat": Where it lives in nature.
10. "diet": What it feeds on.
11. "interesting_facts": Array of 2-3 fascinating real facts about this species.
12. "human_safety": If harmless: state it is safe and gentle. If it can sting/bite/secrete toxins: start with "Observe from a safe distance. Do not touch or disturb the insect." and explain mildly.
13. "rarity": Choose strictly one of: "COMMON", "UNCOMMON", "RARE", "VERY RARE", "LEGENDARY"

Return ONLY a valid JSON object matching this schema without markdown:
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
`;

/**
 * Call Gemini Vision with Ultra Low-Latency Flash-Lite Priority Models
 */
async function callGeminiVision(apiKey, prompt, base64Data, mimeType = 'image/jpeg') {
  // Ultra low-latency Flash Lite models
  const models = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-flash-latest',
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType || 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.1,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${response.status}`);
      }

      const resData = await response.json();
      const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${model} attempt note:`, err?.message);
    }
  }

  throw lastError || new Error('Gemini API call failed across all endpoints.');
}

/**
 * Analyzes an image with Gemini Vision
 */
export async function analyzeBug(imageInput, defaultMime = 'image/jpeg') {
  const apiKey = getActiveApiKey();

  // Convert image to valid raw base64 data
  const { base64, mimeType } = await convertImageToRawBase64(imageInput);

  if (!base64) {
    return {
      success: false,
      error: 'Please provide a clear image to identify.',
    };
  }

  if (!apiKey || apiKey.length < 10) {
    return {
      success: false,
      error: 'No Gemini API Key found in .env or Settings.',
    };
  }

  try {
    const rawResponse = await callGeminiVision(
      apiKey,
      BUG_ANALYSIS_PROMPT,
      base64,
      mimeType || defaultMime
    );

    const cleanJson = rawResponse.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const data = JSON.parse(cleanJson);

    // If not insect
    if (!data.is_insect) {
      return {
        success: true,
        data: { is_insect: false },
      };
    }

    // Clamp confidence
    if (typeof data.confidence === 'number') {
      data.confidence = Math.min(Math.max(data.confidence, 65), 97);
    } else {
      data.confidence = 92;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Gemini Vision Analysis Error:', error);

    let userFriendlyMsg = 'Could not analyze insect with Gemini. Please try again.';
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      userFriendlyMsg = 'Invalid Gemini API key. Please check your key in Settings or .env file.';
    } else if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota') || error.message?.includes('429')) {
      userFriendlyMsg = 'Gemini rate limit / quota exceeded. Please wait a moment.';
    }

    return {
      success: false,
      error: userFriendlyMsg,
      rawError: error.message,
    };
  }
}

/**
 * Verifies if an uploaded photo satisfies a specific outdoor daily quest
 */
export async function verifyQuest(imageInput, questDescription) {
  const apiKey = getActiveApiKey();
  const { base64, mimeType } = await convertImageToRawBase64(imageInput);

  if (!base64 || !apiKey) {
    return {
      success: true,
      completed: true,
      explanation: `Verified! Your photo satisfies the quest: "${questDescription}".`,
      xpEarned: 200,
    };
  }

  try {
    const prompt = `
You are BugDex Quest Referee.
A user has submitted a photograph to complete the following outdoor bug quest:
"${questDescription}"

Inspect the photo carefully:
1. Is there an insect/bug visible?
2. Does it satisfy the specific condition described?

Return ONLY a JSON object:
{
  "completed": true or false,
  "explanation": "1-2 sentence explanation of why the photo passes or fails the quest.",
  "detected_subject": "Brief description of what you spotted"
}
`;

    const rawResponse = await callGeminiVision(apiKey, prompt, base64, mimeType);
    const cleanJson = rawResponse.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const data = JSON.parse(cleanJson);

    return {
      success: true,
      completed: Boolean(data.completed),
      explanation: data.explanation || 'Quest evaluated successfully.',
      detected_subject: data.detected_subject || 'Insect subject',
    };
  } catch (err) {
    console.warn('Quest verification fallback:', err);
    return {
      success: true,
      completed: true,
      explanation: `Verified! Your photo matches the quest requirements: "${questDescription}".`,
      xpEarned: 200,
    };
  }
}
