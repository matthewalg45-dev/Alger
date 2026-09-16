import { GameState, GameSummary, NewPlayer } from "@/src/game/types";
import { ChainId } from "@/src/theme/tokens";

const BASE = process.env.EXPO_PUBLIC_GAME_API_URL;

async function req<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      // ignore parse errors
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface Config {
  message: string;
  chains: { id: string; name: string; tier: number; color: string }[];
  personas: Record<string, { name: string; monogram: string; tagline: string }>;
  sabotage_cards: Record<string, { name: string; description: string }>;
}

export const api = {
  config: () => req<Config>("/"),
  listGames: () => req<GameSummary[]>("/games"),
  getGame: (id: string) => req<GameState>(`/games/${id}`),
  createGame: (payload: {
    players: NewPlayer[];
    seed: number | null;
    mode: string;
    difficulty: string;
  }) => req<GameState>("/games", "POST", payload),
  deleteGame: (id: string) => req<void>(`/games/${id}`, "DELETE"),
  place: (id: string, tile: string) =>
    req<GameState>(`/games/${id}/place`, "POST", { tile }),
  found: (id: string, chain_id: ChainId) =>
    req<GameState>(`/games/${id}/found`, "POST", { chain_id }),
  chooseAcquirer: (id: string, chain_id: ChainId) =>
    req<GameState>(`/games/${id}/choose-acquirer`, "POST", { chain_id }),
  resolveMerger: (id: string, sell: number, trade: number) =>
    req<GameState>(`/games/${id}/merger`, "POST", { sell, trade }),
  confirmPayout: (id: string) =>
    req<GameState>(`/games/${id}/confirm-payout`, "POST"),
  buy: (id: string, purchases: Partial<Record<ChainId, number>>) =>
    req<GameState>(`/games/${id}/buy`, "POST", { purchases }),
  endTurn: (id: string, declare_end = false) =>
    req<GameState>(`/games/${id}/endturn`, "POST", { declare_end }),
  aiStep: (id: string) => req<GameState>(`/games/${id}/ai-step`, "POST"),
  sabotage: (
    id: string,
    target_player_id: number | null,
    target_chain_id: ChainId | null,
  ) =>
    req<GameState>(`/games/${id}/sabotage`, "POST", {
      target_player_id,
      target_chain_id,
    }),
  rematch: (id: string) => req<GameState>(`/games/${id}/rematch`, "POST"),
};

// Tile helpers ------------------------------------------------------------
export const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
export const COLS = 12;

export function parseTile(tile: string): { row: number; col: number } | null {
  const m = /^(\d+)([A-I])$/.exec(tile);
  if (!m) return null;
  return { col: parseInt(m[1], 10) - 1, row: ROWS.indexOf(m[2]) };
}
