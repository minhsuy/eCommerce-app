import { Product } from "@/types/type";
import { useApi } from "../axios";

export const useProductApi = () => {
  const api = useApi();
  return {
    getAll: async () => {
      const { data } = await api.get<Product[]>("/products");
      return data;
    },
  };
};
