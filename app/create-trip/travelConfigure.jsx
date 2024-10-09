import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { COLORS } from "../../configs/style";
import { travelList } from "../../constants/opions";
import OptionsCard from "../../components/OptionsCard";
import { TouchableOpacity } from "react-native";
import { useStateContext } from "../../context/StateContext";

const TripConfiguration = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectSelection, setSelectSelction] = useState(null);
  const { travelData, setTravelData } = useStateContext();

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Configurer le voyage",
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    setTravelData({ ...travelData, traveler: selectSelection?.title });
  }, [selectSelection]);

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
        Ce Voyage est pour ...
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "outfit-medium",
            color: COLORS.GRAY,
          }}
        >
          Specifiez qui voyage
        </Text>

        <FlatList
          data={travelList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectSelction(item)}
            >
              <OptionsCard option={item} selected={selectSelection} />
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
        onPress={() => router.push("/create-trip/select-date")}
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

export default TripConfiguration;

const styles = StyleSheet.create({});
