export const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];
export const Base_URL = "https://e-commerce-app-lovat-one.vercel.app/api";

export const MENU_ITEMS = [
  {
    id: 1,
    icon: "person-outline",
    title: "Edit Profile",
    color: "#3B82F6",
    action: "/profile",
  },
  {
    id: 2,
    icon: "list-outline",
    title: "Orders",
    color: "#10B981",
    action: "/orders",
  },
  {
    id: 3,
    icon: "location-outline",
    title: "Addresses",
    color: "#F59E0B",
    action: "/addresses",
  },
  {
    id: 4,
    icon: "heart-outline",
    title: "Wishlist",
    color: "#EF4444",
    action: "/wishlist",
  },
] as const;
