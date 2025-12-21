import axiosInstance from "../axios";

export const userApi = {
  getUserInfo: async () => {
    const { data } = await axiosInstance.get("/users/me");
    return data;
  },
};
