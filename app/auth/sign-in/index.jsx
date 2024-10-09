import React from "react";
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
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundImage from "@/assets/images/img-2.jpg";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { auth } from "../../../configs/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const Signin = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [error, setError] = React.useState({ status: false, message: "" });

  const navigation = useNavigation();
  const router = useRouter();

  const login = async () => {
    if (email.length > 0 && password.length > 0) {

      console.log(email);
      console.log(password);

      setSubmitting(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if(user) {
            router.replace('/trips');
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          console.log(errorCode);
          if (errorCode && errorCode == "auth/invalid-credential") {
            ToastAndroid.show(
              "Email ou mot de passe incorrect",
              ToastAndroid.BOTTOM
            );
          }
        });
    } else {
      setError({
        status: true,
        message: "Tous les champs doivent etre remplie",
      });

      ToastAndroid.show(
        "Veuillez enter toutes les informations de connexion",
        ToastAndroid.BOTTOM
      );
    }
    setSubmitting(false);
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <LinearGradient
          colors={["transparent", "#0C0C0C80"]}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ height: "100%" }}>
            <View
              style={{
                height: Dimensions.get("window").height - 80,
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <Text style={styles.title}>Je me Connecte </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "35%",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 40,
                    backgroundColor: "orange",
                    height: 8,
                    borderRadius: 14,
                    marginHorizontal: 4,
                  }}
                />
                <View
                  style={{
                    width: 8,
                    backgroundColor: "orange",
                    height: 8,
                    borderRadius: 14,
                    marginHorizontal: 4,
                  }}
                />
                <View
                  style={{
                    width: 6,
                    backgroundColor: "orange",
                    height: 6,
                    borderRadius: 14,
                    marginHorizontal: 4,
                  }}
                />
              </View>
              <View style={{ width: "100%", marginVertical: 8 }}>
                <Text
                  style={{ fontSize: 16, fontFamily: "outfit", color: "#FFF" }}
                >
                  Adresse Email
                </Text>

                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  autoFocus
                  placeholder="Entrez votre email"
                  style={styles.input}
                />
              </View>
              <View style={{ width: "100%", marginVertical: 4 }}>
                <Text
                  style={{ fontSize: 16, fontFamily: "outfit", color: "#FFF" }}
                >
                  Mot de Passe
                </Text>
                <View>
                  <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    autoFocus
                    textContentType="password"
                    secureTextEntry={isPasswordVisible}
                    placeholder="Entrez votre mot de passe"
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => setIsPasswordVisible((prev) => !prev)}
                    style={{ position: "absolute", right: 10, bottom: "35%" }}
                  >
                    {isPasswordVisible ? (
                      <FontAwesome5 name="eye" size={14} color={"gray"} />
                    ) : (
                      <FontAwesome5 name="eye-slash" size={14} color={"gray"} />
                    )}
                  </Pressable>
                </View>
              </View>
              <View style={{ marginVertical: 20 }}>
                <TouchableOpacity
                  onPress={login}
                  style={{
                    backgroundColor: "orange",
                    paddingVertical: 14,
                    paddingHorizontal: 24,
                    borderRadius: 14,
                  }}
                >
                  {submitting ? (
                    <ActivityIndicator color={"#FFF"} size={20} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "outfit-medium",
                        color: "#FFF",
                      }}
                    >
                      Se Connecter
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 2,
                    backgroundColor: "#C1C1C1",
                    borderRadius: 20,
                    marginHorizontal: 12,
                  }}
                />
                <Text style={{ fontFamily: "outfit", color: "#C1C1C1" }}>
                  ou
                </Text>
                <View
                  style={{
                    width: 80,
                    height: 2,
                    backgroundColor: "#C1C1C1",
                    borderRadius: 20,
                    marginHorizontal: 12,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontFamily: "outfit", color: "#F1F1F1" }}>
                  Pas encore inscrit ?
                </Text>
                <Pressable onPress={() => router.replace("auth/sign-up")}>
                  <Text style={{ fontFamily: "outfit", color: "orange" }}>
                    {" "}
                    Je veux m'inscrire{" "}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: "#002244",
  },

  input: {
    backgroundColor: "#F1F3F3AB",
    borderRadius: 14,
    height: 50,
    padding: 14,
    marginTop: 4,
    width: "100%",
  },

  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "orange",
    fontFamily: "outfit",
  },

  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
    fontFamily: "outfit",
  },
});
