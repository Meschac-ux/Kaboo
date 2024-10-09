import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";

import { useStateContext } from "../../context/StateContext";
import { budgetTypes } from "../../constants/opions";
import OptionsCard from "../../components/OptionsCard";
import { COLORS } from "../../configs/style";

const SelectBudget = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [budgetType, setBudgetType] = useState();
  const { travelData, setTravelData } = useStateContext();

  const router = useRouter();

  const onContinue = () => {
    if (!budgetType) {
      ToastAndroid.show("Veuillez selectionner un budget", ToastAndroid.LONG);

      return null;
    }

    router.push("/create-trip/review-trip-pack");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    budgetType &&
      setTravelData({
        ...travelData,
        budget: budgetType?.title,
      });
  }, [budgetType]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top * 3,
        paddingHorizontal: 24,
        backgroundColor: COLORS.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontFamily: "outfit-medium",
          marginTop: 14,
          color: "orange",
        }}
      >
        Quel est mon Budget
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "outfit-medium",
            color: COLORS.GRAY,
          }}
        >
          Choisissez le budget qui vous convient
        </Text>

        <FlatList
          data={budgetTypes}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => setBudgetType(item)}>
              <OptionsCard option={item} selected={budgetType} />
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 14,
          marginTop: 14,
          borderRadius: 14,
        }}
        onPress={onContinue}
      >
        <Text
          style={{
            color: COLORS.WHITE,
            fontFamily: "outfit-medium",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Continuer
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectBudget;

const styles = StyleSheet.create({});
