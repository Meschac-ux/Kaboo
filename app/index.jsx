import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundImage from "@/assets/images/img-1.jpg";
import { useNavigation, useRouter } from "expo-router";
import * as Location from "expo-location";
import { useStateContext } from "@/context/StateContext";

const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { location, setLocation } = useStateContext();

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
  
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);  


  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  console.log(location);

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <LinearGradient colors={["transparent", "#0F0F0D"]} style={{ flex: 1 }}>
          <View
            style={{
              height: Dimensions.get("window").height - 80,
              paddingVertical: 40,
              paddingHorizontal: 24,
            }}
          >
            <View style={{ flexDirection: "row", marginTop: 40 }}>
              <Text style={styles.title}>K</Text>
              <Text style={[styles.title, { color: "#ff6000" }]}>aà</Text>
              <Text style={styles.title}>bo</Text>
            </View>
            <View>
              <Text
                style={{
                  color: "#F1F1F1",
                  fontFamily: "outfit-medium",
                  fontSize: 20,
                }}
              >
                Bienvenue chez nous
              </Text>
              <View style={{ height: "50%", marginTop: 20 }}>
                <Text
                  style={{
                    color: "#FFF",
                    fontFamily: "outfit-light",
                    fontSize: 24,
                  }}
                >
                  Explorez, visiter, planifier vos vaccances d'un simple geste.
                  Aller à la découverte de magnifiques endroits
                </Text>
              </View>
            </View>
            <View style={{ height: "40%", justifyContent: "flex-end" }}>
              <View style={{ marginVertical: 20 }}>
                <TouchableOpacity
                  onPress={() => router.replace("auth/sign-in")}
                  style={{
                    width: "100%",
                    backgroundColor: "#ff6000",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 36,
                    borderRadius: 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "outfit-medium",
                      color: "#FFF",
                    }}
                  >
                    Je Commence
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "outfit-bold",
    fontSize: 40,
    color: "#0C0C0C",
  },

  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#ff6000",
    fontFamily: "outfit",
  },
});
