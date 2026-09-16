import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { DText } from "@/src/components/ui/DText";
import { colors, radius } from "@/src/theme/tokens";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  step?: number;
  testID?: string;
}

export function Stepper({ value, onChange, min = 0, max, step = 1, testID }: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <View style={styles.row} testID={testID}>
      <Pressable
        testID={testID ? `${testID}-dec` : undefined}
        onPress={dec}
        disabled={value <= min}
        style={[styles.btn, value <= min && styles.off]}
        hitSlop={6}
      >
        <Ionicons name="remove" size={18} color={colors.gold} />
      </Pressable>
      <DText variant="mono" style={styles.val}>
        {value}
      </DText>
      <Pressable
        testID={testID ? `${testID}-inc` : undefined}
        onPress={inc}
        disabled={value >= max}
        style={[styles.btn, value >= max && styles.off]}
        hitSlop={6}
      >
        <Ionicons name="add" size={18} color={colors.gold} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  btn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
  },
  off: { opacity: 0.3 },
  val: { fontSize: 18, minWidth: 28, textAlign: "center" },
});
