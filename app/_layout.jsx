import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { auth } from "@/configs/firebase.js"; // Assurez-vous que Firebase est bien configuré
import ContextProvider from "@/context/StateContext"
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "outfit": require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-light": require("@/assets/fonts/Outfit-Light.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const segments = useSegments();

  const authStateChanged = (userData) => {
    console.log("onAuthStateChanged", userData);
    setUser(userData); 
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, authStateChanged);
    return subscriber; 
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (user && !inAuthGroup) {
      router.replace("/(tabs)/trips");
    } else if (!user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, initializing]);

  return (
    <ContextProvider>
      <View style={{ flex: 1 }}>
        {/* Si les polices sont encore en cours de chargement */}
        {!loaded && !error && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <ActivityIndicator size="large" color={"#ff6000"} />
          </View>
        )}

        {/* Si les polices sont chargées et l'auth est en cours */}
        {loaded && !initializing && (
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        )}
      </View>
    </ContextProvider>
  );
}
