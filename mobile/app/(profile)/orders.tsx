import { View, Text } from "react-native";
import React from "react";
import { usePathname } from "expo-router";
import { useRoute } from "@react-navigation/native";
import SafeScreen from "@/components/SafeScreen";

const OrderScreen = () => {
  return (
    <SafeScreen>
      <Text>OrderScreen</Text>
    </SafeScreen>
  );
};

export default OrderScreen;
