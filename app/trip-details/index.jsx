import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { COLORS } from "../../configs/style";
import moment from "moment";

const TripDetails = () => {
  const { top } = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params;

  const [tripDetails, setTripDetails] = useState({});
  const [openDays, setOpenDays] = useState([]);

  // Toggle for opening and closing day details
  const toggleDay = (index) => {
    setOpenDays((prevOpenDays) => 
      prevOpenDays.includes(index)
        ? prevOpenDays.filter((dayIndex) => dayIndex !== index)
        : [...prevOpenDays, index]
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    if (trip) {
      const parsedTripData = typeof trip === "string" ? JSON.parse(trip) : trip;
      setTripDetails(parsedTripData);
    }
  }, [trip]);

  const tripData = tripDetails?.tripData
    ? JSON.parse(tripDetails?.tripData)
    : {};
  const tripPlan = tripDetails?.tripPlan || {};

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      {/* Image principale */}
      {tripData?.locationInfo?.img ? (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=${tripData?.locationInfo?.img}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
          }}
          style={styles.mainImage}
        />
      ) : (
        <Image
          source={require("../../assets/images/card.jpg")}
          style={styles.mainImage}
        />
      )}

      <View style={styles.detailsHeader}>
        <Text style={styles.locationTitle}>
          {tripData.locationInfo?.name || "Destination inconnue"}
        </Text>
        <Text style={styles.dateRange}>
          {`${moment(tripData?.startDate).format("DD MMM YYYY")} - ${moment(
            tripData?.endDate
          ).format("DD MMM YYYY")}`}
        </Text>
      </View>

      {/* Section Itinéraire */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Itinéraire</Text>

        {tripPlan?.itinéraire?.map((jourData, index) => {
          const isOpen = openDays.includes(index);
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => toggleDay(index)}
                style={[styles.container, { borderWidth: isOpen ? 2 : 0 }]}
              >
                <View>
                  <Text style={styles.title}>Jour {jourData.jour}</Text>
                  <Text style={styles.description}>
                    Cliquez pour {isOpen ? "masquer" : "voir"} les détails
                  </Text>
                </View>
                <Text style={styles.icon}>{isOpen ? "-" : "+"}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.activitiesContainer}>
                  {jourData.activites.map((activity, i) => (
                    <View key={i} style={styles.activityItem}>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                      <Text style={styles.activityTime}>{activity.heure}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Section Lieux à Visiter */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Lieux à Visiter</Text>
        <FlatList
          data={tripPlan?.lieux_a_visiter}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.lieuCard}>
              <Image
                source={require("../../assets/images/card.jpg")}
                style={styles.lieuImage}
              />
              <Text style={styles.lieuName}>{item.nom}</Text>
              <Text style={[{ marginTop: 4, fontFamily: 'outfit-medium'}]}>{item.description}</Text>
              <Text style={styles.lieuPrice}>Entrée: {item.prix_entree}</Text>
            </View>
          )}
          keyExtractor={(item) => item.nom}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Section Hôtels */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Hôtels</Text>
          <View style={styles.hotelCard}>
            <Text style={styles.hotelName}>{tripPlan?.hebergement?.hotel?.nom}</Text>
            <Text style={styles.hotelPrice}>Prix: {tripPlan?.hebergement?.hotel?.prix}</Text>
            <Text style={styles.hotelStars}>{tripPlan?.hebergement?.hotel?.evaluation} étoiles</Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Réserver</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* Section Restaurants */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Restaurants Recommandés</Text>
        {tripPlan?.restauration?.restaurants?.map((restaurant, index) => (
          <View key={index} style={styles.restaurantCard}>
            <Text style={styles.restaurantName}>{restaurant.nom}</Text>
            <Text style={styles.restaurantDescription}>
              {restaurant.description}
            </Text>
          </View>
        ))}
      </View>

      {/* Section Conseils */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Conseils pour le Voyage</Text>
        <Text style={{ fontFamily: "outfit" }}>
          {tripPlan?.conseils?.durabilite}
        </Text>
      </View>
    </ScrollView>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  mainImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover", // Correction pour le mode de redimensionnement
  },
  detailsHeader: {
    padding: 12,
    marginTop: -20,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  locationTitle: {
    fontFamily: "outfit-medium",
    fontSize: 28,
    color: COLORS.PRIMARY,
  },
  dateRange: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  sectionContainer: {
    padding: 12,
  },
  sectionTitle: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    marginBottom: 10,
    color: COLORS.PRIMARY,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#feffdfab",
    marginTop: 14,
    borderRadius: 14,
    borderColor: "#f7aa00",
    borderWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontFamily: "outfit-medium",
    color: "#0C0C0C",
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  icon: {
    fontSize: 20,
    fontFamily: "outfit",
  },
  activitiesContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    marginTop: 10,
  },
  activityItem: {
    marginBottom: 10,
  },
  activityDescription: {
    fontFamily: "outfit-medium",
    color: COLORS.BLACK,
  },
  activityTime: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  lieuCard: {
    width: 180,
    marginRight: 10,
  },
  lieuImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  lieuName: {
    fontFamily: "outfit-bold",
    color: COLORS.PRIMARY,
  },
  lieuPrice: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  hotelCard: {
    marginBottom: 20,
  },
  hotelName: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: COLORS.PRIMARY,
  },
  hotelPrice: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  hotelStars: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  bookButtonText: {
    color: COLORS.WHITE,
    textAlign: "center",
  },
  restaurantCard: {
    marginBottom: 20,
  },
  restaurantName: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: COLORS.PRIMARY,
  },
  restaurantDescription: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
});
