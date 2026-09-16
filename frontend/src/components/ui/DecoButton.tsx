import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { DText } from "@/src/components/ui/DText";
import { colors, radius } from "@/src/theme/tokens";

type Variant = "gold" | "outline" | "ghost" | "danger";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
}

export function DecoButton({
  label,
  onPress,
  variant = "gold",
  disabled,
  loading,
  small,
  testID,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const handle = () => {
    if (isDisabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };
  return (
    <Pressable
      testID={testID}
      onPress={handle}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        variant === "gold" && styles.gold,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "gold" ? colors.ink : colors.gold}
          />
        ) : (
          <DText
            variant="label"
            color={labelColor(variant)}
            style={small ? { fontSize: 10, letterSpacing: 2 } : undefined}
          >
            {label}
          </DText>
        )}
      </View>
    </Pressable>
  );
}

function labelColor(v: Variant): string {
  if (v === "gold") return colors.ink;
  if (v === "danger") return colors.cream;
  return colors.gold;
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  small: {
    minHeight: 40,
    paddingHorizontal: 14,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  gold: {
    backgroundColor: colors.gold,
    borderColor: colors.goldSoft,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.line,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  danger: {
    backgroundColor: colors.dangerDeep,
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
