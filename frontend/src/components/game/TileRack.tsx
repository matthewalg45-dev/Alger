import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { DText } from "@/src/components/ui/DText";
import { colors, radius } from "@/src/theme/tokens";

interface Props {
  hand: string[];
  enabled: boolean;
  onPlace: (tile: string) => void;
  peek?: string[];
}

export function TileRack({ hand, enabled, onPlace, peek }: Props) {
  return (
    <View>
      <View style={styles.rack}>
        {hand.map((t) => (
          <Pressable
            key={t}
            testID={`hand-tile-${t}`}
            disabled={!enabled}
            onPress={() => {
              if (Platform.OS !== "web") {
                Haptics.selectionAsync().catch(() => {});
              }
              onPlace(t);
            }}
            style={({ pressed }) => [
              styles.tile,
              enabled ? styles.active : styles.idle,
              pressed && enabled && styles.pressed,
            ]}
          >
            <DText
              variant="mono"
              color={enabled ? colors.ink : colors.creamDim}
              style={styles.tileTxt}
            >
              {t}
            </DText>
          </Pressable>
        ))}
        {hand.length === 0 && (
          <DText variant="body" style={{ paddingVertical: 12 }}>
            No deeds in hand.
          </DText>
        )}
      </View>
      {peek && peek.length > 0 && (
        <View style={styles.peekRow}>
          <DText variant="label" style={{ fontSize: 9 }}>
            Insider Tip · Next Draws
          </DText>
          <View style={styles.peekTiles}>
            {peek.map((t, i) => (
              <View key={`${t}-${i}`} style={styles.peek}>
                <DText variant="mono" color={colors.gold} style={{ fontSize: 11 }}>
                  {t}
                </DText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tile: {
    minWidth: 52,
    height: 48,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.gold,
    borderColor: colors.goldSoft,
  },
  idle: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
  },
  pressed: { opacity: 0.8, transform: [{ translateY: 1 }] },
  tileTxt: { fontSize: 16, letterSpacing: 1 },
  peekRow: { marginTop: 10, gap: 6 },
  peekTiles: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  peek: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
    backgroundColor: colors.ink2,
  },
});
