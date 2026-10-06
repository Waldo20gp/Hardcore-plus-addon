import { world, system, Player } from "@minecraft/server";
import { ROLES } from "../config.js";
import { getAllPlayerRecords, findPlayerRecordByName } from "../data/playerStore.js";
import { assignRole } from "../players/playerService.js";

function reply(event, message) {
  if (event.sourceEntity instanceof Player) {
    event.sourceEntity.sendMessage(message);
  } else {
    console.warn(message);
  }
}

function handleSetRole(event) {
  const parts = event.message.trim().split(/\s+/);
  if (parts.length < 2) {
    reply(event, "[hcp] Uso: /scriptevent hcp:setrole <jugador> <rol>");
    return;
  }

  const roleId = parts.pop().toLowerCase();
  const playerName = parts.join(" ");

  const record = findPlayerRecordByName(playerName);
  if (!record) {
    reply(event, `[hcp] No hay registro de "${playerName}". Debe haber entrado al mundo al menos una vez.`);
    return;
  }

  const result = assignRole(record, roleId);
  if (!result.ok) {
    reply(event, `[hcp] ${result.reason}`);
    return;
  }

  reply(event, `[hcp] ${record.name} ahora es ${ROLES[roleId].displayName} con ${record.lives} vidas.`);
}

function handleDump(event) {
  const records = getAllPlayerRecords();
  if (records.length === 0) {
    reply(event, "[hcp] No hay registros.");
    return;
  }
  for (const record of records) {
    reply(event, JSON.stringify(record));
  }
}

export function registerAdminCommands() {
  system.afterEvents.scriptEventReceive.subscribe(
    (event) => {
      switch (event.id) {
        case "hcp:setrole":
          handleSetRole(event);
          break;
        case "hcp:dump":
          handleDump(event);
          break;
        default:
          reply(event, `[hcp] Comando desconocido: ${event.id}`);
      }
    },
    { namespaces: ["hcp"] }
  );
}