import { ChainId, ChainMeta } from "@/src/theme/tokens";

export type Phase =
  | "place"
  | "found"
  | "buy"
  | "resolve_merger"
  | "payout"
  | "game_over";

export type Cell = null | "placed" | ChainId;

export interface EarningsEvent {
  kind: string;
  chain_id?: string;
  amount: number;
  note?: string;
}

export interface Earnings {
  starting_cash: number;
  merger_bonuses: number;
  endgame_bonuses: number;
  share_sales: number;
  endgame_liquidation: number;
  purchases: number;
  events: EarningsEvent[];
}

export interface Player {
  id: number;
  name: string;
  is_ai: boolean;
  persona: string | null;
  cash: number;
  hand: string[];
  stocks: Record<ChainId, number>;
  sabotage_card: string | null;
  sabotage_used: boolean;
  peek_tiles: string[];
  earnings: Earnings;
}

export interface Chain {
  id: ChainId;
  size: number;
  shares_left: number;
  tiles: string[];
}

export interface MergerTie {
  candidates: ChainId[];
}

export interface PendingMerger {
  defuncts: ChainId[];
  current_defunct_idx: number;
  resolver_order: number[];
  resolver_idx: number;
  acquirer: ChainId;
}

export interface Distribution {
  kind: "majority" | "minority" | "solo" | "split-majority" | "split-minority";
  player_id: number;
  player_name: string;
  amount: number;
  shares?: number;
}

export interface PendingPayout {
  defunct_id: ChainId;
  distributions: Distribution[];
}

export interface GameState {
  id: string;
  board: Cell[][];
  players: Player[];
  chains: Record<ChainId, Chain>;
  chains_meta: ChainMeta[];
  turn: number;
  phase: Phase;
  pending_founding_tile: string | null;
  pending_merger_tie: MergerTie | null;
  pending_merger: PendingMerger | null;
  pending_payout: PendingPayout | null;
  buys_left: number;
  history: string[];
  deck_size: number;
  endgame_available: boolean;
  winner_ids: number[];
  can_undo: boolean;
  prices: Record<ChainId, number>;
  started_at: string;
  ended_at: string | null;
  mode: string;
  hand_size: number;
  difficulty: string;
}

export interface GameSummary {
  id: string;
  players: { name: string; is_ai: boolean }[];
  phase: Phase;
  turn: number;
  started_at: string;
  winner_ids: number[];
}

export interface NewPlayer {
  name: string;
  is_ai: boolean;
  persona: string | null;
}
