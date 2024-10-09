import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../configs/style";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, store } from "../../configs/firebase";
import Lottie from "lottie-react-native";
import loadingAnimation from "../../assets/loading.json";
import TripsList from "../../components/Trips/tripsList";

const Trips = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const user = auth.currentUser;
  
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserTrips = async () => {
    if (!user) return;

    const fetchTrips = query(
      collection(store, "userTrips"),
      where("userEmail", "==", user.email)
    );
    const querySnapshot = await getDocs(fetchTrips);

    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);
    setLoading(false); 
  };

  useEffect(() => {
    if (user) {
      getUserTrips();
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 10,
        backgroundColor: COLORS.WHITE,
        height: "100%",
      }}
    >
      <StatusBar translucent animated backgroundColor="orange" />

      {/* Affichage du chargement pendant le fetch */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("screen").height - 250,
          }}
        >
          <Lottie
            source={loadingAnimation}
            autoPlay
            loop
            style={{
              width: 250,
              height: 250,
            }}
          />
          <Text style={{ fontFamily: "outfit-medium", color: "orange" }}>
            Un instant nous nous occupons de tout...
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              Mes Destinations
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/create-trip/search-place")}
              style={{
                backgroundColor: COLORS.PRIMARY,
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Ionicons name="add" size={20} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>

          {userTrips.length === 0 ? (
            <View
              style={{
                padding: 20,
                alignItems: "center",
                display: "flex",
                height: Dimensions.get("screen").height - 250,
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Ionicons name="locate-sharp" size={50} color={COLORS.PRIMARY} />
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: 24,
                  marginTop: 24,
                  textAlign: "center",
                }}
              >
                Aucune sortie de prévue pour l'instant !
              </Text>
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 20,
                  textAlign: "center",
                  color: COLORS.GRAY,
                }}
              >
                Lancez-vous dans une toute nouvelle aventure dès maintenant et
                vivez une expérience hors du commun.
              </Text>

              <Pressable
                style={{
                  backgroundColor: COLORS.PRIMARY,
                  padding: 14,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => router.push("/create-trip/search-place")}
              >
                <Text
                  style={{
                    fontFamily: "outfit-medium",
                    fontSize: 16,
                    textAlign: "center",
                    color: COLORS.WHITE,
                  }}
                >
                  Trouver une destination
                </Text>
              </Pressable>
            </View>
          ) : (
            <TripsList userTrips={userTrips} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Trips;

const styles = StyleSheet.create({});
