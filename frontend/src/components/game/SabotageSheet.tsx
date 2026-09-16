import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DText } from "@/src/components/ui/DText";
import { GameState, Player } from "@/src/game/types";
import {
  ChainId,
  SABOTAGE,
  chainMeta,
  colors,
  money,
  onChain,
  spacing,
} from "@/src/theme/tokens";

export function SabotageSheet({
  state,
  viewer,
  onPlay,
  onClose,
  loading,
}: {
  state: GameState;
  viewer: Player;
  onPlay: (targetPlayerId: number | null, targetChainId: ChainId | null) => void;
  onClose: () => void;
  loading?: boolean;
}) {
  const card = viewer.sabotage_card;
  const info = card ? SABOTAGE[card] : null;
  if (!info) return null;

  return (
    <Sheet
      visible
      onClose={loading ? undefined : onClose}
      eyebrow="Underhanded Dealings"
      title={info.name}
      testID="sabotage-sheet"
    >
      <DText variant="serif" center style={{ marginBottom: spacing.md }}>
        {info.description}
      </DText>

      {card === "wall_street_rumor" && (
        <View style={{ gap: spacing.sm }}>
          {state.players
            .filter((p) => p.id !== viewer.id)
            .map((p) => (
              <TargetRow
                key={p.id}
                label={p.name}
                sub={money(p.cash)}
                testID={`sabotage-player-${p.id}`}
                onPress={() => onPlay(p.id, null)}
              />
            ))}
        </View>
      )}

      {card === "prohibition_raid" && (
        <View style={{ gap: spacing.sm }}>
          {(Object.keys(state.chains) as ChainId[])
            .filter((id) => state.chains[id].size > 0)
            .map((id) => {
              const cm = chainMeta(id, state.chains_meta);
              return (
                <Pressable
                  key={id}
                  testID={`sabotage-chain-${id}`}
                  onPress={() => onPlay(null, id)}
                  style={[styles.row, { borderColor: cm.color }]}
                >
                  <View style={[styles.swatch, { backgroundColor: cm.color }]}>
                    <DText variant="mono" color={onChain(cm.color)} style={{ fontSize: 11 }}>
                      {cm.name[0]}
                    </DText>
                  </View>
                  <DText variant="bodyStrong" style={{ flex: 1 }}>
                    {cm.name}
                  </DText>
                  <DText variant="body" style={{ fontSize: 12 }}>
                    {state.chains[id].size} tiles
                  </DText>
                </Pressable>
              );
            })}
        </View>
      )}

      {card === "insider_tip" && (
        <TargetRow
          label="Peek the Next 5 Draws"
          sub="Reveal upcoming deeds"
          testID="sabotage-peek"
          onPress={() => onPlay(null, null)}
        />
      )}
    </Sheet>
  );
}

function TargetRow({
  label,
  sub,
  onPress,
  testID,
}: {
  label: string;
  sub: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable testID={testID} onPress={onPress} style={styles.row}>
      <View style={{ flex: 1 }}>
        <DText variant="bodyStrong">{label}</DText>
        <DText variant="body" style={{ fontSize: 12 }}>
          {sub}
        </DText>
      </View>
      <DText variant="label">Play</DText>
    </Pressable>
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
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
