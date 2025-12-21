import { useUserApi } from "@/lib/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useWishlist = () => {
  const queryClient = useQueryClient();
  const { addWishlist, getWishlist, deleteWishlist } = useUserApi();
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });
  const addProductToWishlist = useMutation({
    mutationFn: addWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  const deleteProductFromWishlist = useMutation({
    mutationFn: deleteWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  return {
    addProductToWishlist,
    isLoadingAdd: addProductToWishlist.isPending,
    wishlist,
    deleteProductFromWishlist,
    isLoading,
    isError,
  };
};

export default useWishlist;
