import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../configs/style";
import { useNavigation, useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useStateContext } from "../../context/StateContext";

const SearchPlace = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const { travelData, setTravelData } = useStateContext();

  console.log(travelData);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Trouver une destination",
      headerTransparent: true,
    });
  });

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
      <GooglePlacesAutocomplete
        placeholder="Rechercher une destination"
        fetchDetails={true}
        onPress={(data, details) => {
          console.log(details)
          setTravelData({
            locationInfo: {
              name: details?.formatted_address,
              coordinates: details?.geometry?.location,
              img: details?.photos[0]?.photo_reference,
              url: details?.url,
            },
          });

          router.push("/create-trip/travelConfigure");
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "fr",
        }}
        styles={{
          textInputContainer: {
            borderWidth: 1,
            borderColor: "#d1d1d1",
            borderRadius: 4,
            marginTop: 14,
          },
        }}
      />

      {/*       <View style={{ position: "relative", marginTop: 20 }}>
        <TextInput
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholder="Trouver une destination"
          style={{
            borderColor: COLORS.GRAY,
            padding: 8,
            borderRadius: 8,
            borderWidth: 1,
          }}
        />
        <View style={{ position: "absolute", right: 10, bottom: 12 }}>
          <Ionicons name="search" color={COLORS.GRAY} size={20} />
        </View>
      </View> */}
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({});
