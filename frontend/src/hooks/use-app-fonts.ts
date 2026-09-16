import { useFonts } from "expo-font";

// App display + body faces (Art Deco). Static weights validated as real TTFs.
export const useAppFonts = (): readonly [boolean, Error | null] =>
  useFonts({
    Playfair: require("@/assets/fonts/PlayfairDisplay-Regular.ttf"),
    PlayfairBold: require("@/assets/fonts/PlayfairDisplay-Bold.ttf"),
    PlayfairBlack: require("@/assets/fonts/PlayfairDisplay-Black.ttf"),
    Inter: require("@/assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("@/assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("@/assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("@/assets/fonts/Inter-Bold.ttf"),
    Mono: require("@/assets/fonts/RobotoMono-Medium.ttf"),
  });
