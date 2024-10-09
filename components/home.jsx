import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../configs/style";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getPlace, getPlaceV2 } from "../api";

const Home = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("Cotonou");

  const utils = [
    {
      id: 0,
      name: "Restaurant",
      icon: (
        <Ionicons
          name="fast-food-outline"
          size={20}
          color={selectedItem === 0 ? COLORS.WHITE : COLORS.GRAY}
        />
      ),
    },
    {
      id: 1,
      name: "Résidence",
      icon: (
        <Fontisto
          name="hotel"
          size={20}
          color={selectedItem === 1 ? COLORS.WHITE : COLORS.GRAY}
        />
      ),
    },
    {
      id: 2,
      name: "Tourisme",
      icon: (
        <Ionicons
          name="bus-outline"
          size={20}
          color={selectedItem === 2 ? COLORS.WHITE : COLORS.GRAY}
        />
      ),
    },
    {
      id: 3,
      name: "Attraction",
      icon: (
        <Ionicons
          name="game-controller-outline"
          size={20}
          color={selectedItem === 3 ? COLORS.WHITE : COLORS.GRAY}
        />
      ),
    },
  ];

  const retrievePlacesData = async () => {
    try {
      let places;
      switch (selectedItem) {
        case 0:
          places = await getPlaceV2(`restaurant à ${state}`);
          break;
        case 1:
          places = await getPlaceV2(`hotel à ${state}`);
          break;
        case 2:
          places = await getPlace(`tourisme à ${state}`);
          break;
        case 3:
          places = await getPlace(`loisirs et attractions à ${state}`);
          break;
        default:
          throw new Error("Sélection non valide");
      }
      return places;
    } catch (error) {
      console.error("API: Error fetching places:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = await retrievePlacesData();

      setData(data.results);
    } catch (error) {
      ToastAndroid.show(
        "Un problème est subvenu lors de la collecte des informations.",
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedItem]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: COLORS.WHITE,
        height: "100%",
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}></Text>
          {/* Location */}
          <View>
            <Text
              style={{
                color: COLORS.GRAY,
                fontFamily: "outfit",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Ma Position
            </Text>
            <View
              style={{
                marginTop: 4,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Ionicons name="location" color={COLORS.PRIMARY} size={20} />
              <Text
                style={{
                  fontFamily: "outfit",
                  maxWidth: "80%",
                  textAlign: "center",
                }}
              >
                Bénin, AKPAKAP Centre Carrefour SOBEBBRA
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              padding: 6,
              borderRadius: 10,
            }}
          >
            <Ionicons name="notifications" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <TouchableWithoutFeedback
            onPress={() => router.push("create-trip/search-place")}
          >
            <View style={{ position: "relative" }}>
              <TextInput
                onFocus={() => router.push("create-trip/search-place")}
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
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{
            marginVertical: 14,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {utils.map((item) => (
            <View key={item.id}>
              <Pressable
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  borderRadius: 100, // corrected to numeric value
                  backgroundColor:
                    selectedItem === item.id ? COLORS.PRIMARY : "transparent",
                }}
                onPress={() => setSelectedItem(item.id)}
              >
                {item?.icon && item.icon}
              </Pressable>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "outfit",
                  color: COLORS.GRAY,
                  marginTop: 6,
                }}
              >
                {item.name}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView style={{ flex: 1 }}>
          {loading ? (
            <View
              style={{
                height: 400,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          ) : (
            <View>
              {/* Display fetched data */}
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <Pressable key={index} style={{ borderRadius: 24 }}>
                    <ImageBackground
                      resizeMode="cover"
                      source={{  }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <View style={{ bottom: 0}}>
                        <Text>{item?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Ionicons name="location" color={COLORS.WHITE} size={20} />
                          <Text>{item?.formatted_address}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </Pressable>
                ))
              ) : (
                <Text style={{ fontSize: 16, fontFamily: "outfit" }}>
                  Sélectionnez un élément pour afficher les données.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
