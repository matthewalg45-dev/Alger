import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronRule } from "@/src/components/ui/ChevronRule";
import { DecoButton } from "@/src/components/ui/DecoButton";
import { DecoFrame } from "@/src/components/ui/DecoFrame";
import { DText } from "@/src/components/ui/DText";
import { SkylineBackground } from "@/src/components/ui/SkylineBackground";
import { api } from "@/src/game/api";
import { NewPlayer } from "@/src/game/types";
import { PERSONAS, colors, fonts, radius, spacing } from "@/src/theme/tokens";

const PERSONA_KEYS = ["baron", "broker", "raider", "speculator"];
const DIFFICULTIES = [
  { id: "easy", name: "Easy", note: "Cordial dilettantes — random moves." },
  { id: "classic", name: "Classic", note: "Persona-driven strategists." },
  {
    id: "cutthroat",
    name: "Cutthroat",
    note: "Ruthless magnates — max buys, tight endgame.",
  },
];

type Seat = NewPlayer;

const CTA_HEIGHT = 84;

export default function Setup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [seats, setSeats] = useState<Seat[]>([
    { name: "You", is_ai: false, persona: null },
    { name: "The Baron", is_ai: true, persona: "baron" },
  ]);
  const [difficulty, setDifficulty] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (i: number, patch: Partial<Seat>) =>
    setSeats((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const toggleType = (i: number) => {
    const seat = seats[i];
    if (seat.is_ai) {
      update(i, { is_ai: false, persona: null, name: `Player ${i + 1}` });
    } else {
      const used = seats.filter((s) => s.is_ai).map((s) => s.persona);
      const persona = PERSONA_KEYS.find((p) => !used.includes(p)) ?? "baron";
      update(i, { is_ai: true, persona, name: PERSONAS[persona].name });
    }
  };

  const cyclePersona = (i: number) => {
    const seat = seats[i];
    const cur = PERSONA_KEYS.indexOf(seat.persona ?? "baron");
    const next = PERSONA_KEYS[(cur + 1) % PERSONA_KEYS.length];
    update(i, { persona: next, name: PERSONAS[next].name });
  };

  const addSeat = () => {
    if (seats.length >= 4) return;
    const used = seats.filter((s) => s.is_ai).map((s) => s.persona);
    const persona = PERSONA_KEYS.find((p) => !used.includes(p)) ?? "broker";
    setSeats((s) => [
      ...s,
      { name: PERSONAS[persona].name, is_ai: true, persona },
    ]);
  };

  const removeSeat = (i: number) => {
    if (seats.length <= 2) return;
    setSeats((s) => s.filter((_, idx) => idx !== i));
  };

  const start = async () => {
    setLoading(true);
    setError(null);
    const mode = seats.every((s) => !s.is_ai) ? "local" : "solo";
    try {
      const players = seats.map((s, i) => ({
        name: s.name.trim() || (s.is_ai ? "Automaton" : `Player ${i + 1}`),
        is_ai: s.is_ai,
        persona: s.is_ai ? s.persona : null,
      }));
      const game = await api.createGame({
        players,
        seed: null,
        mode,
        difficulty,
      });
      router.replace(`/game/${game.id}`);
    } catch (e) {
      setError((e as Error).message || "Unable to open the boardroom.");
      setLoading(false);
    }
  };

  return (
    <SkylineBackground dim>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          testID="setup-back"
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={22} color={colors.gold} />
          <DText variant="label">Boardroom</DText>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={CTA_HEIGHT + 16}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: CTA_HEIGHT + insets.bottom + spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DText variant="label" center>
          Assemble the Syndicate
        </DText>
        <DText variant="display" center style={{ marginTop: 6 }}>
          The Partners
        </DText>
        <View style={{ marginVertical: spacing.md }}>
          <ChevronRule width={140} />
        </View>

        <DText variant="label" style={{ marginBottom: spacing.sm }}>
          The Table · {seats.length} Seats
        </DText>
        <View style={{ gap: spacing.sm }}>
          {seats.map((seat, i) => (
            <DecoFrame key={i} tone="inset" style={styles.seat}>
              <View style={styles.seatTop}>
                <View
                  style={[
                    styles.monogram,
                    seat.is_ai
                      ? { backgroundColor: colors.panelHi }
                      : { backgroundColor: colors.gold },
                  ]}
                >
                  <DText
                    variant="display"
                    color={seat.is_ai ? colors.gold : colors.ink}
                    style={{ fontSize: 18 }}
                  >
                    {seat.is_ai
                      ? PERSONAS[seat.persona ?? "baron"].monogram
                      : (seat.name[0] || "P").toUpperCase()}
                  </DText>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    testID={`seat-name-${i}`}
                    value={seat.name}
                    onChangeText={(t) => update(i, { name: t })}
                    placeholder="Name"
                    placeholderTextColor={colors.creamFaint}
                    style={styles.input}
                    maxLength={18}
                  />
                  <DText variant="body" style={{ fontSize: 11 }}>
                    {seat.is_ai
                      ? `Automaton · ${PERSONAS[seat.persona ?? "baron"].tagline}`
                      : "Human partner"}
                  </DText>
                </View>
                {seats.length > 2 && (
                  <Pressable
                    testID={`remove-seat-${i}`}
                    onPress={() => removeSeat(i)}
                    hitSlop={10}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="close" size={18} color={colors.creamFaint} />
                  </Pressable>
                )}
              </View>
              <View style={styles.seatActions}>
                <Pressable
                  testID={`toggle-type-${i}`}
                  onPress={() => toggleType(i)}
                  style={styles.pill}
                >
                  <Ionicons
                    name={seat.is_ai ? "hardware-chip-outline" : "person-outline"}
                    size={14}
                    color={colors.gold}
                  />
                  <DText variant="label" style={{ fontSize: 10 }}>
                    {seat.is_ai ? "Automaton" : "Human"}
                  </DText>
                </Pressable>
                {seat.is_ai && (
                  <Pressable
                    testID={`cycle-persona-${i}`}
                    onPress={() => cyclePersona(i)}
                    style={styles.pill}
                  >
                    <Ionicons name="swap-horizontal" size={14} color={colors.gold} />
                    <DText variant="label" style={{ fontSize: 10 }}>
                      {PERSONAS[seat.persona ?? "baron"].name}
                    </DText>
                  </Pressable>
                )}
              </View>
            </DecoFrame>
          ))}
        </View>

        {seats.length < 4 && (
          <DecoButton
            testID="add-seat"
            label="+ Add Seat"
            variant="ghost"
            small
            onPress={addSeat}
            style={{ marginTop: spacing.sm, alignSelf: "flex-start" }}
          />
        )}

        <DText variant="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Automaton Difficulty
        </DText>
        <View style={{ gap: spacing.sm }}>
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.id;
            return (
              <Pressable
                key={d.id}
                testID={`difficulty-${d.id}`}
                onPress={() => setDifficulty(d.id)}
                style={[styles.diff, active && styles.diffActive]}
              >
                <View style={{ flex: 1 }}>
                  <DText
                    variant="title"
                    color={active ? colors.gold : colors.cream}
                  >
                    {d.name}
                  </DText>
                  <DText variant="body" style={{ fontSize: 12, marginTop: 2 }}>
                    {d.note}
                  </DText>
                </View>
                {active && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.gold} />
                )}
              </Pressable>
            );
          })}
        </View>

        {error && (
          <DText variant="body" color={colors.danger} style={{ marginTop: spacing.md }}>
            {error}
          </DText>
        )}
      </KeyboardAwareScrollView>

      <KeyboardStickyView>
        <View
          style={[
            styles.cta,
            { paddingBottom: insets.bottom + spacing.sm },
          ]}
        >
          <DecoButton
            testID="start-game"
            label="Open the Boardroom"
            loading={loading}
            onPress={start}
          />
        </View>
      </KeyboardStickyView>
    </SkylineBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  back: { flexDirection: "row", alignItems: "center", gap: 4 },
  seat: { padding: spacing.md, gap: spacing.sm },
  seatTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.cream,
    paddingVertical: 2,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  seatActions: { flexDirection: "row", gap: spacing.sm },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  diff: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.ink2,
  },
  diffActive: {
    borderColor: colors.gold,
    backgroundColor: colors.panel,
  },
  cta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: "rgba(11,15,25,0.94)",
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
});
