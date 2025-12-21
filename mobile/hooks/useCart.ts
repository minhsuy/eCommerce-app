import { useUserApi } from "@/lib/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useCart = () => {
  const queryClient = useQueryClient();
  const { addToCart } = useUserApi();
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { addToCartMutation, isLoadingAddToCart: addToCartMutation.isPending };
};

export default useCart;
