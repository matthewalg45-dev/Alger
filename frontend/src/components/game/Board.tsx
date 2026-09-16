import React from "react";
import { StyleSheet, View } from "react-native";

import { DText } from "@/src/components/ui/DText";
import { parseTile, ROWS, COLS } from "@/src/game/api";
import { Cell } from "@/src/game/types";
import { ChainMeta, chainMeta, colors, onChain } from "@/src/theme/tokens";

interface Props {
  board: Cell[][];
  meta: ChainMeta[];
  size: number; // cell size in px
  highlight?: Set<string>; // tile ids to ring (human hand targets)
  lastTile?: string | null;
}

function tileId(r: number, c: number) {
  return `${c + 1}${ROWS[r]}`;
}

export function Board({ board, meta, size, highlight, lastTile }: Props) {
  const last = lastTile ? parseTile(lastTile) : null;
  return (
    <View style={styles.board}>
      {Array.from({ length: ROWS.length }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: COLS }).map((_, c) => {
            const val = board[r]?.[c] ?? null;
            const id = tileId(r, c);
            const isChain = val && val !== "placed";
            const cm = isChain ? chainMeta(val as string, meta) : null;
            const ring = highlight?.has(id);
            const isLast = last && last.row === r && last.col === c;
            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  { width: size, height: size },
                  val === null && styles.empty,
                  val === "placed" && styles.placed,
                  cm && { backgroundColor: cm.color, borderColor: cm.color },
                  ring && styles.ring,
                  isLast && styles.last,
                ]}
              >
                {cm ? (
                  <DText
                    variant="mono"
                    color={onChain(cm.color)}
                    style={[styles.txt, { fontSize: Math.max(8, size * 0.34) }]}
                  >
                    {cm.name[0]}
                  </DText>
                ) : val === "placed" ? (
                  <View style={styles.dot} />
                ) : (
                  <DText
                    variant="mono"
                    color={colors.creamFaint}
                    style={[styles.coord, { fontSize: Math.max(6, size * 0.24) }]}
                  >
                    {id}
                  </DText>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { gap: 2 },
  row: { flexDirection: "row", gap: 2 },
  cell: {
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  empty: {
    backgroundColor: colors.ink2,
    borderColor: "rgba(212,175,55,0.10)",
  },
  placed: {
    backgroundColor: "#2A2F3E",
    borderColor: colors.goldDim,
  },
  ring: {
    borderColor: colors.gold,
    borderWidth: 1.5,
  },
  last: {
    borderColor: colors.cream,
    borderWidth: 1.5,
  },
  txt: { includeFontPadding: false },
  coord: { opacity: 0.55, includeFontPadding: false },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
});
