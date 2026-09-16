import { BlurView } from "expo-blur";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronRule } from "@/src/components/ui/ChevronRule";
import { DText } from "@/src/components/ui/DText";
import { colors, spacing } from "@/src/theme/tokens";

interface Props {
  visible: boolean;
  onClose?: () => void; // omit to make non-dismissible
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  testID?: string;
}

// Centered Art Deco framed sheet used for all game decisions.
export function Sheet({ visible, onClose, eyebrow, title, children, testID }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        disabled={!onClose}
      >
        <Pressable
          testID={testID}
          style={[
            styles.card,
            { marginBottom: insets.bottom, marginTop: insets.top },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {eyebrow && (
            <DText variant="label" center>
              {eyebrow}
            </DText>
          )}
          <DText variant="display" center style={{ marginTop: 6, fontSize: 22 }}>
            {title}
          </DText>
          <View style={{ marginVertical: spacing.sm }}>
            <ChevronRule width={110} />
          </View>
          <ScrollView
            style={{ maxHeight: 460 }}
            contentContainerStyle={{ paddingTop: spacing.xs }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 12,
    backgroundColor: colors.ink,
    padding: spacing.lg,
  },
});
