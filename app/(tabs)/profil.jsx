import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getDocs,
  query,
  collection,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import moment from "moment";
import { auth, store } from "../../configs/firebase";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/loading.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { COLORS } from "../../configs/style";
import { useRouter } from "expo-router";

const Profile = ({ onLogout }) => {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const userEmail = auth.currentUser.email;

  const fetchUserData = async () => {
    try {
      const userRef = doc(store, "users", userEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.log("Aucun utilisateur trouvé !");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getUserTrips = async () => {
    if (!auth.currentUser) return;

    const fetchTrips = query(
      collection(store, "userTrips"),
      where("userEmail", "==", userEmail),
      limit(5)
    );
    const querySnapshot = await getDocs(fetchTrips);

    const trips = [];
    querySnapshot.forEach((doc) => {
      trips.push(doc.data());
    });
    setUserTrips(trips);
    setLoading(false);
  };

  const formatTrip = (tripData) => {
    try {
      return JSON.parse(tripData);
    } catch (error) {
      console.error("Erreur de formatage du voyage :", error);
      return {};
    }
  };

  const updateUserData = async (firstName, lastName, email, contact) => {
    const userRef = doc(collection(store, "users"), email);

    try {
      setUpdating(true); // Show loading animation while updating
      await setDoc(
        userRef,
        {
          firstName,
          lastName,
          email,
          contact,
        },
        { merge: true }
      );
      setFirstName("");
      setLastName("");
      setContact("");

      fetchUserData();
      ToastAndroid.show(
        "Information mise à jour avec succès",
        ToastAndroid.LONG
      );
    } catch (error) {
      console.error("Error updating user data:", error);
      ToastAndroid.show("Erreur lors de la mise à jour", ToastAndroid.LONG);
    } finally {
      setUpdating(false); // Hide loading animation after update
      setModalVisible(false); // Close modal after update
    }
  };

  const handleUpdateProfile = () => {
    if (user) {
      updateUserData(firstName, lastName, user.email, contact);
    } else {
      Alert.alert("No user data found.");
    }
  };
  const authLogout = async () => {
    try {
      await signOut(auth);
      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      await AsyncStorage.clear();

      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    getUserTrips();
  }, [userEmail]);

  const UserTripCard = ({ item }) => {
    const trip = formatTrip(item?.tripData);
    return (
      <View
        style={{
          marginTop: 10,
          marginRight: 20,
        }}
      >
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
          <View style={{ marginTop: 10 }}>
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
                  width: 200,
                  height: 200,
                  borderRadius: 14,
                }}
              />
            ) : (
              <Image
                source={require("../../assets/images/card.jpg")}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 14,
                }}
              />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: 16,
                  maxWidth: 200,
                }}
              >
                {trip?.locationInfo?.name || "Destination inconnue"}
              </Text>
              <Text style={{ fontFamily: "outfit", color: "#888" }}>
                {`${moment(trip?.startDate).format("DD MMM yyyy")} - ${moment(
                  trip?.endDate
                ).format("DD MMM yyyy")}`}
              </Text>
              <Text style={{ fontFamily: "outfit" }}>
                🧳 {trip?.traveler || "Voyageur inconnu"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, backgroundColor: "#FFF" }}>
        {/* Avatar et Nom de l'utilisateur */}
        <View style={{ alignItems: "center", marginBottom: 20, marginTop: 40 }}>
          <Ionicons name="person-circle-outline" size={200} color="#888" />
          <Text
            style={{
              fontSize: 24,
              fontFamily: "outfit-medium",
              color: COLORS.PRIMARY,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
        </View>

        {/* Dernières destinations */}
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit-medium",
            marginBottom: 10,
            color: "#ff6000",
          }}
        >
          Dernières Destinations
        </Text>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              source={loadingAnimation}
              autoPlay
              loop
              style={{
                width: 150,
                height: 150,
              }}
            />
          </View>
        ) : (
          <View>
            <FlatList
              data={userTrips}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={UserTripCard}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {/* Informations personnelles */}
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "outfit-medium",
                marginBottom: 10,
                color: "#ff6000",
              }}
            >
              Informations Personnelles
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="pencil-sharp" size={20} color={"#ff6000"} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontFamily: "outfit-medium" }}>
              Nom :{" "}
              <Text style={{ fontFamily: "outfit", color: COLORS.GRAY }}>
                {user?.lastName}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, fontFamily: "outfit-medium" }}>
              Prénom :{" "}
              <Text style={{ fontFamily: "outfit", color: COLORS.GRAY }}>
                {user?.firstName}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, fontFamily: "outfit-medium" }}>
              Contacts :{" "}
              <Text style={{ fontFamily: "outfit", color: COLORS.GRAY }}>
                {user?.contact}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, fontFamily: "outfit-medium" }}>
              Email :{" "}
              <Text style={{ fontFamily: "outfit", color: COLORS.GRAY }}>
                {user?.email}
              </Text>
            </Text>
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          onPress={onLogout}
          style={{
            backgroundColor: COLORS.PRIMARY,
            marginTop: 20,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <Text
            style={{ color: COLORS.WHITE, fontSize: 16, textAlign: "center" }}
          >
            Déconnexion
          </Text>
        </TouchableOpacity>

        {/* Modal pour modifier le profil */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {updating ? (
              <View style={styles.loadingContainer}>
                <LottieView
                  source={loadingAnimation}
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
                <Text style={styles.loadingText}>Mise à jour en cours...</Text>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Mettre à jour le profil</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nom de famille"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact"
                  value={contact}
                  onChangeText={setContact}
                />
                <Pressable
                  style={styles.updateButton}
                  onPress={handleUpdateProfile}
                >
                  <Text style={styles.updateButtonText}>Mettre à jour</Text>
                </Pressable>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: COLORS.PRIMARY,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: "outfit",
    color: COLORS.GRAY,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  actionButtonText: {
    fontFamily: "outfit-medium",
    color: COLORS.WHITE,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "outfit-medium",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: COLORS.GRAY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: COLORS.WHITE,
    fontFamily: "outfit-medium",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.GRAY,
    fontFamily: "outfit",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: "100%",
  },
  loadingText: {
    fontFamily: "outfit-medium",
    marginTop: 10,
    color: COLORS.PRIMARY,
  },
  additionalInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 10,
  },
  additionalInfoText: {
    fontFamily: "outfit",
    color: COLORS.DARK_GRAY,
  },
});
