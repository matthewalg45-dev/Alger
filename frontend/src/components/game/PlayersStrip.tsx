import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DText } from "@/src/components/ui/DText";
import { Player } from "@/src/game/types";
import { PERSONAS, colors, money, radius } from "@/src/theme/tokens";

interface Props {
  players: Player[];
  turn: number;
  winnerIds?: number[];
}

export function PlayersStrip({ players, turn, winnerIds }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {players.map((p) => {
        const active = p.id === turn;
        const winner = winnerIds?.includes(p.id);
        const shares = Object.values(p.stocks).reduce((a, b) => a + b, 0);
        return (
          <View
            key={p.id}
            testID={`player-card-${p.id}`}
            style={[
              styles.card,
              active && styles.active,
              winner && styles.winner,
            ]}
          >
            <View style={styles.head}>
              <View
                style={[
                  styles.mono,
                  { backgroundColor: p.is_ai ? colors.panelHi : colors.gold },
                ]}
              >
                <DText
                  variant="mono"
                  color={p.is_ai ? colors.gold : colors.ink}
                  style={{ fontSize: 13 }}
                >
                  {p.is_ai
                    ? PERSONAS[p.persona ?? "baron"]?.monogram ?? "A"
                    : (p.name[0] || "P").toUpperCase()}
                </DText>
              </View>
              <DText variant="bodyStrong" numberOfLines={1} style={{ flex: 1, fontSize: 12 }}>
                {p.name}
              </DText>
              {winner && <Ionicons name="trophy" size={13} color={colors.gold} />}
            </View>
            <DText variant="mono" color={colors.gold} style={{ fontSize: 15, marginTop: 4 }}>
              {money(p.cash)}
            </DText>
            <DText variant="label" style={{ fontSize: 8, marginTop: 2 }}>
              {shares} shares
            </DText>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingRight: 8 },
  card: {
    width: 116,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.ink2,
  },
  active: {
    borderColor: colors.gold,
    backgroundColor: colors.panel,
  },
  winner: {
    borderColor: colors.gold,
    backgroundColor: "rgba(212,175,55,0.10)",
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  mono: {
    width: 26,
    height: 26,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
