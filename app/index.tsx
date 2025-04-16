import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { HabitItem } from "@/components/HabitItem";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useCallback, useMemo } from "react";
import { habitType } from "@/types/types";
import { ScrollView } from "react-native-gesture-handler";
import { CircleButton } from "@/components/CircleButton";

export default function Index() {
  const database = useSQLiteContext();
  const [habits, setHabits] = useState<habitType[]>([]);
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );
  const loadData = async () => {
    const result = await database.getAllAsync<habitType>(
      "SELECT * FROM habits"
    );
    setHabits(result);
  };
  const memoizedHabits = useMemo(() => habits, [habits]);

  return (
    <View
      style={{ flex: 1 }}
      // className="bg-lightmodegray dark:bg-darkmodegray"
    >
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {memoizedHabits.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.header}>No purpose yet</Text>
            <Text style={styles.emptyListComponent}>
              Set your goal to start getting closer
            </Text>
          </View>
        ) : (
          memoizedHabits.map((item) => (
            <HabitItem
              key={item.id.toString()}
              name={item.name}
              purpose={item.purpose}
              id={item.id}
            />
          ))
        )}

        <View className="flex-row justify-center">
          <CircleButton
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              router.push({ pathname: "/new-habit" });
            }}
            text="+"
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // This centers it horizontally
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  emptyListComponent: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 16,
  },
});
