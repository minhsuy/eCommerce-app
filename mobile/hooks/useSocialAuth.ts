import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();
  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Error signing in", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSocialAuth };
};

export default useSocialAuth;
