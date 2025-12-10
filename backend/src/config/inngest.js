import { Inngest } from "inngest";
import { connectDB } from "./connectDB.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "e-commerce" });

const syncUser = inngest.createFunction(
  { id: "create-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const user = event.data;
    const { id, first_name, last_name, image_url } = user;
    const email = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    ).email_address;
    await connectDB();
    await User.create({
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}` || "User",
      email: email,
      image: image_url,
      addresses: [],
      wishlist: [],
    });
  }
);
const deleteUser = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const user = event.data;
    await connectDB();
    await User.findOneAndDelete({ clerkId: user.id });
  }
);
export const functions = [syncUser, deleteUser];
