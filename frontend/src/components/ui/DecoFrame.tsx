import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius } from "@/src/theme/tokens";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  // "solid" = raised panel, "ghost" = only border, "inset" = sunken
  tone?: "solid" | "ghost" | "inset";
  accent?: boolean; // brighter gold border
  testID?: string;
}

// The signature gold double-hairline frame used throughout the web build.
export function DecoFrame({ children, style, tone = "solid", accent, testID }: Props) {
  return (
    <View
      testID={testID}
      style={[
        styles.frame,
        tone === "solid" && styles.solid,
        tone === "inset" && styles.inset,
        { borderColor: accent ? colors.gold : colors.line },
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 16,
  },
  solid: {
    backgroundColor: colors.panel,
  },
  inset: {
    backgroundColor: colors.ink2,
  },
});
