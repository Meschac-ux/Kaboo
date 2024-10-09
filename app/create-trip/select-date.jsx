import React, { useEffect, useState } from "react";
import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarPicker from "react-native-calendar-picker";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment";

import { COLORS } from "../../configs/style";
import { useStateContext } from "../../context/StateContext";

const SelectDates = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { travelData, setTravelData } = useStateContext();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const router = useRouter();

  const onDateChange = (date, type) => {
    console.log(date, type);

    if (type === "END_DATE") {
      setEndDate(moment(date));
    } else {
      setStartDate(moment(date));
    }
  };

  const onDateSelection = () => {
    if (!startDate && !endDate) {
      ToastAndroid.show(
        "SVP, Choisissez une date de début et de fin",
        ToastAndroid.BOTTOM
      );
    }
    const totalNumberOfDays = endDate.diff(startDate, "days");
    console.log(totalNumberOfDays);

    setTravelData({
      ...travelData,
      startDate: startDate,
      endDate: endDate,
      totalNumberOfDays: totalNumberOfDays + 1,
    });

    router.push('/create-trip/select-budget');
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

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
        Votre sortie est prévue pour
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "outfit-medium",
            color: COLORS.GRAY,
          }}
        >
          Choisissez une periode
        </Text>
        <View style={{ marginTop: 20 }}>
          <CalendarPicker
            onDateChange={onDateChange}
            minDate={new Date()}
            allowRangeSelection={true}
            maxRangeDuration={7}
            selectedRangeStyle={{
              backgroundColor: COLORS.PRIMARY,
            }}
            selectedDayTextStyle={{
              color: COLORS.WHITE,
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "orange",
            padding: 14,
            marginTop: 14,
            borderRadius: 14,
          }}
          onPress={onDateSelection}
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
    </View>
  );
};

export default SelectDates;

const styles = StyleSheet.create({});
