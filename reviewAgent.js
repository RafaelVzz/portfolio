import fs from "fs";
import path from "path";

// ─── Configuración ───────────────────────────────────────────────
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

// Directorio raíz del código fuente a analizar
const SRC_DIR = path.resolve("src");

// Extensiones de archivo que el agente revisará
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// ─── Validación de API Key ───────────────────────────────────────
if (!NVIDIA_API_KEY) {
  console.error(
    "❌ Error: No se encontró la variable de entorno NVIDIA_API_KEY.\n" +
      "   Configúrala antes de ejecutar el script:\n\n" +
      '   $env:NVIDIA_API_KEY = "tu-api-key-aquí"\n' +
      "   node reviewAgent.js\n"
  );
  process.exit(1);
}

// ─── Funciones auxiliares ────────────────────────────────────────

/**
 * Busca recursivamente archivos con las extensiones permitidas
 * dentro del directorio indicado.
 */
function findFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Ignorar carpetas que no contienen código fuente relevante
      if (entry.name === "node_modules" || entry.name === "assets") continue;
      findFiles(fullPath, fileList);
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Envía el contenido de un archivo al LLM para obtener
 * un code review detallado.
 */
async function reviewFile(filePath, code) {
  const relativePath = path.relative(process.cwd(), filePath);

  console.log(`   🔍 Analizando: ${relativePath}...`);

  const prompt = `Eres un experto senior en React y JavaScript moderno.
Analiza el siguiente archivo de código y proporciona un code review detallado EN ESPAÑOL.

Archivo: ${relativePath}

\`\`\`jsx
${code}
\`\`\`

Organiza tu respuesta en estas secciones:
### 🐛 Bugs o errores potenciales
### ⚡ Mejoras de rendimiento (performance)
### 🎨 Mejoras de estilo y buenas prácticas

Para cada hallazgo:
- Describe el problema de forma clara
- Sugiere la corrección con un fragmento de código si aplica

Si el archivo está bien y no tienes sugerencias relevantes, indícalo brevemente.`;

  const response = await fetch(NVIDIA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Error en la API de NVIDIA (${response.status}): ${errorBody}`
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─── Flujo principal ─────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   🤖 Agente de Análisis de Código — Review AI   ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // 1. Buscar archivos JS/TS en el proyecto
  const files = findFiles(SRC_DIR);
  console.log(`📂 Se encontraron ${files.length} archivos para analizar:\n`);
  files.forEach((f) => console.log(`   • ${path.relative(process.cwd(), f)}`));
  console.log("");

  // 2. Analizar cada archivo con el LLM
  const reviews = [];

  for (const filePath of files) {
    const code = fs.readFileSync(filePath, "utf-8");

    // Saltar archivos muy pequeños (< 10 líneas, probablemente solo imports)
    if (code.split("\n").length < 10) {
      console.log(
        `   ⏭️  Saltando ${path.relative(process.cwd(), filePath)} (archivo muy corto)`
      );
      continue;
    }

    try {
      const review = await reviewFile(filePath, code);
      reviews.push({
        file: path.relative(process.cwd(), filePath),
        review,
      });
    } catch (error) {
      console.error(`   ❌ Error al analizar ${filePath}: ${error.message}`);
      reviews.push({
        file: path.relative(process.cwd(), filePath),
        review: `> ⚠️ No se pudo analizar este archivo: ${error.message}`,
      });
    }
  }

  // 3. Generar el reporte REVIEW.md
  const now = new Date().toLocaleString("es-DO", {
    dateStyle: "full",
    timeStyle: "short",
  });

  let markdown = `# 📋 Code Review — Reporte Automático\n\n`;
  markdown += `> Generado el **${now}** por el Agente de Análisis de Código\n`;
  markdown += `> Modelo: \`${MODEL}\` vía NVIDIA NIM\n\n`;
  markdown += `---\n\n`;

  for (const { file, review } of reviews) {
    markdown += `## 📄 \`${file}\`\n\n`;
    markdown += `${review}\n\n`;
    markdown += `---\n\n`;
  }

  markdown += `*Fin del reporte. Total de archivos analizados: ${reviews.length}*\n`;

  // 4. Guardar el archivo
  const outputPath = path.resolve("REVIEW.md");
  fs.writeFileSync(outputPath, markdown, "utf-8");

  console.log(`\n✅ Reporte guardado exitosamente en: ${outputPath}`);
  console.log(`   📄 Archivos analizados: ${reviews.length}`);
}

main().catch((error) => {
  console.error(`\n❌ Error fatal: ${error.message}`);
  process.exit(1);
});
