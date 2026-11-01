import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK on the server only
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Sizing Recommendation Endpoint
app.post('/api/sizing/recommend', async (req, res) => {
  try {
    const { product, measurements } = req.body;

    if (!product || !measurements) {
      return res.status(400).json({ error: 'Product and user measurements are required.' });
    }

    const {
      height = 170,
      bust = 88,
      waist = 68,
      hips = 94,
      shoeSize = 38,
      unit = 'cm',
      preferredFit = 'true_to_size', // 'fitted' | 'true_to_size' | 'relaxed_oversized'
      bodyNotes = '',
    } = measurements;

    // Convert to CM for standardized logic if provided in inches
    const bustCm = unit === 'in' ? Math.round(bust * 2.54) : Number(bust);
    const waistCm = unit === 'in' ? Math.round(waist * 2.54) : Number(waist);
    const hipsCm = unit === 'in' ? Math.round(hips * 2.54) : Number(hips);
    const heightCm = unit === 'in' ? Math.round(height * 2.54) : Number(height);

    const availableSizes: string[] = product.sizes || [];

    // If Gemini is available on server, perform deep couture reasoning
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are the Premier Master Tailor and Head Pattern Drafter for Maison Aurelia at 14 Place Vendôme, Paris.
Analyze the following client measurements and recommend the exact optimal size from the available sizes for this garment/footwear.

GARMENT SPECIFICATIONS:
- Item: ${product.name} (${product.frenchName || ''})
- Category: ${product.categoryLabel || product.category}
- Gender Division: ${product.gender || 'universal'}
- Silhouette & Construction: ${product.silhouette}
- Fabric & Weave: ${product.fabric}
- Available Sizes: ${availableSizes.join(', ')}

CLIENT PROFILE & MEASUREMENTS:
- Unit: ${unit}
- Height: ${height} ${unit} (~${heightCm} cm)
- Bust / Chest: ${bust} ${unit} (~${bustCm} cm)
- Waist: ${waist} ${unit} (~${waistCm} cm)
- Hips: ${hips} ${unit} (~${hipsCm} cm)
- Footwear Size: ${shoeSize} (if applicable)
- Preferred Fit: ${preferredFit.replace('_', ' ')}
- Personal Fit Notes: ${bodyNotes || 'Standard posture, seeking flawless silhouette drape'}

TASK:
1. Select the single best matching size from the available sizes list.
2. Provide a numerical confidence score (75-99).
3. Explain the fit assessment across key tension points (shoulders, bust, waist, hips, length).
4. Describe how this specific fabric (${product.fabric}) and silhouette (${product.silhouette}) will behave and drape on this client.
5. Provide bespoke tailoring/styling advice (e.g. cuff break, layering ease, or alternative size option).
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite Parisian haute couture master tailor. Speak with exquisite fashion authority, understated elegance, and absolute precision. Return valid JSON only.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendedSize: {
                  type: Type.STRING,
                  description: 'The single best matching size chosen strictly from the available sizes list.',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Percentage confidence from 80 to 99.',
                },
                fitAssessment: {
                  type: Type.STRING,
                  description: 'Concise, refined analysis of ease around shoulders, bust, waist, and hips.',
                },
                drapeAndSilhouetteNotes: {
                  type: Type.STRING,
                  description: 'Specific commentary on how this fabric and cut drapes on their measurements.',
                },
                tailoringAdvice: {
                  type: Type.STRING,
                  description: 'Bespoke recommendations for layering, hem break, or personal comfort.',
                },
                alternativeSize: {
                  type: Type.STRING,
                  description: 'Secondary size choice depending on styling intent (e.g. more oversized or more fitted).',
                },
              },
              required: ['recommendedSize', 'confidenceScore', 'fitAssessment', 'drapeAndSilhouetteNotes', 'tailoringAdvice'],
            },
          },
        });

        const jsonText = (response.text || '{}').trim();
        const parsed = JSON.parse(jsonText);
        if (parsed.recommendedSize) {
          return res.json({
            ...parsed,
            poweredBy: 'Maison Aurelia Atelier AI (Place Vendôme Engine)',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using deterministic atelier fallback:', geminiError);
      }
    }

    // High-Accuracy Algorithmic Fallback Engine (Zero Downtime Guarantee)
    let bestSize = availableSizes[0] || 'Standard';
    let altSize = availableSizes[1] || availableSizes[0];
    let confidence = 94;

    if (product.category === 'shoes') {
      const targetEu = Math.round(Number(shoeSize) || 38);
      const match = availableSizes.find((s) => s.includes(`EU ${targetEu}`));
      bestSize = match || availableSizes[0];
      altSize = availableSizes[Math.min(availableSizes.length - 1, availableSizes.indexOf(bestSize) + 1)];
      confidence = 96;
    } else if (product.gender === 'homme') {
      // Men's sizing logic (IT 46, 48, 50, 52, 54)
      if (bustCm < 94) bestSize = availableSizes[0] || 'IT 46 (US 36)';
      else if (bustCm <= 98) bestSize = availableSizes[1] || 'IT 48 (US 38)';
      else if (bustCm <= 104) bestSize = availableSizes[2] || 'IT 50 (US 40)';
      else if (bustCm <= 110) bestSize = availableSizes[3] || 'IT 52 (US 42)';
      else bestSize = availableSizes[4] || 'IT 54 (US 44)';
      altSize = preferredFit === 'relaxed_oversized'
        ? availableSizes[Math.min(availableSizes.length - 1, availableSizes.indexOf(bestSize) + 1)]
        : availableSizes[Math.max(0, availableSizes.indexOf(bestSize) - 1)];
    } else {
      // Women's & Universal sizing (FR 34, 36, 38, 40, 42)
      if (bustCm < 84 && waistCm < 64) {
        bestSize = availableSizes.find((s) => s.includes('FR 34')) || availableSizes[0];
        altSize = availableSizes.find((s) => s.includes('FR 36')) || availableSizes[1];
      } else if (bustCm <= 88 && waistCm <= 68) {
        bestSize = availableSizes.find((s) => s.includes('FR 36')) || availableSizes[1] || availableSizes[0];
        altSize = preferredFit === 'relaxed_oversized'
          ? (availableSizes.find((s) => s.includes('FR 38')) || availableSizes[2])
          : (availableSizes.find((s) => s.includes('FR 34')) || availableSizes[0]);
      } else if (bustCm <= 93 && waistCm <= 73) {
        bestSize = availableSizes.find((s) => s.includes('FR 38')) || availableSizes[2] || availableSizes[0];
        altSize = preferredFit === 'relaxed_oversized'
          ? (availableSizes.find((s) => s.includes('FR 40')) || availableSizes[3])
          : (availableSizes.find((s) => s.includes('FR 36')) || availableSizes[1]);
      } else if (bustCm <= 98 && waistCm <= 78) {
        bestSize = availableSizes.find((s) => s.includes('FR 40')) || availableSizes[3] || availableSizes[0];
        altSize = availableSizes.find((s) => s.includes('FR 42')) || availableSizes[4] || availableSizes[2];
      } else {
        bestSize = availableSizes.find((s) => s.includes('FR 42')) || availableSizes[availableSizes.length - 1];
        altSize = availableSizes.find((s) => s.includes('FR 40')) || availableSizes[0];
      }
    }

    return res.json({
      recommendedSize: bestSize,
      alternativeSize: altSize,
      confidenceScore: confidence,
      fitAssessment: `Harmonious alignment across the bust/chest (${bustCm}cm) and waist (${waistCm}cm) with an intentional 4.5cm ease allowance.`,
      drapeAndSilhouetteNotes: `The ${product.fabric} possesses natural resilience and fluid vertical weight, ensuring the ${product.silhouette} drapes cleanly without pulling or buckling.`,
      tailoringAdvice: preferredFit === 'relaxed_oversized'
        ? `Since you prefer a relaxed drape, you may also consider ${altSize} for a modern architectural silhouette over heavy knitwear.`
        : `This size maintains the exact neoclassical proportion calibrated by our Place Vendôme master cutters.`,
      poweredBy: 'Maison Aurelia Atelier Fit Algorithm',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/sizing/recommend:', error);
    return res.status(500).json({ error: error.message || 'Internal sizing calculation error.' });
  }
});

// Static asset handling for both local dev and Render production deployment
const publicAssetsPath = path.resolve(__dirname, 'public/assets');
const srcAssetsPath = path.resolve(__dirname, 'src/assets');
app.use('/assets', express.static(publicAssetsPath));
app.use('/src/assets', express.static(srcAssetsPath));
app.use('/src/assets', express.static(publicAssetsPath));

// Vite middleware for dev or static serve for production
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  import('fs').then(({ existsSync }) => {
    const renderDist = '/opt/render/project/src/dist';
    const localDist = path.resolve(__dirname, 'dist');
    const distPath = existsSync(renderDist) ? renderDist : localDist;

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  });
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Maison Aurelia full-stack server running on http://0.0.0.0:${PORT}`);
});
