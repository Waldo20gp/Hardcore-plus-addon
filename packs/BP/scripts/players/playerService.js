import {
  SCHEMA_VERSION,
  PlayerStatus,
  ROLES,
  LIVES_BY_TIER,
  DEFAULT_ROLE_ID,
} from "../config.js";
import { getPlayerRecord, savePlayerRecord } from "../data/playerStore.js";

function roleExists(roleId) {
  return Object.prototype.hasOwnProperty.call(ROLES, roleId);
}

export function getMaxLives(roleId) {
  if (!roleExists(roleId)) {
    throw new Error(`[hcp] Rol desconocido: ${roleId}`);
  }
  return LIVES_BY_TIER[ROLES[roleId].tier];
}

export function ensurePlayerRegistered(player) {
  const existing = getPlayerRecord(player.id);

  if (existing) {
    if (existing.name !== player.name) {
      existing.name = player.name;
      savePlayerRecord(existing);
    }
    return existing;
  }

  const record = {
    v: SCHEMA_VERSION,
    id: player.id,
    name: player.name,
    roleId: DEFAULT_ROLE_ID,
    lives: getMaxLives(DEFAULT_ROLE_ID),
    status: PlayerStatus.ALIVE,
  };
  savePlayerRecord(record);
  return record;
}

export function assignRole(record, roleId) {
  if (!roleExists(roleId)) {
    const validRoles = Object.keys(ROLES).join(", ");
    return { ok: false, reason: `Rol "${roleId}" no existe. Roles válidos: ${validRoles}` };
  }

  if (record.status === PlayerStatus.ELIMINATED) {
    return { ok: false, reason: `${record.name} está eliminado; no se le puede asignar rol.` };
  }

  record.roleId = roleId;
  record.lives = getMaxLives(roleId);
  savePlayerRecord(record);
  return { ok: true, record };
}

export function loseLife(player) {
  const record = ensurePlayerRegistered(player);

  if (record.status === PlayerStatus.ELIMINATED) {
    return { ignored: true, record };
  }

  record.lives = Math.max(0, record.lives - 1);
  const eliminated = record.lives === 0;
  if (eliminated) {
    record.status = PlayerStatus.ELIMINATED;
  }

  savePlayerRecord(record);
  return { ignored: false, eliminated, record };
}