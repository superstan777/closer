import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { router } from "expo-router";
import { eventType, habitType } from "@/types/types";
import { convertUTCToLocal } from "@/utility/dateFunctions";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useStore } from "@/utility/store";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  name: string;
  purpose: string;
  id: number;
}

export const HabitItem: React.FC<Props> = ({ name, purpose, id }) => {
  const { currentDate, currentWeek } = useStore();
  const { colors } = useAppTheme();

  const [isReadyToComplete, setIsReadyToComplete] = useState(true);
  const [events, setEvents] = useState<eventType[]>([]);
  const [doneTimes, setDoneTimes] = useState<number>(0);
  const database = useSQLiteContext();
  const position = useSharedValue(0);

  const localCurrentDate = useMemo(
    () => convertUTCToLocal(currentDate),
    [currentDate]
  );
  const localCurrentWeek = useMemo(
    () => currentWeek.map(convertUTCToLocal),
    [currentWeek]
  );

  useFocusEffect(
    useCallback(() => {
      loadEvents();
      getDoneTimes();
    }, [])
  );

  useEffect(() => {
    if (events.length > 0) {
      checkIfCompleted();
    }
  }, [events]);

  // Check if habit has been completed today
  const checkIfCompleted = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayString = today.toISOString().split("T")[0];

    const eventForToday = events.find((event) => {
      const eventDate = new Date(event.done_at);
      eventDate.setUTCHours(0, 0, 0, 0);
      const eventString = eventDate.toISOString().split("T")[0];
      return eventString === todayString;
    });

    setIsReadyToComplete(!eventForToday); // Only allow swipe if not done today
  };

  const getDoneTimes = async () => {
    const result = await database.getFirstAsync<habitType>(
      "SELECT done_times FROM habits WHERE id = ?",
      [id]
    );
    setDoneTimes(result?.done_times || 0);
  };

  const loadEvents = async () => {
    const startOfWeek = new Date(localCurrentWeek[0]);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(localCurrentWeek[6]);
    endOfWeek.setHours(23, 59, 59, 999);

    const result = await database.getAllAsync<eventType>(
      "SELECT * FROM events WHERE habit_id = ? AND done_at BETWEEN ? AND ?",
      [id, startOfWeek.getTime(), endOfWeek.getTime()]
    );

    setEvents(result);
  };

  const updateDoneTimes = async () => {
    await database.runAsync("UPDATE habits SET done_times = ? WHERE id = ?", [
      doneTimes + 1,
      id,
    ]);
  };

  const addEvent = async () => {
    await database.runAsync(
      "INSERT OR IGNORE INTO events (habit_id, done_at) VALUES (?, ?)",
      [id, Date.now()]
    );
  };

  const memoizedEvents = useMemo(() => events, [events]);

  const renderDoneTimes = useMemo(() => {
    if (doneTimes === 0) return "Not done yet";
    return doneTimes === 1
      ? `Done ${doneTimes} time`
      : `Done ${doneTimes} times`;
  }, [memoizedEvents]);

  const renderDays = (index: number) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[index] || "";
  };

  const resetPosition = () => {
    position.value = -SCREEN_WIDTH;
    position.value = withTiming(0, { duration: 300 });
  };

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .enabled(isReadyToComplete)
    .onUpdate((e) => (position.value = e.translationX))
    .onEnd(() => {
      if (position.value > SCREEN_WIDTH / 2) {
        position.value = withTiming(SCREEN_WIDTH, { duration: 300 }, () => {
          runOnJS(resetPosition)();
        });
        runOnJS(addEvent)();
        runOnJS(updateDoneTimes)();
        runOnJS(loadEvents)();
        runOnJS(getDoneTimes)();
      } else {
        position.value = withTiming(0, { duration: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.habitCard,
          animatedStyle,
          { backgroundColor: colors.card },
        ]}
      >
        <Pressable
          onPress={() =>
            router.push({ pathname: "/[habitId]", params: { habitId: id } })
          }
        >
          <View style={styles.habitHeader}>
            <View style={styles.headerSection}>
              <Text style={[styles.habitTitle, { color: colors.header }]}>
                {name}
              </Text>
              <Text style={[styles.habitText, { color: colors.text }]}>
                {renderDoneTimes}
              </Text>
            </View>
            <Text style={[styles.habitText, { color: colors.text }]}>
              {purpose}
            </Text>
          </View>

          <View style={styles.daysRow}>
            {localCurrentWeek.map((date, index) => {
              const dateString = currentWeek[index];
              const eventForDay = memoizedEvents.find((event) => {
                const eventDate = new Date(event.done_at);
                eventDate.setUTCHours(0, 0, 0, 0);
                return eventDate.toISOString().split("T")[0] === dateString;
              });

              const isToday = date.getDate() === localCurrentDate.getDate();
              const bgColor = eventForDay ? colors.event : "transparent";
              const textColor = eventForDay ? colors.eventText : colors.header;
              const border = isToday
                ? { borderWidth: 4, borderColor: colors.event }
                : {};

              return (
                <View key={index} style={styles.daysContainer}>
                  <Text style={[styles.habitText, { color: colors.text }]}>
                    {renderDays(index)}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      { backgroundColor: bgColor, ...border },
                    ]}
                  >
                    <Text style={[styles.dayText, { color: textColor }]}>
                      {date.getDate()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    margin: 16,
  },
  habitHeader: {
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  habitTitle: { fontSize: 18, fontWeight: "bold" },
  habitText: { fontSize: 12 },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: { fontSize: 14, fontWeight: "bold" },
  daysContainer: {
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
  },
});
