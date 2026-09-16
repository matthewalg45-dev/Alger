import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/src/theme/tokens";

// A slim Art Deco sunburst / chevron rule used under titles.
export function ChevronRule({ width = 120 }: { width?: number }) {
  const count = Math.max(3, Math.floor(width / 14));
  return (
    <View style={[styles.row, { width }]}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.chevron} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    alignSelf: "center",
  },
  chevron: {
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: colors.goldDim,
    transform: [{ rotate: "-45deg" }],
  },
});
