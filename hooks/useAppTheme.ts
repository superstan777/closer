import { useColorScheme } from "react-native";

export const useAppTheme = () => {
  const colorScheme = useColorScheme(); // "light" | "dark" | null
  const isDark = colorScheme === "dark";

  return {
    theme: isDark ? "dark" : "light",
    colors: {
      background: isDark ? "#171717" : "#f6f6f6",

      header: isDark ? "#ffffff" : "#000000",
      text: isDark ? "#9ca3af" : "#6b7280",
      card: isDark ? "#000" : "#fff",
      border: isDark ? "#fff" : "#000",
      event: isDark ? "#fff" : "#000",
      eventText: isDark ? "#000" : "#fff",
      button: isDark ? "#fff" : "#000",
      buttonText: isDark ? "#000" : "#fff",
      // Add more if needed
    },
  };
};
