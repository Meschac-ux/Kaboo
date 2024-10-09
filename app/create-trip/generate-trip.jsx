import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "../../configs/style";
import { useStateContext } from "../../context/StateContext";
import { AI_PROMPT } from "../../constants/opions";
import { chatSession } from "../../configs/aiModel";
import { auth, store } from "../../configs/firebase";
import { addDoc, collection } from "firebase/firestore"; // Assurez-vous d'importer addDoc et collection

const GenerateTrip = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const { travelData } = useStateContext();

  const generateAiPrompt = useCallback(async () => {
    setLoading(true);
    const PROMPT = AI_PROMPT.replace(
      "{totalDay}",
      travelData?.totalNumberOfDays
    )
      .replace("{traveler}", travelData?.traveler)
      .replace("{locationOrigin}", "Cotonou, Bénin")
      .replace("{destination}", travelData?.locationInfo?.name)
      .replace("{budget}", travelData?.budget)
      .replace("{totalDay}", travelData?.totalNumberOfDays)
      .replace("{totalNight}", travelData?.totalNumberOfDays - 1);

    console.log(PROMPT);
    console.log(new Date().toISOString());

    const result = await chatSession.sendMessage(PROMPT);
    const rawResponse = result.response.text();

    console.log("Raw Response:", rawResponse); 
    let cleanedResponse = rawResponse
      .trim()
      .replace(/^[^\{]*/, "") 
      .replace(/(^[`]+|[`]+$)/g, "") 
      .replace(/`+/g, ""); 

    const jsonMatch = cleanedResponse.match(/\{.*\}/s);
    cleanedResponse = jsonMatch ? jsonMatch[0] : ""; 

    console.log("Cleaned Response:", cleanedResponse);

    const formatTrip = (tripData) => {
      try {
        return JSON.parse(tripData);
      } catch (error) {
        console.error("Erreur de formatage du voyage :", error);
        return {};
      }
    };

    try {
      if (cleanedResponse && cleanedResponse.startsWith("{")) {
        const tripResp = cleanedResponse;

        // Continue with saving the trip response
        const docRef = await addDoc(collection(store, "userTrips"), {
          userEmail: user.email,
          tripPlan: formatTrip(tripResp),
          tripData: JSON.stringify(travelData),
          createdAt: new Date().toISOString(),
        });

        if (docRef) {
          router.push("(tabs)/trips");
        }
      } else {
        throw new Error("Invalid response format or empty response");
      }
    } catch (error) {
      console.error("Parsing error:", error);
      ToastAndroid.show(
        "Erreur lors de la génération du trip: " + error.message,
        ToastAndroid.SHORT
      );
    }

    setLoading(false);
  }, [travelData, user.email, router]);

  useEffect(() => {
    if (travelData) {
      generateAiPrompt();
    }
  }, [travelData, generateAiPrompt]);

  return (
    <View style={[styles.container, { paddingTop: insets.top * 3 }]}>
      <Text style={styles.title}>Un peu de patience...</Text>
      <Text style={styles.subtitle}>
        Nous travaillons À vous construire une expérience d'exception
      </Text>
      <View style={styles.indicatorContainer}>
        {loading ? <ActivityIndicator color={"orange"} size={40} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: COLORS.WHITE,
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginTop: 14,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "outfit",
    marginTop: 14,
    textAlign: "center",
  },
  indicatorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default GenerateTrip;
