import { world, Player } from "@minecraft/server";

world.afterEvents.entityDie.subscribe(
  (event) => {
    const { deadEntity, damageSource } = event;

    // Guard: el filtro ya garantiza que es un jugador,
    // pero el editor no lo sabe. Esto lo hace explícito.
    if (!(deadEntity instanceof Player)) return;

    world.sendMessage(`${deadEntity.name} murió. Causa: ${damageSource.cause}`);
  },
  { entityTypes: ["minecraft:player"] }
);