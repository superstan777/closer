// import React from "react";
// import { TouchableOpacity, Text } from "react-native";
// import clsx from "clsx";

// interface CircleButtonProps {
//   onPress: () => void;
//   text: string;
//   size?: number; // optional, default = 64
//   className?: string; // extra tailwind classes if needed
// }

// export const CircleButton: React.FC<CircleButtonProps> = ({
//   onPress,
//   text,
//   size = 64,
//   className,
// }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{ width: size, height: size }}
//       className={clsx(
//         "m-4 rounded-full items-center justify-center bg-black dark:bg-white",
//         className
//       )}
//     >
//       <Text className="text-white dark:text-black font-bold text-2xl">
//         {text}
//       </Text>
//     </TouchableOpacity>
//   );
// };

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface CircleButtonProps {
  onPress: () => void;
  text: string;
  size?: number; // You can pass size as a prop, default to 64
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  text,
  size = 64,
}) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: colors.button,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors.buttonText }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 16,
    borderRadius: 9999, // Fully rounded button
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
  },
});
