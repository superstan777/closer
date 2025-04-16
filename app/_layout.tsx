import "../global.css";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus, View } from "react-native";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStore } from "@/utility/store";
import { DB_NAME, createDbIfNeeded } from "@/utility/db";

import { useAppTheme } from "@/hooks/useAppTheme";

export default function RootLayout() {
  const { colors } = useAppTheme();
  // Closer
  // All it takes is doing

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const { setCurrentDate } = useStore();

  let midnightTimeout: NodeJS.Timeout | null = null; // Store the timeout reference

  // Function to calculate time until midnight and set a timeout
  const scheduleMidnightUpdate = () => {
    if (midnightTimeout) clearTimeout(midnightTimeout); // Clear any existing timeout

    const now = new Date();

    // Calculate next local midnight
    const nextMidnight = new Date(now);
    nextMidnight.setDate(now.getDate() + 1); // Move to next day
    nextMidnight.setHours(0, 0, 0, 0); // Reset time to midnight

    const timeUntilMidnight = nextMidnight.getTime() - now.getTime(); // Time left until next midnight
    console.log(timeUntilMidnight);

    midnightTimeout = setTimeout(() => {
      setCurrentDate(); // Update UI for new date
      scheduleMidnightUpdate(); // Reschedule for the next midnight
    }, timeUntilMidnight);
  };

  useEffect(() => {
    scheduleMidnightUpdate(); // Schedule the midnight update
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setCurrentDate(); // Update current date when app becomes active

        scheduleMidnightUpdate(); // Reset the midnight update
      }

      if (nextAppState !== "active" && midnightTimeout) {
        clearTimeout(midnightTimeout); // Clear timeout to avoid memory leaks
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      if (midnightTimeout) clearTimeout(midnightTimeout); // Cleanup on unmount
    };
  }, [appState, setCurrentDate]);

  return (
    <GestureHandlerRootView>
      <SQLiteProvider databaseName={DB_NAME} onInit={createDbIfNeeded}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: colors.background, // let the View background show through
            },
            headerTintColor: colors.header, // change this to match your theme

            headerStyle: {
              backgroundColor: colors.background, // let the View background show through
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Closer",
              headerTransparent: true,
              headerLargeTitle: true,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="new-habit"
            options={{
              presentation: "modal",
              headerTitle: "Add purpose",
            }}
          />
          <Stack.Screen
            name="[habitId]"
            options={{
              presentation: "modal",
              headerTitle: "Edit habit",
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
        </Stack>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
