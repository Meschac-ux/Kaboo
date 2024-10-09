import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";

import { useStateContext } from "../../context/StateContext";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../configs/style";
import moment from "moment";
import { TouchableOpacity } from "react-native";

const ReviewTripPack = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { travelData, setTravelData } = useStateContext();

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTransparent: true,
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top * 3,
        paddingHorizontal: 24,
        backgroundColor: COLORS.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "outfit-bold",
          marginTop: 14,
          color: "orange",
        }}
      >
        Faisons un point de votre Pack
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "outfit-medium",
          }}
        >
          Vérifiez que tout ce que vous avez choisi ici vous convient
          parfaitement avant de continuer
        </Text>

        {/* Destination info */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
            gap: 24,
          }}
        >
          <Ionicons name="location-sharp" size={24} color={"orange"} />
          <View style={{}}>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: COLORS.GRAY }}
            >
              Destination
            </Text>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
              {travelData?.locationInfo?.name}
            </Text>
          </View>
        </View>

        {/* Calendar Info */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
            gap: 24,
          }}
        >
          <Ionicons name="calendar-number" size={24} color={"orange"} />
          <View style={{}}>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: COLORS.GRAY }}
            >
              Periode prévue
            </Text>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
              {moment(travelData?.startDate).format("DD MMM") +
                " - " +
                moment(travelData?.endDate).format("DD MMM") +
                " ( " +
                travelData?.totalNumberOfDays +
                "jrs )"}
            </Text>
          </View>
        </View>

        {/* Traveler Info */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
            gap: 24,
          }}
        >
          <Ionicons name="airplane" size={24} color={"orange"} />
          <View style={{}}>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: COLORS.GRAY }}
            >
              Voyage pour
            </Text>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
              {travelData?.traveler}
            </Text>
          </View>
        </View>

        {/* Traveler Info */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
            gap: 24,
          }}
        >
          <Ionicons name="wallet" size={24} color={"orange"} />
          <View style={{}}>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: COLORS.GRAY }}
            >
              Budget choisi
            </Text>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
              {travelData?.budget}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 14,
          marginTop: 14,
          borderRadius: 14,
        }}
        onPress={() => router.replace("/create-trip/generate-trip")}
      >
        <Text
          style={{
            color: COLORS.WHITE,
            fontFamily: "outfit-medium",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Generer un Carnet de Route
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewTripPack;

const styles = StyleSheet.create({});
