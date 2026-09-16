import React from "react";
import { StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DText } from "@/src/components/ui/DText";
import { Distribution, GameState } from "@/src/game/types";
import { chainMeta, colors, money, onChain, spacing } from "@/src/theme/tokens";

const KIND: Record<
  Distribution["kind"],
  { label: string; bg: string; fg: string }
> = {
  majority: { label: "Majority", bg: colors.gold, fg: colors.ink },
  minority: { label: "Minority", bg: colors.goldDim, fg: colors.cream },
  solo: { label: "Solo Holder", bg: colors.cream, fg: colors.ink },
  "split-majority": { label: "Split-Majority", bg: colors.gold, fg: colors.ink },
  "split-minority": { label: "Split-Minority", bg: colors.goldDim, fg: colors.cream },
};

export function PayoutSheet({
  state,
  onConfirm,
  loading,
}: {
  state: GameState;
  onConfirm: () => void;
  loading?: boolean;
}) {
  const payout = state.pending_payout!;
  const cm = chainMeta(payout.defunct_id, state.chains_meta);
  return (
    <Sheet
      visible
      eyebrow="Board of Directors"
      title="Merger Payout"
      testID="payout-sheet"
    >
      <View style={[styles.banner, { backgroundColor: cm.color }]}>
        <DText variant="bodyStrong" color={onChain(cm.color)}>
          {cm.name} is absorbed
        </DText>
      </View>
      {payout.distributions.length === 0 ? (
        <DText variant="serif" center style={{ marginVertical: spacing.md }}>
          No shareholders on record — no bonuses paid.
        </DText>
      ) : (
        <View style={{ gap: spacing.sm, marginVertical: spacing.md }}>
          {payout.distributions.map((d, i) => {
            const meta = KIND[d.kind] ?? KIND.minority;
            return (
              <View key={i} style={styles.row}>
                <View style={[styles.tag, { backgroundColor: meta.bg }]}>
                  <DText variant="label" color={meta.fg} style={{ fontSize: 8 }}>
                    {meta.label}
                  </DText>
                </View>
                <DText variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
                  {d.player_name}
                </DText>
                {typeof d.shares === "number" && (
                  <DText variant="body" style={{ fontSize: 12, marginRight: 8 }}>
                    {d.shares} sh
                  </DText>
                )}
                <DText variant="mono" color={colors.gold}>
                  +{money(d.amount)}
                </DText>
              </View>
            );
          })}
        </View>
      )}
      <DecoButton
        testID="confirm-payout"
        label="Proceed to Share Disposition"
        loading={loading}
        onPress={onConfirm}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    minWidth: 66,
    alignItems: "center",
  },
});
