import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DText } from "@/src/components/ui/DText";
import { GameState } from "@/src/game/types";
import { colors, money, spacing } from "@/src/theme/tokens";

export function GameOverSheet({
  state,
  onRematch,
  onExit,
  loading,
}: {
  state: GameState;
  onRematch: () => void;
  onExit: () => void;
  loading?: boolean;
}) {
  const ranked = state.players
    .slice()
    .sort((a, b) => b.cash - a.cash);
  const champ = ranked[0];

  return (
    <Sheet visible eyebrow="The Ledger is Closed" title="Final Standing" testID="gameover-sheet">
      <View style={styles.crown}>
        <Ionicons name="trophy" size={26} color={colors.gold} />
        <DText variant="display" center color={colors.gold} style={{ fontSize: 20 }}>
          {champ.name}
        </DText>
        <DText variant="serif" center>
          takes the Manhattan skyline with {money(champ.cash)}.
        </DText>
      </View>

      <View style={{ gap: spacing.sm, marginVertical: spacing.md }}>
        {ranked.map((p, i) => (
          <View key={p.id} style={[styles.row, i === 0 && styles.first]}>
            <DText variant="mono" color={colors.gold} style={{ width: 24 }}>
              {i + 1}
            </DText>
            <DText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
              {p.name}
            </DText>
            <DText variant="mono" color={colors.cream}>
              {money(p.cash)}
            </DText>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm }}>
        <DecoButton testID="rematch" label="Rematch" loading={loading} onPress={onRematch} />
        <DecoButton testID="exit-boardroom" label="Boardroom" variant="outline" onPress={onExit} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  crown: { alignItems: "center", gap: 6, marginBottom: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  first: {
    borderColor: colors.gold,
    backgroundColor: "rgba(212,175,55,0.08)",
  },
});
