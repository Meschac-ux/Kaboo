import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../configs/style"; // Assurez-vous que COLORS contient la clé GRAY

const OptionsCard = ({ option, selected }) => {
  console.log("les options", option);
  console.log(option?.id)

  return (
    <View
      style={[
        styles.container,
        { 
          borderWidth: selected?.id === option?.id ? 2 : 0, 
        }
      ]}
    >
      <View>
        <Text style={styles.title}>{option?.title}</Text>
        <Text style={styles.description}>{option?.describe}</Text>
      </View>
      <Text style={styles.icon}>{option?.icon}</Text>
    </View>
  );
};

export default OptionsCard;

const styles = StyleSheet.create({
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
});
