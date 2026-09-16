import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronRule } from "@/src/components/ui/ChevronRule";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DecoFrame } from "@/src/components/ui/DecoFrame";
import { DText } from "@/src/components/ui/DText";
import { SkylineBackground } from "@/src/components/ui/SkylineBackground";
import { api } from "@/src/game/api";
import { GameSummary } from "@/src/game/types";
import { colors, spacing } from "@/src/theme/tokens";

export default function Boardroom() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const list = await api.listGames();
      list.sort((a, b) => (a.started_at < b.started_at ? 1 : -1));
      setGames(list);
    } catch {
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const ongoing = games.filter((g) => g.phase !== "game_over");

  const remove = async (id: string) => {
    setGames((g) => g.filter((x) => x.id !== id));
    try {
      await api.deleteGame(id);
    } catch {
      load();
    }
  };

  return (
    <SkylineBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DText variant="label" center testID="home-est">
          Est. MCMXXVI
        </DText>
        <View style={styles.titleWrap}>
          <DText variant="hero" center style={styles.titleTop}>
            SKYLINE
          </DText>
          <DText variant="hero" center color={colors.gold} style={styles.titleBottom}>
            EMPIRE
          </DText>
        </View>
        <ChevronRule width={160} />
        <DText variant="serif" center style={styles.tagline}>
          Erect towers, engineer mergers, and outshine{"\n"}every rival on the
          Manhattan skyline.
        </DText>

        <View style={styles.actions}>
          <DecoButton
            testID="home-local-play"
            label="Local Play"
            onPress={() => router.push("/setup")}
          />
          <DecoButton
            testID="home-rules"
            label="Rules"
            variant="outline"
            onPress={() => router.push("/rules")}
          />
        </View>

        <View style={styles.section}>
          <DText variant="label" testID="home-resume-header">
            Resume · Boardroom Ledger
          </DText>
          <View style={styles.divider} />
          {loading ? (
            <ActivityIndicator color={colors.gold} style={{ marginTop: 24 }} />
          ) : games.length === 0 ? (
            <DText variant="body" style={{ marginTop: 12 }}>
              No sessions on record. Assemble a syndicate to begin.
            </DText>
          ) : (
            <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
              {games.slice(0, 24).map((g) => (
                <GameRow
                  key={g.id}
                  game={g}
                  onOpen={() => router.push(`/game/${g.id}`)}
                  onDelete={() => remove(g.id)}
                />
              ))}
            </View>
          )}
        </View>
        {ongoing.length > 0 && (
          <DText variant="body" center style={{ marginTop: spacing.lg }}>
            {ongoing.length} session{ongoing.length > 1 ? "s" : ""} in play
          </DText>
        )}
      </ScrollView>
    </SkylineBackground>
  );
}

function GameRow({
  game,
  onOpen,
  onDelete,
}: {
  game: GameSummary;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const finished = game.phase === "game_over";
  const names = game.players.map((p) => p.name).join(" · ");
  const winner =
    finished && game.winner_ids.length
      ? game.players[game.winner_ids[0]]?.name
      : null;
  return (
    <DecoFrame tone="inset" style={styles.row} accent={!finished}>
      <Pressable
        testID={`resume-game-${game.id}`}
        onPress={onOpen}
        style={{ flex: 1 }}
      >
        <View style={styles.rowTop}>
          <DText variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
            {names}
          </DText>
          <DText
            variant="label"
            color={finished ? colors.creamFaint : colors.gold}
          >
            {finished ? "Closed" : "Active"}
          </DText>
        </View>
        <DText variant="body" style={{ marginTop: 2 }}>
          {finished
            ? winner
              ? `Winner — ${winner}`
              : "Concluded"
            : `Turn ${game.turn + 1} · awaiting play`}
        </DText>
      </Pressable>
      <Pressable
        testID={`delete-game-${game.id}`}
        onPress={onDelete}
        hitSlop={10}
        style={styles.trash}
      >
        <Ionicons name="trash-outline" size={18} color={colors.creamFaint} />
      </Pressable>
    </DecoFrame>
  );
}

const styles = StyleSheet.create({
  titleWrap: { marginTop: spacing.sm, marginBottom: spacing.md },
  titleTop: { fontSize: 44, lineHeight: 48 },
  titleBottom: { fontSize: 44, lineHeight: 50, marginTop: -2 },
  tagline: { marginTop: spacing.md, marginBottom: spacing.xl },
  actions: { gap: spacing.sm },
  section: { marginTop: spacing.xl },
  divider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  trash: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
