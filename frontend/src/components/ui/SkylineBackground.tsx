import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/src/theme/tokens";

// Deterministic Manhattan skyline silhouette rendered from simple rects.
const BUILDINGS: { w: number; h: number; step?: boolean }[] = [
  { w: 26, h: 70 },
  { w: 34, h: 120, step: true },
  { w: 22, h: 90 },
  { w: 40, h: 160, step: true },
  { w: 24, h: 110 },
  { w: 30, h: 200, step: true },
  { w: 20, h: 130 },
  { w: 36, h: 150, step: true },
  { w: 26, h: 96 },
  { w: 44, h: 180, step: true },
  { w: 22, h: 108 },
  { w: 32, h: 140 },
  { w: 24, h: 84 },
];

export function SkylineBackground({
  children,
  dim,
}: {
  children?: React.ReactNode;
  dim?: boolean;
}) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0B0F19", "#0C1120", "#0A0E17"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.skyline, dim && { opacity: 0.35 }, { pointerEvents: "none" }]}>
        {BUILDINGS.map((b, i) => (
          <View
            key={i}
            style={[
              styles.building,
              { width: b.w, height: b.h },
            ]}
          >
            {b.step && <View style={styles.crown} />}
            <Windows w={b.w} h={b.h} idx={i} />
          </View>
        ))}
      </View>
      <LinearGradient
        colors={["transparent", "rgba(11,15,25,0.65)", colors.ink]}
        style={[styles.fade, { pointerEvents: "none" }]}
      />
      {children}
    </View>
  );
}

function Windows({ w, h, idx }: { w: number; h: number; idx: number }) {
  const cols = Math.max(1, Math.floor(w / 9));
  const rows = Math.max(1, Math.floor(h / 16));
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // pseudo-random lit windows
      const lit = ((r * 7 + c * 3 + idx * 5) % 5) === 0;
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            width: 3,
            height: 3,
            margin: 2,
            backgroundColor: lit
              ? "rgba(212,175,55,0.55)"
              : "rgba(212,175,55,0.08)",
          }}
        />,
      );
    }
  }
  return <View style={styles.windows}>{dots}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  skyline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 90,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    opacity: 0.5,
  },
  building: {
    backgroundColor: "#0F1626",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(212,175,55,0.16)",
    marginHorizontal: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  crown: {
    position: "absolute",
    top: -8,
    width: 4,
    height: 10,
    backgroundColor: "rgba(212,175,55,0.3)",
  },
  windows: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 8,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 90,
    height: 320,
  },
});
