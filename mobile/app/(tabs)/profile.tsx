import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React from "react";
import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MENU_ITEMS } from "@/const/const";
import { router } from "expo-router";
const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const handleSignOut = () =>
    Alert.alert(
      "Are you sure?",
      "Sign out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign out",
          onPress: () => signOut(),
          style: "default",
        },
      ],
      { cancelable: false }
    );
  const handlePressMenu = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return;
    return router.push(`/(profile)${action}`);
  };
  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MENU ITEMS */}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-surface rounded-2xl p-6 items-center justify-center"
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handlePressMenu(item.action)}
            >
              <View
                className="rounded-full w-16 h-16 items-center justify-center mb-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-text-primary font-bold text-base">
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTIFICATONS BTN */}
        <View className="mb-6 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* PRIVACY AND SECURTIY LINK */}
        <View className="mb-6 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/(profile)/privacy-security")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#FFFFFF"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Privacy & Security
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* SIGNOUT BTN */}
        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          activeOpacity={0.8}
          onPress={() => handleSignOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
