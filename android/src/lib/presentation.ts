export type AppScreen = "home" | "break" | "settings" | "records" | "desk";

export function shouldPresentGiftBox(
  startupResolved: boolean,
  screen: AppScreen,
  pendingCount: number
): boolean {
  return startupResolved && screen !== "break" && pendingCount > 0;
}

export function screenAfterGift(current: AppScreen): AppScreen {
  return current === "break" ? "break" : "desk";
}
