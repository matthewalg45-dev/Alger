import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronRule } from "@/src/components/ui/ChevronRule";
import { DecoFrame } from "@/src/components/ui/DecoFrame";
import { DText } from "@/src/components/ui/DText";
import { SkylineBackground } from "@/src/components/ui/SkylineBackground";
import { CHAINS, TIER_NAMES, colors, onChain, spacing } from "@/src/theme/tokens";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "The Object",
    body: "Amass the greatest personal fortune by the game's end. Wealth is the sum of cash-on-hand and the liquidated value of your stock certificates.",
  },
  {
    title: "1 · Place a Tile",
    body: "Set one of your six deed tiles on its labelled square. Adjacencies may found a chain, expand one, or trigger a merger.",
  },
  {
    title: "2 · Found or Merge",
    body: "Join two unaffiliated plots to found a dormant chain — the founder receives one share, gratis. Bridge two active chains and the larger absorbs the smaller.",
  },
  {
    title: "3 · Buy up to Three",
    body: "Purchase up to three shares of any active chains, in any combination, subject to your cash.",
  },
  {
    title: "4 · End Turn",
    body: "Refill your hand to six tiles from the deck and pass the play.",
  },
  {
    title: "Mergers & Bonuses",
    body: "When a chain is absorbed it pays its shareholders: the Majority holder receives 12× the share price, the Minority 6×. Ties split the pooled bonus. Then sell at market, trade two defunct shares for one acquirer share, or keep them.",
  },
  {
    title: "The Endgame",
    body: "Any player may declare the end once a single chain exceeds 41 tiles, or every active chain is a landmark of 11+ tiles. All chains liquidate, final bonuses are paid, and the wealthiest partner takes the mantle.",
  },
  {
    title: "Illegal Placements",
    body: "A tile that would merge two safe (11+) chains cannot be played, nor may a new chain be founded when all seven are active. Such tiles are quietly discarded.",
  },
];

export default function Rules() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <SkylineBackground dim>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          testID="rules-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={22} color={colors.gold} />
          <DText variant="label">Boardroom</DText>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DText variant="label" center>
          The Prospectus
        </DText>
        <DText variant="display" center style={{ marginTop: 6 }}>
          How to Play
        </DText>
        <View style={{ marginVertical: spacing.md }}>
          <ChevronRule width={140} />
        </View>

        <View style={{ gap: spacing.md }}>
          {SECTIONS.map((s) => (
            <DecoFrame key={s.title} tone="inset">
              <DText variant="title" color={colors.gold}>
                {s.title}
              </DText>
              <DText variant="serif" style={{ marginTop: 6 }}>
                {s.body}
              </DText>
            </DecoFrame>
          ))}

          <DecoFrame tone="inset">
            <DText variant="title" color={colors.gold}>
              The Seven Chains
            </DText>
            <View style={styles.chainGrid}>
              {CHAINS.map((c) => (
                <View key={c.id} style={styles.chainItem}>
                  <View style={[styles.swatch, { backgroundColor: c.color }]}>
                    <DText
                      variant="mono"
                      color={onChain(c.color)}
                      style={{ fontSize: 12 }}
                    >
                      {c.name[0]}
                    </DText>
                  </View>
                  <View>
                    <DText variant="bodyStrong">{c.name}</DText>
                    <DText variant="body" style={{ fontSize: 11 }}>
                      {TIER_NAMES[c.tier]}
                    </DText>
                  </View>
                </View>
              ))}
            </View>
          </DecoFrame>
        </View>
      </ScrollView>
    </SkylineBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  back: { flexDirection: "row", alignItems: "center", gap: 4 },
  chainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
    rowGap: spacing.md,
  },
  chainItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
});
