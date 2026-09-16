import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DText } from "@/src/components/ui/DText";
import { GameState } from "@/src/game/types";
import { ChainId, chainMeta, colors, money, onChain, spacing } from "@/src/theme/tokens";

export function TieSheet({
  state,
  onChoose,
}: {
  state: GameState;
  onChoose: (id: ChainId) => void;
}) {
  const candidates = state.pending_merger_tie?.candidates ?? [];
  return (
    <Sheet visible eyebrow="Equal Standing" title="Choose the Survivor" testID="tie-sheet">
      <DText variant="serif" center style={{ marginBottom: spacing.md }}>
        The merging chains are of equal size. As the architect of this deal, you
        decide which survives to absorb the other.
      </DText>
      <View style={{ gap: spacing.sm }}>
        {candidates.map((id) => {
          const cm = chainMeta(id, state.chains_meta);
          const ch = state.chains[id];
          return (
            <Pressable
              key={id}
              testID={`tie-${id}`}
              onPress={() => onChoose(id)}
              style={[styles.row, { borderColor: cm.color }]}
            >
              <View style={[styles.swatch, { backgroundColor: cm.color }]}>
                <DText variant="mono" color={onChain(cm.color)}>
                  {cm.name[0]}
                </DText>
              </View>
              <View style={{ flex: 1 }}>
                <DText variant="bodyStrong">{cm.name}</DText>
                <DText variant="body" style={{ fontSize: 12 }}>
                  {ch.size} tiles · {money(state.prices[id])}
                </DText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.panel,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
