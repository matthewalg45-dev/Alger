import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Sheet } from "@/src/components/game/Sheet";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DText } from "@/src/components/ui/DText";
import { Stepper } from "@/src/components/ui/Stepper";
import { GameState } from "@/src/game/types";
import { chainMeta, colors, money, onChain, spacing } from "@/src/theme/tokens";

export function MergerSheet({
  state,
  onResolve,
  loading,
}: {
  state: GameState;
  onResolve: (sell: number, trade: number) => void;
  loading?: boolean;
}) {
  const pm = state.pending_merger!;
  const defunctId = pm.defuncts[pm.current_defunct_idx];
  const resolverIdx = pm.resolver_order[pm.resolver_idx];
  const resolver = state.players[resolverIdx];
  const held = resolver.stocks[defunctId] || 0;
  const acquirer = state.chains[pm.acquirer];
  const price = state.prices[defunctId] || 0;

  const defMeta = chainMeta(defunctId, state.chains_meta);
  const acqMeta = chainMeta(pm.acquirer, state.chains_meta);

  const [sell, setSell] = useState(0);
  const [trade, setTrade] = useState(0);

  useEffect(() => {
    setSell(0);
    setTrade(0);
  }, [defunctId, resolverIdx]);

  const keep = held - sell - trade;
  const tradeShares = Math.floor(trade / 2);
  const proceeds = sell * price;
  const maxTrade = Math.min(
    held - sell,
    acquirer.shares_left * 2,
  );
  const invalid =
    sell < 0 ||
    trade < 0 ||
    trade % 2 !== 0 ||
    sell + trade > held ||
    tradeShares > acquirer.shares_left;

  return (
    <Sheet
      visible
      eyebrow="Merger of Concerns"
      title="Share Disposition"
      testID="merger-sheet"
    >
      <View style={styles.header}>
        <View style={[styles.pill, { backgroundColor: defMeta.color }]}>
          <DText variant="bodyStrong" color={onChain(defMeta.color)} style={{ fontSize: 12 }}>
            {defMeta.name}
          </DText>
        </View>
        <DText variant="label">absorbed by</DText>
        <View style={[styles.pill, { backgroundColor: acqMeta.color }]}>
          <DText variant="bodyStrong" color={onChain(acqMeta.color)} style={{ fontSize: 12 }}>
            {acqMeta.name}
          </DText>
        </View>
      </View>

      <DText variant="serif" center style={{ marginBottom: spacing.md }}>
        {resolver.name}, you hold {held} {defMeta.name} share
        {held === 1 ? "" : "s"} at {money(price)} each.
      </DText>

      <Row label="Sell at market" hint={`+${money(proceeds)}`}>
        <Stepper value={sell} onChange={setSell} max={held - trade} testID="merger-sell" />
      </Row>
      <Row
        label="Trade 2-for-1"
        hint={`→ ${tradeShares} ${acqMeta.name}`}
      >
        <Stepper
          value={trade}
          onChange={setTrade}
          step={2}
          max={maxTrade}
          testID="merger-trade"
        />
      </Row>
      <Row label="Keep" hint="hold for dividends">
        <DText variant="mono" style={{ fontSize: 18 }}>
          {keep}
        </DText>
      </Row>

      <DText variant="body" center style={{ fontSize: 11, marginBottom: spacing.sm }}>
        {acquirer.shares_left} {acqMeta.name} shares remain in the market.
      </DText>

      <DecoButton
        testID="confirm-merger"
        label="Confirm Disposition"
        disabled={invalid}
        loading={loading}
        onPress={() => onResolve(sell, trade)}
      />
    </Sheet>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <DText variant="bodyStrong">{label}</DText>
        <DText variant="body" color={colors.gold} style={{ fontSize: 11 }}>
          {hint}
        </DText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
});
