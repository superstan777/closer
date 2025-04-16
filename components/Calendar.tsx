import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo, useState, useCallback } from "react";
import { useStore } from "@/utility/store";
import { eventType } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

import { convertUTCToLocal, monthNames } from "@/utility/dateFunctions";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  id: number;
}

export const Calendar: React.FC<Props> = ({ id }) => {
  const { currentDate } = useStore();
  const { colors } = useAppTheme();
  const [events, setEvents] = useState<eventType[]>([]);
  const memoizedEvents = useMemo(() => events, [events]);

  const database = useSQLiteContext();

  const localCurrentDate = useMemo(
    () => convertUTCToLocal(currentDate),
    [currentDate]
  );

  const newDate = new Date(1744379699293);
  console.log(newDate);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const loadEvents = async () => {
    const year = localCurrentDate.getFullYear();
    const month = localCurrentDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(year, month + 1, 0); // 0 gets last day of previous month
    endOfMonth.setHours(23, 59, 59, 999);

    const startOfMonthTimestamp = startOfMonth.getTime();
    const endOfMonthTimestamp = endOfMonth.getTime();

    const result = await database.getAllAsync<eventType>(
      "SELECT * FROM events WHERE habit_id = ? AND done_at BETWEEN ? AND ?",
      [id, startOfMonthTimestamp, endOfMonthTimestamp]
    );

    setEvents(result);
  };

  console.log(events);

  const currentMonthDays = useMemo(() => {
    const start = new Date(
      localCurrentDate.getFullYear(),
      localCurrentDate.getMonth(),
      1
    );
    const end = new Date(
      localCurrentDate.getFullYear(),
      localCurrentDate.getMonth() + 1,
      0
    );
    const days: (Date | null)[] = [];

    const dayOfWeek = start.getDay(); // 0 = Sun, 1 = Mon...
    const prevDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    for (let i = 0; i < prevDays; i++) {
      days.push(null); // Empty placeholders
    }

    for (let i = 1; i <= end.getDate(); i++) {
      days.push(
        new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth(), i)
      );
    }
    console.log(days);
    return days;
  }, [localCurrentDate]);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.habitCard, { backgroundColor: colors.card }]}>
        <View style={styles.habitHeader}>
          <Text style={[styles.habitTitle, { color: colors.header }]}>
            {monthNames[localCurrentDate.getMonth()]}
          </Text>
        </View>

        <View style={styles.calendarGrid}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, idx) => (
            <Text key={idx} style={[styles.dayLabel, { color: colors.text }]}>
              {d}
            </Text>
          ))}
          {currentMonthDays.map((date, idx) => {
            let bgColor = "transparent";
            let textColor = colors.header;

            const isToday =
              date &&
              date.getDate() === localCurrentDate.getDate() &&
              date.getMonth() === localCurrentDate.getMonth() &&
              date.getFullYear() === localCurrentDate.getFullYear();

            if (date) {
              const eventForDay = memoizedEvents.find((event) => {
                const eventDate = new Date(event.done_at);
                return (
                  eventDate.getFullYear() === date.getFullYear() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getDate() === date.getDate()
                );
              });

              if (eventForDay) {
                bgColor = colors.event;
                textColor = colors.eventText;
              }
            }

            return (
              <View key={idx} style={styles.dayBox}>
                {date ? (
                  <View
                    style={[
                      styles.dayCircle,
                      {
                        backgroundColor: bgColor,
                        borderWidth: isToday ? 4 : 0,
                        borderColor: isToday ? colors.event : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: textColor,
                        fontWeight: "bold",
                      }}
                    >
                      {date.getDate()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.dayCircle} />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    padding: 16,
    borderRadius: 10,
  },
  habitHeader: {
    marginBottom: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  habitText: { fontSize: 12 },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
  dayBox: {
    width: "14.28%",
    alignItems: "center",
    marginBottom: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
