import { View, StyleSheet, Text } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Calendar } from "@/components/Calendar";
import { Stack } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";

import { habitType } from "@/types/types";
import { backgroundColors } from "@/constants/Colors";

export const HabitDetailsScreen = () => {
  const habitId = Number(useLocalSearchParams().habitId);
  const database = useSQLiteContext();
  const [habitName, setHabitName] = useState("");
  const { colors } = useAppTheme();

  // const deleteHabit = async () => {
  //   try {
  //     await database.runAsync("DELETE FROM habits WHERE id = ?", [habitId]);

  //     router.back();
  //   } catch (error) {
  //     console.error("Error deleting habit:", error);
  //   }
  // };

  //MOVE IT TO CUSTOM HOOK

  // YOU'VE DONE IT 20 TIMES THIS MONTH
  // IT'S BEEN 5 MORE THAN LAST MONTH

  useEffect(() => {
    const getHabit = async () => {
      try {
        const result = await database.getFirstAsync<habitType>(
          "SELECT name FROM habits WHERE id = ?",
          [habitId]
        );

        if (result) setHabitName(result.name);
      } catch (error) {
        console.error("Error fetching habit:", error);
      }
    };

    getHabit();
  }, [habitId]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: habitName,
        }}
      />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: colors.header }]}>
            Your most productive day is
            <Text style={{ fontWeight: "bold" }}> Wednesday</Text>
          </Text>
          <Text style={[styles.text, { color: colors.header }]}>
            You've done it
            <Text style={{ fontWeight: "bold" }}> 21 </Text>
            times this month
          </Text>
          <Text style={[styles.text, { color: colors.header }]}>
            It's
            <Text style={{ fontWeight: "bold" }}> 10% </Text> of all times done
          </Text>
        </View>

        {/* <View style={styles.buttonContainer}>
        <Button onPress={deleteHabit}>Delete</Button>
      </View> */}

        <Calendar id={habitId} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  textContainer: {
    // flex: 1,
    justifyContent: "center",
    marginBottom: 16,
    // alignItems: "center",
  },
  text: {
    fontSize: 18,
    // fontWeight: "bold",
    marginVertical: 10,
  },
});

export default HabitDetailsScreen;
