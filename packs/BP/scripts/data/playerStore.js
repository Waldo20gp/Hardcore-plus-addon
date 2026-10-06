import { world } from "@minecraft/server";
import { KEY_PREFIX, SCHEMA_VERSION } from "../config.js";

const PLAYER_KEY_PREFIX = `${KEY_PREFIX}player:`;

function playerKey(playerId) {
  return `${PLAYER_KEY_PREFIX}${playerId}`;
}

function parseRecord(key, raw) {
  if (typeof raw !== "string") {
    throw new Error(`[hcp] Valor inválido en ${key}: se esperaba texto JSON`);
  }

  let record;
  try {
    record = JSON.parse(raw);
  } catch (error) {
    throw new Error(`[hcp] JSON corrupto en ${key}: ${error.message}`);
  }

  if (record.v !== SCHEMA_VERSION) {
    throw new Error(`[hcp] Versión de esquema ${record.v} no soportada en ${key}`);
  }

  return record;
}

export function getPlayerRecord(playerId) {
  const key = playerKey(playerId);
  const raw = world.getDynamicProperty(key);
  if (raw === undefined) return undefined;
  return parseRecord(key, raw);
}

export function savePlayerRecord(record) {
  world.setDynamicProperty(playerKey(record.id), JSON.stringify(record));
}

export function getAllPlayerRecords() {
  return world
    .getDynamicPropertyIds()
    .filter((key) => key.startsWith(PLAYER_KEY_PREFIX))
    .map((key) => parseRecord(key, world.getDynamicProperty(key)));
}

export function findPlayerRecordByName(name) {
  const target = name.toLowerCase();
  return getAllPlayerRecords().find((record) => record.name.toLowerCase() === target);
}