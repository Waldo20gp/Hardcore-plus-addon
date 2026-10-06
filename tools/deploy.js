import { existsSync, rmSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------- Configuración ----------
const PACK_FOLDER_NAME = "hardcore_plus_BP";

// ---------- Rutas ----------
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const source = path.join(repoRoot, "packs", "BP");

const appData = process.env.APPDATA;
if (!appData) {
  console.error("[ERROR] Variable APPDATA no encontrada. Este script requiere Windows.");
  process.exit(1);
}

const devPacksDir = path.join(
  appData, "Minecraft Bedrock", "users", "shared", "games",
  "com.mojang", "development_behavior_packs"
);
const destination = path.join(devPacksDir, PACK_FOLDER_NAME);

// ---------- Validaciones ----------
if (!existsSync(path.join(source, "manifest.json"))) {
  console.error(`[ERROR] No existe manifest.json en ${source}`);
  process.exit(1);
}

if (!existsSync(devPacksDir)) {
  console.error(`[ERROR] No existe la carpeta del juego: ${devPacksDir}`);
  process.exit(1);
}

// ---------- Despliegue (recarga completa) ----------
try {
  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true });
  console.log(`[OK] Desplegado en ${destination}`);
} catch (error) {
  console.error(`[ERROR] Falló el despliegue: ${error.message}`);
  if (error.code === "EBUSY" || error.code === "EPERM") {
    console.error("Algún archivo está en uso. Sal del mundo en Minecraft y vuelve a intentar.");
  }
  process.exit(1);
}