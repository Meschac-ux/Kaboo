import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import moment from "moment";
import { COLORS } from "../../configs/style";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TripsList = ({ userTrips }) => {
  const router = useRouter();

  if (!userTrips || userTrips.length === 0) {
    return <Text>Aucun voyage trouvé.</Text>;
  }

  const formatTrip = (tripData) => {
    try {
      return JSON.parse(tripData);
    } catch (error) {
      console.error("Erreur de formatage du voyage :", error);
      return {};
    }
  };

  const firstTrip = formatTrip(userTrips[0]?.tripData);

  const UserTripCard = ({ item }) => {
    const trip = formatTrip(item?.tripData);
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
        >
          {trip?.locationInfo?.img ? (
            <Image
              source={{
                uri:
                  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=" +
                  trip?.locationInfo?.img +
                  "&key=" +
                  process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
              }}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 14,
              }}
            />
          ) : (
            <Image
              source={require("../../assets/images/card.jpg")}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 14,
              }}
            />
          )}
          <View style={{ marginLeft: 10, gap: 4 }}>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 16, maxWidth: 200 }}>
              {trip?.locationInfo?.name || "Destination inconnue"}
            </Text>
            <Text style={{ fontFamily: "outfit", color: COLORS.GRAY }}>
              {`${moment(trip?.startDate).format("DD MMM yyyy")} - ${moment(
                trip?.endDate
              ).format("DD MMM yyyy")}`}
            </Text>
            <Text style={{ fontFamily: "outfit" }}>
              🧳 {trip?.traveler || "Voyageur inconnu"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: {
                trip: JSON.stringify(item),
              },
            })
          }
        >
          <Ionicons name="chevron-forward" size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginVertical: 4, padding: 14 }}>
      {firstTrip?.locationInfo?.img ? (
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=" +
              firstTrip?.locationInfo?.img +
              "&key=" +
              process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          }}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            borderRadius: 14,
          }}
        />
      ) : (
        <Image
          source={require("../../assets/images/card.jpg")}
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: 14,
          }}
        />
      )}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontFamily: "outfit-medium", fontSize: 20, maxWidth: 200 }}>
              {firstTrip?.locationInfo?.name || "Destination inconnue"}
            </Text>
            <Text
              style={{ fontFamily: "outfit", fontSize: 14, marginTop: 4 }}
            >{`${moment(firstTrip?.startDate).format("DD MMM yyyy")}`}</Text>

            <Text
              style={{ fontFamily: "outfit", color: COLORS.GRAY, marginTop: 8 }}
            >
              🧳 {firstTrip?.traveler || "Voyageur inconnu"}
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.PRIMARY,
                paddingVertical: 8,
                paddingHorizontal: 10,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() =>
                router.push({
                  pathname: "/trip-details",
                  params: {
                    trip: JSON.stringify(userTrips[0]),
                  },
                })
              }
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "outfit-medium",
                  fontSize: 14,
                }}
              >
                Decouvrir
              </Text>
            </TouchableOpacity>
            <Text style={{ color: COLORS.GRAY, fontFamily: "outfit-light" }}>
              {moment(userTrips[0]?.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>

      {/* Affichage des autres voyages */}
      {userTrips.map((trip, index) => (
        <UserTripCard item={trip} key={index} />
      ))}
    </View>
  );
};

export default TripsList;

const styles = StyleSheet.create({});
