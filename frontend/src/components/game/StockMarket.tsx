import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { DText } from "@/src/components/ui/DText";
import { Chain, Player } from "@/src/game/types";
import {
  ChainId,
  ChainMeta,
  TIER_NAMES,
  chainMeta,
  colors,
  money,
  onChain,
} from "@/src/theme/tokens";

interface Props {
  chains: Record<ChainId, Chain>;
  prices: Record<ChainId, number>;
  meta: ChainMeta[];
  viewer?: Player; // the human whose holdings we annotate
}

export function StockMarket({ chains, prices, meta, viewer }: Props) {
  const ordered = meta.slice().sort((a, b) => a.tier - b.tier);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {ordered.map((cm) => {
        const ch = chains[cm.id];
        const active = ch.size > 0;
        const safe = ch.size >= 11;
        const held = viewer?.stocks[cm.id] ?? 0;
        return (
          <View
            key={cm.id}
            testID={`market-${cm.id}`}
            style={[styles.card, !active && styles.dormant]}
          >
            <View style={styles.head}>
              <View style={[styles.swatch, { backgroundColor: cm.color }]}>
                <DText variant="mono" color={onChain(cm.color)} style={{ fontSize: 11 }}>
                  {cm.name[0]}
                </DText>
              </View>
              <View style={{ flex: 1 }}>
                <DText variant="bodyStrong" numberOfLines={1} style={{ fontSize: 12 }}>
                  {cm.name}
                </DText>
                <DText variant="label" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                  {TIER_NAMES[cm.tier]}
                </DText>
              </View>
            </View>
            <DText variant="mono" color={colors.gold} style={styles.price}>
              {active ? money(prices[cm.id]) : "—"}
            </DText>
            <View style={styles.stats}>
              <Stat label="Tiles" value={active ? String(ch.size) : "0"} />
              <Stat label="Left" value={String(ch.shares_left)} />
              <Stat
                label="You"
                value={String(held)}
                accent={held > 0}
              />
            </View>
            {safe && (
              <View style={styles.safe}>
                <DText variant="label" style={{ fontSize: 8 }} color={colors.ink}>
                  Safe
                </DText>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <DText
        variant="mono"
        color={accent ? colors.gold : colors.cream}
        style={{ fontSize: 13 }}
      >
        {value}
      </DText>
      <DText variant="label" style={{ fontSize: 7, letterSpacing: 1 }}>
        {label}
      </DText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingRight: 8 },
  card: {
    width: 128,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    gap: 6,
  },
  dormant: { opacity: 0.45 },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  price: { fontSize: 18 },
  stats: { flexDirection: "row", justifyContent: "space-between" },
  safe: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
});
