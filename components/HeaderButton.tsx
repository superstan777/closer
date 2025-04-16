// migrate into one button component

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export const HeaderButton: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <Pressable onPress={onPress} style={styles.Button}>
      <Text style={styles.Text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "transparent",
    height: 44,
    padding: 0,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 0,
    fontWeight: "700",
  },
});
