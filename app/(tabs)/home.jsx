import {
  ActivityIndicator,
  Dimensions,
  Image,
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
import { COLORS } from "../../configs/style";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getNearbyPlace } from "../../api";
import { useStateContext } from "../../context/StateContext";
import axios from "axios";
import * as Location from "expo-location";

const Home = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const { location } = useStateContext();

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

  const fetchPlaceImage = async (photoReference) => {
    const options = {
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/place/photo",
      params: {
        photo_reference: photoReference,
        maxwidth: 300,
        key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      return response.request.res.responseUrl;
    } catch (error) {
      console.error("Error fetching place image:", error);
      return null;
    }
  };

  const getCurrentLocation = async () => {
    const { latitude, longitude } = location.coords;
    const address = await Location.reverseGeocodeAsync({ latitude, longitude });
    console.log(address);
    setCurrentLocation(address[0]);
  };

  const retrievePlacesData = async () => {
    try {
      let type;
      let keyword;

      switch (selectedItem) {
        case 0:
          type = "restaurant";
          break;
        case 1:
          type = "lodging";
          keyword = "hotel";
          break;
        case 2:
          keyword = "tourisme";
          break;
        case 3:
          keyword = "loisirs";
          break;
        default:
          throw new Error("Sélection non valide");
      }

      const places = await getNearbyPlace({
        location: `${location?.coords?.latitude},${location?.coords?.longitude}`,
        type,
        placeQuery: keyword,
      });

      return places.results.map((place) => ({
        ...place,
        imageUrl:
          place.photos && place.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=${place.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
            : null,
      }));
    } catch (error) {
      console.error("API: Error fetching places:", error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await retrievePlacesData();
      setData(data);
    } catch (error) {
      ToastAndroid.show(
        "Un problème est survenu lors de la collecte des informations.",
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedItem]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: COLORS.WHITE,
      }}
    >
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/male.jpg")}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <View>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                color={COLORS.PRIMARY}
                size={20}
                style={{ marginLeft: 10 }}
              />
              <Text style={styles.locationText}>
                {currentLocation?.subregion}
                <Text style={styles.locationText}>
                  {currentLocation?.formattedAddress}
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/create-trip/search-place")}
          >
            <Ionicons name="search" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>

        {/*         <View style={styles.searchContainer}>
          <TouchableWithoutFeedback
            onPress={() => router.push("create-trip/search-place")}
          >
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder="Trouver une destination"
                style={styles.searchInput}
                aria-disabled
              />
              <View style={styles.searchIcon}>
                <Ionicons name="search" color={COLORS.GRAY} size={20} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View> */}

        <View style={styles.utilsContainer}>
          {utils.map((item) => (
            <View key={item.id}>
              <Pressable
                style={[
                  styles.utilityButton,
                  {
                    backgroundColor:
                      selectedItem === item.id ? COLORS.PRIMARY : "transparent",
                  },
                ]}
                onPress={() => setSelectedItem(item.id)}
              >
                {item?.icon && item.icon}
              </Pressable>
              <Text style={styles.utilityText}>{item.name}</Text>
            </View>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
          ) : (
            <View>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <Pressable key={index} style={styles.cardContainer}>
                    <ImageBackground
                      resizeMode="cover"
                      source={
                        item?.imageUrl
                          ? { uri: item.imageUrl }
                          : require("../../assets/images/card.jpg")
                      }
                      style={styles.cardImage}
                    >
                      <View style={styles.cardContent}>
                        <Text style={styles.placeName}>{item?.name}</Text>
                        <View style={styles.vicinityContainer}>
                          <Ionicons
                            name="location"
                            color={COLORS.WHITE}
                            size={20}
                          />
                          <Text style={styles.vicinityText}>
                            {item?.vicinity}
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.noDataText}>
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerText: {
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
  locationTitle: {
    color: COLORS.GRAY,
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
  },
  locationContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  locationText: {
    fontFamily: "outfit",
    maxWidth: 200,
    paddingLeft: 10,
  },
  notificationButton: {
    borderRadius: 10,
  },
  searchContainer: {
    marginTop: 24,
  },
  searchInputContainer: {
    position: "relative",
  },
  searchInput: {
    borderColor: COLORS.GRAY,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    bottom: 12,
  },
  utilsContainer: {
    marginVertical: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  utilityButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },
  utilityText: {
    fontSize: 12,
    fontFamily: "outfit",
    color: COLORS.GRAY,
    marginTop: 5,
    textAlign: "center",
  },
  scrollView: {
    marginTop: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    marginBottom: 20, // Increased margin for better spacing
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: {
    height: 150,
    justifyContent: "flex-end",
  },
  cardContent: {
    padding: 10,
  },
  placeName: {
    fontSize: 18,
    fontFamily: "outfit-medium",
    color: COLORS.WHITE,
  },
  vicinityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  vicinityText: {
    fontFamily: "outfit",
    color: COLORS.WHITE,
    marginLeft: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: COLORS.GRAY,
  },
});
