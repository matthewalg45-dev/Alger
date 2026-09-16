import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DText } from "@/src/components/ui/DText";
import { GameState } from "@/src/game/types";
import { ChainId, chainMeta, colors, onChain, spacing } from "@/src/theme/tokens";

export function FoundingSheet({
  state,
  onFound,
}: {
  state: GameState;
  onFound: (id: ChainId) => void;
}) {
  const dormant = (Object.keys(state.chains) as ChainId[]).filter(
    (id) => state.chains[id].size === 0,
  );
  return (
    <Sheet
      visible
      eyebrow="A New Concern"
      title="Found a Chain"
      testID="founding-sheet"
    >
      <DText variant="serif" center style={{ marginBottom: spacing.md }}>
        Two plots have joined at {state.pending_founding_tile}. Name your new
        chain — the founder receives one share, gratis.
      </DText>
      <View style={styles.grid}>
        {dormant.map((id) => {
          const cm = chainMeta(id, state.chains_meta);
          return (
            <Pressable
              key={id}
              testID={`found-${id}`}
              onPress={() => onFound(id)}
              style={[styles.chip, { backgroundColor: cm.color }]}
            >
              <DText variant="bodyStrong" color={onChain(cm.color)}>
                {cm.name}
              </DText>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    width: "48%",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
});
