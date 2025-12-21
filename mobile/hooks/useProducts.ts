import { useProductApi } from "@/lib/api/product";
import { useQuery } from "@tanstack/react-query";
const useProducts = () => {
  const { getAll } = useProductApi();
  const result = useQuery({
    queryKey: ["products"],
    queryFn: getAll,
  });

  return result;
};

export default useProducts;
