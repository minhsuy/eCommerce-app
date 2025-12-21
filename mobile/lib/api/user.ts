import { Product } from "@/types/type";
import { useApi } from "../axios";

export const useUserApi = () => {
  const api = useApi();
  return {
    addWishlist: async ({ productId }: { productId: string }) => {
      const { data } = await api.post("/users/wishlist", { productId });
      return data;
    },
    getWishlist: async () => {
      const { data } = await api.get<{ wishlist: Product[] }>(
        "/users/wishlist"
      );
      return data.wishlist;
    },
    deleteWishlist: async ({ productId }: { productId: string }) => {
      const { data } = await api.delete(`/users/wishlist/${productId}`);
      return data;
    },
    addToCart: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post("/carts", { productId, quantity });
      return data;
    },
  };
};
