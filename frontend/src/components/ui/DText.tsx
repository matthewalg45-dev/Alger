import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { colors, fonts } from "@/src/theme/tokens";

type Variant =
  | "hero" // huge display title
  | "display" // section display
  | "serif" // elegant serif body
  | "title" // panel title
  | "body"
  | "bodyStrong"
  | "label" // tiny uppercase caption
  | "mono";

const styles = StyleSheet.create({
  hero: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    color: colors.cream,
    letterSpacing: 1,
  },
  display: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.cream,
    letterSpacing: 0.5,
  },
  serif: {
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 22,
    color: colors.creamDim,
  },
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.cream,
    letterSpacing: 0.3,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.creamDim,
  },
  bodyStrong: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    lineHeight: 20,
    color: colors.cream,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.gold,
    textTransform: "uppercase",
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.cream,
    letterSpacing: 0.5,
  },
});

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: TextStyle | TextStyle[];
}

export function DText({
  variant = "body",
  color,
  center,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        styles[variant],
        color ? { color } : null,
        center ? { textAlign: "center" } : null,
        style as TextStyle,
      ]}
    />
  );
}
