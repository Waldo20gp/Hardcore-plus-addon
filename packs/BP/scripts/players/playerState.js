import { GameMode } from "@minecraft/server";
import { PlayerStatus } from "../config.js";

export function applyPlayerState(player, record) {
  if (record.status === PlayerStatus.ELIMINATED && player.getGameMode() !== GameMode.Spectator) {
    player.setGameMode(GameMode.Spectator);
  }
}