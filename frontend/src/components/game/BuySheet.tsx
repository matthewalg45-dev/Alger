import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DText } from "@/src/components/ui/DText";
import { Stepper } from "@/src/components/ui/Stepper";
import { GameState, Player } from "@/src/game/types";
import {
  ChainId,
  chainMeta,
  colors,
  money,
  onChain,
  spacing,
} from "@/src/theme/tokens";

export function BuySheet({
  state,
  viewer,
  onCommit,
  loading,
}: {
  state: GameState;
  viewer: Player;
  onCommit: (
    purchases: Partial<Record<ChainId, number>>,
    declareEnd: boolean,
  ) => void;
  loading?: boolean;
}) {
  const active = (Object.keys(state.chains) as ChainId[]).filter(
    (id) => state.chains[id].size > 0 && state.chains[id].shares_left > 0,
  );
  const [buys, setBuys] = useState<Partial<Record<ChainId, number>>>({});
  const [declareEnd, setDeclareEnd] = useState(false);

  const total = useMemo(
    () => Object.values(buys).reduce((a, b) => a + (b ?? 0), 0),
    [buys],
  );
  const cost = useMemo(
    () =>
      (Object.entries(buys) as [ChainId, number][]).reduce(
        (a, [id, n]) => a + (n ?? 0) * state.prices[id],
        0,
      ),
    [buys, state.prices],
  );
  const remaining = viewer.cash - cost;

  const setQty = (id: ChainId, v: number) =>
    setBuys((b) => ({ ...b, [id]: v }));

  return (
    <Sheet
      visible
      eyebrow={`${state.buys_left} shares available`}
      title="Acquire Stock"
      testID="buy-sheet"
    >
      {active.length === 0 ? (
        <DText variant="serif" center style={{ marginBottom: spacing.md }}>
          No active chains to invest in. End your turn to draw fresh deeds.
        </DText>
      ) : (
        <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
          {active.map((id) => {
            const cm = chainMeta(id, state.chains_meta);
            const price = state.prices[id];
            const others = total - (buys[id] ?? 0);
            const byBudget = Math.floor(
              (viewer.cash - (cost - (buys[id] ?? 0) * price)) / price,
            );
            const max = Math.max(
              buys[id] ?? 0,
              Math.min(
                state.chains[id].shares_left,
                state.buys_left - others,
                byBudget,
              ),
            );
            return (
              <View key={id} style={styles.row}>
                <View style={[styles.swatch, { backgroundColor: cm.color }]}>
                  <DText variant="mono" color={onChain(cm.color)} style={{ fontSize: 11 }}>
                    {cm.name[0]}
                  </DText>
                </View>
                <View style={{ flex: 1 }}>
                  <DText variant="bodyStrong" style={{ fontSize: 13 }}>
                    {cm.name}
                  </DText>
                  <DText variant="mono" color={colors.gold} style={{ fontSize: 12 }}>
                    {money(price)}
                  </DText>
                </View>
                <Stepper
                  value={buys[id] ?? 0}
                  onChange={(v) => setQty(id, v)}
                  max={Math.max(0, max)}
                  testID={`buy-${id}`}
                />
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.summary}>
        <DText variant="body">Total {total} · {money(cost)}</DText>
        <DText variant="body" color={colors.gold}>
          Cash left {money(remaining)}
        </DText>
      </View>

      {state.endgame_available && (
        <Pressable
          testID="declare-endgame"
          onPress={() => setDeclareEnd((v) => !v)}
          style={styles.declare}
        >
          <Ionicons
            name={declareEnd ? "checkbox" : "square-outline"}
            size={20}
            color={colors.gold}
          />
          <DText variant="bodyStrong" style={{ flex: 1 }}>
            Declare the Endgame
          </DText>
        </Pressable>
      )}

      <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
        {total > 0 && (
          <DecoButton
            testID="buy-and-end"
            label={`Purchase ${total} & End Turn`}
            loading={loading}
            onPress={() => onCommit(buys, declareEnd)}
          />
        )}
        <DecoButton
          testID="end-turn"
          label={total > 0 ? "Discard & End Turn" : "End Turn"}
          variant="outline"
          loading={loading}
          onPress={() => onCommit({}, declareEnd)}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 8,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  declare: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
