import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "@/const/const";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/type";

const ShopScreen = () => {
  const { data: products, isLoading, isError } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filterP = products as Product[];
    if (selectedCategory !== "All") {
      filterP = filterP?.filter((product) =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    } else {
      filterP =
        filterP &&
        filterP?.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return filterP;
  }, [products, selectedCategory, searchQuery]);
  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Browse all products
              </Text>
            </View>

            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>
          <View className="bg-surface flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = category.name === selectedCategory;
              return (
                <TouchableOpacity
                  key={category.name}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center cursor-pointer ${isSelected ? "bg-primary" : "bg-surface/50"}`}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  {category.icon ? (
                    <Ionicons name={category.icon} size={36} />
                  ) : (
                    <Image
                      source={category.image}
                      className="size-12"
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">
              Products
            </Text>
            <Text className="text-text-secondary text-sm font-bold">
              {filteredProducts?.length} items
            </Text>
          </View>

          {/* PRODUCTS GRID */}
          {filteredProducts && (
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              isError={isError}
            />
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
