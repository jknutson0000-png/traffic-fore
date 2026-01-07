
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = 'GENESIS_FULL_SYSTEM.txt';

// The critical files required to understand the system
const FILES_TO_BUNDLE = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    'types.ts',
    'App.tsx',
    'services/geminiService.ts',
    'components/TrafficDashboard.tsx',
    'components/TrafficIndicator.tsx',
    'components/WeatherDashboard.tsx',
    'components/IntelDashboard.tsx',
    'components/TechDashboard.tsx',
    'components/InspectionDashboard.tsx',
    'components/EventList.tsx'
];

let output = `GENESIS EXECUTIVE HOME SERVICES - SYSTEM EXPORT
Date: ${new Date().toLocaleString()}
Purpose: Context transfer for AI development (Claude/ChatGPT/Gemini)
------------------------------------------------------------------\n\n`;

console.log("📦 PACKING SYSTEM FOR EXPORT...");

FILES_TO_BUNDLE.forEach(fileName => {
    try {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            output += `--- START OF FILE: ${fileName} ---\n`;
            output += content;
            output += `\n--- END OF FILE: ${fileName} ---\n\n`;
            console.log(`✅ Added: ${fileName}`);
        } else {
            console.warn(`⚠️  Missing: ${fileName}`);
        }
    } catch (err) {
        console.error(`❌ Error reading ${fileName}:`, err);
    }
});

// Write the final file
try {
    fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), output);
    console.log(`\n🎉 SUCCESS. System packed into: ${OUTPUT_FILE}`);
    console.log(`👉 Drag and drop ${OUTPUT_FILE} into your other AI tools.`);
} catch (err) {
    console.error("Failed to write output file:", err);
}
