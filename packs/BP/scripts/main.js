import { world, Player } from "@minecraft/server";
import { ensurePlayerRegistered, loseLife } from "./players/playerService.js";
import { applyPlayerState } from "./players/playerState.js";
import { registerAdminCommands } from "./admin/adminCommands.js";

function livesText(lives) {
  return lives === 1 ? "1 vida" : `${lives} vidas`;
}

function onPlayerEliminated(record) {
  // Aquí se girará la ruleta en el siguiente paso
  console.warn(`[hcp] ${record.name} eliminado. Ruleta pendiente.`);
}

world.afterEvents.playerSpawn.subscribe((event) => {
  const { player, initialSpawn } = event;
  const record = ensurePlayerRegistered(player);

  if (initialSpawn) {
    console.warn(`[hcp] Jugador registrado: ${JSON.stringify(record)}`);
  }

  applyPlayerState(player, record);
});

world.afterEvents.entityDie.subscribe(
  (event) => {
    const { deadEntity, damageSource } = event;
    if (!(deadEntity instanceof Player)) return;

    const result = loseLife(deadEntity);
    if (result.ignored) return;

    const { record } = result;
    if (result.eliminated) {
      world.sendMessage(`§c${record.name} perdió su última vida y queda fuera del juego.`);
      onPlayerEliminated(record);
    } else {
      world.sendMessage(`${record.name} murió (${damageSource.cause}). Le quedan ${livesText(record.lives)}.`);
    }
  },
  { entityTypes: ["minecraft:player"] }
);

registerAdminCommands();