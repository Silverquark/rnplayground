import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import Stopwatch from "./Stopwatch";

export default function StopwatchScreen() {
  const [startTime, setStartTime] = useState<Date>(new Date());
  // const [play, setPlay] = useState(false);
  // const [reset, setReset] = useState(0);

  return (
    <View className="flex-1 items-center pt-8">
      <Stopwatch startTime={startTime} />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
