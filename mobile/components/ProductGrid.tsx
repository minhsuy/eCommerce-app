import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Product } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";

const ProductGrid = ({
  products,
  isLoading,
  isError,
}: {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}) => {
  const {
    addProductToWishlist,
    isLoadingAdd,
    wishlist,
    deleteProductFromWishlist,
  } = useWishlist();
  const { addToCartMutation, isLoadingAddToCart } = useCart();
  const handleWishlistProduct = async (productId: string) => {
    const checkProduct = wishlist?.find((item) => item._id === productId);
    if (checkProduct) {
      await deleteProductFromWishlist.mutateAsync({ productId });
    } else {
      await addProductToWishlist.mutateAsync({ productId });
    }
  };
  const handleAddToCart = async (productId: string) => {
    await addToCartMutation.mutateAsync({ productId });
    Alert.alert("Success", "Product added to cart");
  };
  const renderProduct = ({ item: product }: { item: Product }) => (
    <TouchableOpacity
      className="bg-surface rounded-3xl overflow-hidden mb-3"
      style={{ width: "48%" }}
      activeOpacity={0.8}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="absolute top-3 right-3 bg-black/30  p-2 rounded-full"
          activeOpacity={0.7}
          onPress={() => handleWishlistProduct(product._id)}
        >
          {isLoadingAdd ? (
            <ActivityIndicator size="small" color="#121212" />
          ) : (
            <Ionicons
              name={"heart"}
              size={18}
              color={
                wishlist && wishlist.find((item) => item._id === product._id)
                  ? "#FF0000"
                  : "#fff"
              }
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-text-secondary text-xs mb-1">
          {product.category}
        </Text>
        <Text
          className="text-text-primary font-bold text-sm mb-2"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="text-text-primary text-xs font-semibold ml-1">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="text-text-secondary text-xs ml-1">
            ({product.totalReviews})
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-full w-8 h-8 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id)}
            disabled={isLoadingAddToCart}
          >
            <Ionicons name="add" size={18} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  const NoProductFound = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-text-secondary text-lg font-semibold">
        No products found
      </Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      scrollEnabled={false}
      ListEmptyComponent={NoProductFound}
    />
  );
};

export default ProductGrid;
