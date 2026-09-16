import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Board } from "@/src/components/game/Board";
import { BuySheet } from "@/src/components/game/BuySheet";
import { FoundingSheet } from "@/src/components/game/FoundingSheet";
import { GameOverSheet } from "@/src/components/game/GameOverSheet";
import { MergerSheet } from "@/src/components/game/MergerSheet";
import { PayoutSheet } from "@/src/components/game/PayoutSheet";
import { PlayersStrip } from "@/src/components/game/PlayersStrip";
import { SabotageSheet } from "@/src/components/game/SabotageSheet";
import { StockMarket } from "@/src/components/game/StockMarket";
import { TieSheet } from "@/src/components/game/TieSheet";
import { TileRack } from "@/src/components/game/TileRack";
import { DecoFrame } from "@/src/components/ui/DecoFrame";
import { DText } from "@/src/components/ui/DText";
import { api } from "@/src/game/api";
import { GameState } from "@/src/game/types";
import { ChainId, PERSONAS, colors, money, spacing } from "@/src/theme/tokens";

const W = Dimensions.get("window").width;
const SCREEN_PAD = 12;
const FRAME_PAD = 10;
const CELL = Math.floor((W - SCREEN_PAD * 2 - FRAME_PAD * 2 - 22) / 12);

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sabotageOpen, setSabotageOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const mounted = useRef(true);
  const stepping = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const g = await api.getGame(id);
      if (mounted.current) setState(g);
    } catch (e) {
      if ((e as Error & { status?: number }).status === 404) setNotFound(true);
      else setError((e as Error).message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const currentIsHuman = state ? !state.players[state.turn].is_ai : false;

  const resolverIsHuman = (() => {
    if (!state?.pending_merger) return false;
    const r = state.pending_merger.resolver_order[state.pending_merger.resolver_idx];
    return !state.players[r].is_ai;
  })();

  const humanPending = (() => {
    if (!state || state.phase === "game_over") return false;
    if (state.pending_merger_tie) return currentIsHuman;
    if (state.phase === "resolve_merger" && state.pending_merger)
      return resolverIsHuman;
    if (state.phase === "payout") return currentIsHuman;
    return currentIsHuman; // place / found / buy
  })();

  // Drive AI sub-turns until a human decision is required.
  useEffect(() => {
    if (!state || state.phase === "game_over" || humanPending) return;
    if (stepping.current) return;
    stepping.current = true;
    const t = setTimeout(async () => {
      try {
        const s = await api.aiStep(id);
        if (mounted.current) setState(s);
      } catch (e) {
        if (mounted.current) showToast((e as Error).message);
      } finally {
        stepping.current = false;
      }
    }, 700);
    return () => {
      clearTimeout(t);
      stepping.current = false;
    };
  }, [state, humanPending, id, showToast]);

  const run = useCallback(
    async (fn: () => Promise<GameState>, ok?: () => void) => {
      if (busy) return;
      setBusy(true);
      try {
        const s = await fn();
        if (mounted.current) {
          setState(s);
          ok?.();
        }
      } catch (e) {
        if (mounted.current) showToast((e as Error).message);
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [busy, showToast],
  );

  const haptic = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  // ---- Action handlers ----
  const onPlace = (tile: string) => run(() => api.place(id, tile), haptic);
  const onFound = (c: ChainId) => run(() => api.found(id, c), haptic);
  const onChoose = (c: ChainId) => run(() => api.chooseAcquirer(id, c), haptic);
  const onMerger = (sell: number, trade: number) =>
    run(() => api.resolveMerger(id, sell, trade), haptic);
  const onPayout = () => run(() => api.confirmPayout(id), haptic);
  const onBuy = (
    purchases: Partial<Record<ChainId, number>>,
    declareEnd: boolean,
  ) =>
    run(async () => {
      const hasBuys = Object.values(purchases).some((n) => (n ?? 0) > 0);
      if (hasBuys) await api.buy(id, purchases);
      return api.endTurn(id, declareEnd);
    }, haptic);
  const onSabotage = (pid: number | null, cid: ChainId | null) =>
    run(() => api.sabotage(id, pid, cid), () => setSabotageOpen(false));
  const onRematch = () => run(() => api.rematch(id), haptic);

  if (notFound) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <DText variant="display" center>
          Session Not Found
        </DText>
        <DText variant="body" center style={{ marginTop: 8, marginBottom: 20 }}>
          This ledger has been closed or removed.
        </DText>
        <Pressable testID="nf-back" onPress={() => router.replace("/")}>
          <DText variant="label">Return to Boardroom</DText>
        </Pressable>
      </View>
    );
  }

  if (!state) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} />
        <DText variant="label" style={{ marginTop: 12 }}>
          Opening the Boardroom
        </DText>
      </View>
    );
  }

  const cur = state.players[state.turn];
  const human = state.players.find((p) => !p.is_ai);
  // Whose holdings we surface: the active player when human (covers hotseat),
  // otherwise the sole human spectator during automaton turns.
  const viewer = currentIsHuman ? cur : human ?? state.players[0];
  const canSabotage =
    currentIsHuman &&
    !!cur.sabotage_card &&
    !cur.sabotage_used &&
    (state.phase === "place" || state.phase === "buy");

  const banner = getBanner(state, currentIsHuman);

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          testID="game-back"
          onPress={() => router.replace("/")}
          hitSlop={12}
          style={styles.hIcon}
        >
          <Ionicons name="chevron-back" size={22} color={colors.gold} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <DText variant="label" numberOfLines={1}>
            {banner.eyebrow}
          </DText>
          <DText variant="title" numberOfLines={1} style={{ fontSize: 15 }}>
            {banner.title}
          </DText>
        </View>
        <View style={styles.deck}>
          <Ionicons name="albums-outline" size={14} color={colors.creamDim} />
          <DText variant="mono" style={{ fontSize: 12 }}>
            {state.deck_size}
          </DText>
        </View>
        {canSabotage && (
          <Pressable
            testID="open-sabotage"
            onPress={() => setSabotageOpen(true)}
            style={styles.sabBtn}
            hitSlop={8}
          >
            <Ionicons name="flame" size={16} color={colors.gold} />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PAD,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Board */}
        <DecoFrame style={styles.boardFrame} accent={currentIsHuman}>
          <Board
            board={state.board}
            meta={state.chains_meta}
            size={CELL}
            highlight={
              currentIsHuman && state.phase === "place"
                ? new Set(cur.hand)
                : undefined
            }
          />
        </DecoFrame>

        {/* Turn / cash summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <DText variant="label" style={{ fontSize: 8 }}>
              Your Treasury
            </DText>
            <DText variant="mono" color={colors.gold} style={{ fontSize: 18 }}>
              {money(viewer.cash)}
            </DText>
          </View>
          <View style={[styles.summaryItem, { alignItems: "flex-end" }]}>
            <DText variant="label" style={{ fontSize: 8 }}>
              {state.difficulty} · {state.mode}
            </DText>
            <DText variant="bodyStrong" numberOfLines={1}>
              {cur.name}
              {cur.is_ai && cur.persona
                ? ` · ${PERSONAS[cur.persona]?.tagline ?? ""}`
                : ""}
            </DText>
          </View>
        </View>

        {/* Stock market */}
        <SectionLabel>The Exchange</SectionLabel>
        <StockMarket
          chains={state.chains}
          prices={state.prices}
          meta={state.chains_meta}
          viewer={viewer}
        />

        {/* Players */}
        <SectionLabel>The Partners</SectionLabel>
        <PlayersStrip
          players={state.players}
          turn={state.turn}
          winnerIds={state.winner_ids}
        />

        {/* Hand / place prompt */}
        {viewer && (
          <>
            <SectionLabel>Your Deeds</SectionLabel>
            <DecoFrame tone="inset">
              <TileRack
                hand={viewer.hand}
                enabled={
                  currentIsHuman && state.phase === "place" && !busy
                }
                onPlace={onPlace}
                peek={viewer.peek_tiles}
              />
              <DText variant="body" center style={{ fontSize: 12, marginTop: 12 }}>
                {currentIsHuman && state.phase === "place"
                  ? "Tap a deed to place it on the skyline."
                  : banner.hint}
              </DText>
            </DecoFrame>
          </>
        )}

        {/* History */}
        <SectionLabel>The Ledger</SectionLabel>
        <DecoFrame tone="inset" style={{ gap: 4 }}>
          {state.history.length === 0 ? (
            <DText variant="body" style={{ fontSize: 12 }}>
              The market is dormant. Play begins.
            </DText>
          ) : (
            state.history
              .slice(-8)
              .reverse()
              .map((h, i) => (
                <DText
                  key={`${h}-${i}`}
                  variant="body"
                  style={{ fontSize: 12 }}
                  color={i === 0 ? colors.cream : colors.creamFaint}
                >
                  · {h}
                </DText>
              ))
          )}
        </DecoFrame>
      </ScrollView>

      {/* Thinking indicator */}
      {!humanPending && state.phase !== "game_over" && (
        <View style={[styles.thinking, { bottom: insets.bottom + 16 }]}>
          <ActivityIndicator size="small" color={colors.gold} />
          <DText variant="label" style={{ fontSize: 10 }}>
            {cur.name} deliberating
          </DText>
        </View>
      )}

      {/* Toast */}
      {toast && (
        <View
          testID="game-toast"
          style={[styles.toast, { bottom: insets.bottom + 16 }]}
        >
          <Ionicons name="alert-circle" size={16} color={colors.cream} />
          <DText variant="bodyStrong" style={{ flex: 1, fontSize: 12 }}>
            {toast}
          </DText>
        </View>
      )}

      {/* ---- Decision sheets ---- */}
      {state.phase === "game_over" && (
        <GameOverSheet
          state={state}
          onRematch={onRematch}
          onExit={() => router.replace("/")}
          loading={busy}
        />
      )}
      {state.pending_merger_tie && currentIsHuman && (
        <TieSheet state={state} onChoose={onChoose} />
      )}
      {!state.pending_merger_tie &&
        state.phase === "payout" &&
        currentIsHuman && (
          <PayoutSheet state={state} onConfirm={onPayout} loading={busy} />
        )}
      {state.phase === "resolve_merger" &&
        state.pending_merger &&
        resolverIsHuman && (
          <MergerSheet state={state} onResolve={onMerger} loading={busy} />
        )}
      {state.phase === "found" && currentIsHuman && (
        <FoundingSheet state={state} onFound={onFound} />
      )}
      {state.phase === "buy" && currentIsHuman && (
        <BuySheet
          state={state}
          viewer={viewer}
          onCommit={onBuy}
          loading={busy}
        />
      )}
      {sabotageOpen && (
        <SabotageSheet
          state={state}
          viewer={cur}
          onPlay={onSabotage}
          onClose={() => setSabotageOpen(false)}
          loading={busy}
        />
      )}
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <DText variant="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
      {children}
    </DText>
  );
}

function getBanner(
  s: GameState,
  human: boolean,
): { eyebrow: string; title: string; hint: string } {
  if (s.phase === "game_over")
    return { eyebrow: "Concluded", title: "The ledger is closed", hint: "" };
  const actor = s.players[s.turn].name;
  if (s.pending_merger_tie)
    return human
      ? { eyebrow: "Decision", title: "Choose the survivor", hint: "" }
      : { eyebrow: "Merger", title: `${actor} settling a tie`, hint: "Awaiting the market." };
  if (s.phase === "payout")
    return human
      ? { eyebrow: "Merger", title: "Bonuses payable", hint: "" }
      : { eyebrow: "Merger", title: "Directors paying out", hint: "Awaiting the market." };
  if (s.phase === "resolve_merger")
    return { eyebrow: "Merger", title: "Share disposition", hint: "Awaiting the market." };
  if (s.phase === "found")
    return human
      ? { eyebrow: "Opportunity", title: "Found a chain", hint: "" }
      : { eyebrow: "Founding", title: `${actor} incorporating`, hint: "Awaiting the market." };
  if (s.phase === "buy")
    return human
      ? { eyebrow: "Your turn", title: "Acquire stock", hint: "" }
      : { eyebrow: "Turn", title: `${actor} at the exchange`, hint: "Awaiting the market." };
  // place
  return human
    ? { eyebrow: "Your turn", title: "Place a deed", hint: "" }
    : { eyebrow: "Turn", title: `${actor} deliberating`, hint: `${actor} is choosing a play.` };
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: SCREEN_PAD,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    backgroundColor: colors.ink2,
  },
  hIcon: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  deck: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sabBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panel,
  },
  boardFrame: {
    marginTop: spacing.md,
    padding: FRAME_PAD,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  summaryItem: { gap: 2 },
  thinking: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  toast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerDeep,
  },
});
