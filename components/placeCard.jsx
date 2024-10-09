import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../configs/style";

const PlaceCard = ({ name, adress, image }) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.imageContainer}>
        <ImageBackground
          resizeMode="cover"
          style={styles.image}
          source={{ uri: image }}
        >
          <View>
            <Text>{name}</Text>
            <View>
              <Ionicons name="location" size={20} color={"black"} />
              <Text>{adress}</Text>
            </View>
          </View>
          <View style={styles.btnOverlay}>
            <View
              style={{
                backgroundColor: "orange",
                padding: 4,
                borderRadius: 24,
              }}
            >
              <Feather name="arrow-up-right" size={20} color={COLORS.WHITE} />
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#d1d1d1",
    padding: 0,
    elevation: 10,
  },

  imageContainer: {
    overflow: "hidden",
    position: "relative",
    width: '100%',
    height: 240,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  btnOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
