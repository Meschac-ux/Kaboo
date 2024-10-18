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
import { COLORS } from "../../configs/style"; // Assurez-vous que ce chemin est correct
import moment from "moment";

const TripDetails = () => {
  const { top } = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params;

  const [tripDetails, setTripDetails] = useState({});
  const [openDays, setOpenDays] = useState([]);
  const [openActivities, setOpenActivities] = useState([]);
  const [openItineraryPlan, setOpenItineraryPlan] = useState([]);

  // Toggle for opening and closing day details
  const toggleDay = (index) => {
    setOpenDays((prevOpenDays) =>
      prevOpenDays.includes(index)
        ? prevOpenDays.filter((dayIndex) => dayIndex !== index)
        : [...prevOpenDays, index]
    );
  };

  // Toggle for opening and closing activity details
  const toggleActivity = (index) => {
    setOpenActivities((prevOpenActivities) =>
      prevOpenActivities.includes(index)
        ? prevOpenActivities.filter((activityIndex) => activityIndex !== index)
        : [...prevOpenActivities, index]
    );
  };

  // Toggle for opening and closing itinerary plan
  const toggleItineraryPlan = (index) => {
    setOpenItineraryPlan((prevOpenItineraryPlan) =>
      prevOpenItineraryPlan.includes(index)
        ? prevOpenItineraryPlan.filter(
            (itineraryIndex) => itineraryIndex !== index
          )
        : [...prevOpenItineraryPlan, index]
    );
  };

  // Group itinerary plan by day
  const groupItineraryByDay = (itineraryPlan) => {
    return itineraryPlan.reduce((acc, plan) => {
      const day = plan.jour;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(plan);
      return acc;
    }, {});
  };

  // Group activities by day
  const groupActivitiesByDay = (activities) => {
    return activities.reduce((acc, activity) => {
      const day = activity.jour;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(activity);
      return acc;
    }, {});
  };

  const parseIfNeeded = (data) => {
    if (typeof data === "object" && data !== null) {
      return data;
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return {}; // Return empty object if parsing fails
      }
    }

    return {};
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
    ? JSON.parse(tripDetails.tripData)
    : {};

  const tripPlan = parseIfNeeded(tripDetails?.tripPlan);
  const itinerary = tripPlan?.itinéraire || null;
  const itineraryPlan = tripPlan?.plan_d_itineraire || tripPlan?.activites;
  const placesToVisit = tripPlan?.lieux_a_visiter || [];
  const accommodation = tripPlan?.hebergement?.hotel || null;
  const restaurants = tripPlan?.restauration?.restaurants || [];
  const travelTips = tripPlan?.conseils || {};

  console.log(tripPlan);
  // Vérifiez si `activities` existe avant de grouper
  const activities = tripDetails?.tripPlan?.activites || [];
  const groupedActivities = groupActivitiesByDay(activities);
  const groupedItineraryPlan = groupItineraryByDay(itineraryPlan || []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      {/* Image principale */}
      {tripData?.locationInfo?.img ? (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=${tripData.locationInfo.img}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
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
      {itinerary ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Itinéraire</Text>
          {itinerary.map((jourData, index) => {
            const isOpen = openDays.includes(index);
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => toggleDay(index)}
                  style={[styles.container, { borderWidth: isOpen ? 2 : 0 }]}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.title}>Jour {jourData.jour}</Text>
                      <Text style={styles.icon}>{isOpen ? "-" : "+"}</Text>
                    </View>
                    <Text style={styles.description}>
                      Cliquez pour {isOpen ? "masquer" : "voir"} les détails
                    </Text>
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.activitiesContainer}>
                    {jourData.activites.map((activity, i) => (
                      <View key={i} style={styles.activityItem}>
                        <Text style={styles.activityDescription}>
                          {activity.description}
                        </Text>
                        <Text style={styles.activityTime}>
                          {activity.heure}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Section Activités */}
      {Object.keys(groupedActivities).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Activités</Text>
          {Object.keys(groupedActivities).map((key, index) => {
            const isOpen = openActivities.includes(index);
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => toggleActivity(index)}
                  style={[styles.container, { borderWidth: isOpen ? 2 : 0 }]}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.title}>Jour {key}</Text>
                      <Text style={styles.icon}>{isOpen ? "-" : "+"}</Text>
                    </View>
                    <Text style={styles.description}>
                      Cliquez pour {isOpen ? "masquer" : "voir"} les détails
                    </Text>
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.activitiesContainer}>
                    {groupedActivities[key].map((activityDetail, i) => (
                      <View key={i} style={styles.activityItem}>
                        <Text style={styles.activityDescription}>
                          {activityDetail?.description}
                        </Text>
                        <Text style={styles.activityTime}>
                          {activityDetail.heure}
                        </Text>
                        <Text style={styles.activityDescription}>
                          {activityDetail?.activite}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Section Plan d'Itinéraire */}
      {Object.keys(groupedItineraryPlan).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plan d'Itinéraire</Text>
          {Object.keys(groupedItineraryPlan).map((key, index) => {
            const isOpen = openItineraryPlan.includes(index);
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => toggleItineraryPlan(index)}
                  style={[styles.container, { borderWidth: isOpen ? 2 : 0 }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.title}>Jour {key}</Text>
                    <Text style={styles.icon}>{isOpen ? "-" : "+"}</Text>
                  </View>
                  <Text style={styles.description}>
                    Cliquez pour {isOpen ? "masquer" : "voir"} les détails
                  </Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.activitiesContainer}>
                    {groupedItineraryPlan[key].map((planItem, i) => (
                      <View key={i} style={styles.activityItem}>
                        <Text style={styles.activityTime}>
                          {planItem.heure}
                        </Text>
                        {planItem?.description && (
                          <Text style={styles.activityDescription}>
                            {planItem.description}
                          </Text>
                        )}

                        {planItem?.activite && (
                          <Text style={styles.activityDescription}>
                            {planItem.activite}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Section Lieux à Visiter */}
      {placesToVisit.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Lieux à Visiter</Text>
          <FlatList
            data={placesToVisit}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.lieuCard}>
                <Image
                  source={require("../../assets/images/card.jpg")}
                  style={styles.lieuImage}
                />
                <Text style={styles.lieuName}>{item.nom}</Text>
                <Text style={styles.lieuDescription}>{item.description}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* Section Hébergement */}
      {accommodation && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hébergement</Text>
          <View style={styles.hotelCard}>
            <Text style={styles.hotelName}>{accommodation.nom}</Text>
            <Text style={styles.hotelPrice}>{accommodation.prix}</Text>
            <Text style={styles.hotelStars}>
              {accommodation.evaluation} Étoiles
            </Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Réserver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Section Restaurants */}
      {restaurants.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Restaurants</Text>
          {restaurants.map((restaurant, index) => (
            <View key={index} style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>{restaurant.nom}</Text>
              <Text style={styles.restaurantDescription}>
                {restaurant.description}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Section Conseils de Voyage */}
      {travelTips && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Conseils de Voyage</Text>
          <Text style={styles.tip}>{travelTips?.durabilite}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    height: 200,
    width: "100%",
  },
  detailsHeader: {
    padding: 15,
  },
  locationTitle: {
    fontFamily: "outfit-bold",
    fontSize: 24,
  },
  dateRange: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  sectionContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginBottom: 10,
    color: "#ff6000",
  },
  container: {
    backgroundColor: COLORS.LIGHT,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    color: "#ff6000",
  },
  description: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  icon: {
    fontSize: 20,
  },
  activitiesContainer: {
    paddingLeft: 15,
  },
  activityItem: {
    marginBottom: 5,
  },
  activityDescription: {
    fontFamily: "outfit",
  },
  activityTime: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  lieuCard: {
    marginRight: 20,
    width: 180,
  },
  lieuImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  lieuName: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: "#ff6000",
  },
  lieuDescription: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  hotelCard: {
    padding: 10,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 10,
    marginTop: 10,
  },
  hotelName: {
    fontFamily: "outfit-medium",
    fontSize: 18,
  },
  hotelPrice: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  hotelStars: {
    fontFamily: "outfit",
    marginTop: 4,
    color: COLORS.GRAY,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontFamily: "outfit-medium",
  },
  restaurantCard: {
    padding: 10,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 10,
    marginTop: 10,
  },
  restaurantName: {
    fontFamily: "outfit-medium",
    fontSize: 16,
  },
  restaurantDescription: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
    marginTop: 4,
  },
  tip: {
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
});

export default TripDetails;
