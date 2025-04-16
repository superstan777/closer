import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { CircleButton } from "@/components/CircleButton";

export const NewHabitScreen = () => {
  const database = useSQLiteContext();
  const [habitName, setHabitName] = useState("");
  const [purpose, setPurpose] = useState("");

  const createHabit = async () => {
    try {
      const createdAt = Date.now();
      await database
        .runAsync(
          `INSERT INTO habits (name, purpose, created_at) VALUES (?, ?, ?)`,
          [habitName, purpose, createdAt]
        )
        .then((result) => result.lastInsertRowId);

      router.back();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  return (
    <View className="flex-1 px-5 ">
      <View className="my-4">
        <Text className="font-bold text-xl mb-2 text-black dark:text-white">
          Purpose
        </Text>
        <TextInput
          className="bg-white dark:bg-black rounded-lg p-3 text-md text-black dark:text-white"
          placeholder="What do you want to achieve?"
          placeholderTextColor="#888"
          value={purpose}
          onChangeText={setPurpose}
        />
      </View>

      <View className="my-4">
        <Text className="font-bold text-xl mb-2 text-black dark:text-white">
          Habit Name
        </Text>
        <TextInput
          className="bg-white dark:bg-black rounded-lg p-3 text-md text-black dark:text-white"
          placeholder="What do you need to do to achieve your goal?"
          placeholderTextColor="#888"
          value={habitName}
          onChangeText={setHabitName}
        />
      </View>

      <View className="flex-row justify-center">
        <CircleButton onPress={createHabit} text="+" />
      </View>
    </View>
  );
};

export default NewHabitScreen;
