import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useInterval } from "./useInterval";

export default function Stopwatch({ startTime }: { startTime: Date }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stops, setStops] = useState<Date[]>([]);
  const [starts, setStarts] = useState<Date[]>([startTime]);

  const [smooth, setSmooth] = useState(false);

  const elapsedSeconds = Math.trunc(elapsedTime / 1000);

  const pauseTimer = () => {
    setStops([...stops, new Date()]);
  };

  const resumeTimer = () => {
    setStarts([...starts, new Date()]);
  };

  useInterval(() => {
    let elapsed = 0;
    for (let i = 0; i < starts.length; i++) {
      if (!stops[i]) {
        elapsed += new Date().getTime() - starts[i].getTime();
      } else {
        elapsed += stops[i].getTime() - starts[i].getTime();
      }
    }

    setElapsedTime(elapsed);
  }, 10);

  const animRotation = useDerivedValue(() => {
    const a = smooth ? elapsedTime / 1000 : elapsedSeconds;
    const deg = a * 6 - 90;

    return withTiming(deg, { duration: 100 });
  }, [elapsedTime]);

  const animStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${animRotation.value}deg`,
        },
        {
          translateX: 138,
        },
      ],
    };
  }, [animRotation.value]);

  const paused = stops.length >= starts.length;
  return (
    <>
      <View className="w-full items-center justify-center aspect-square">
        {Array(60)
          .fill("")
          .map((_, i) => {
            const add = i % 5 === 0 ? 8 : 0;

            return (
              <View
                key={i}
                style={{
                  height: 2,
                  width: 8 + add,
                  position: "absolute",
                  backgroundColor: "#000000",
                  transform: [
                    {
                      rotateZ: `${i * 6}deg`,
                    },
                    {
                      translateX: 136 - add / 2,
                    },
                  ],
                }}
              />
            );
          })}
        <Animated.View
          style={[
            animStyles,
            {
              width: 8,
              height: 8,
              borderRadius: 100,
              backgroundColor: "#ff0000",
            },
          ]}
        />

        <Text className="absolute text-2xl">
          {convertSecondsToMinutesAndSeconds(elapsedSeconds)}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          paused ? resumeTimer() : pauseTimer();
        }}
      >
        {({ pressed }) => (
          <View
            className={`border rounded bottom-4 p-4 
		  ${pressed ? "bg-gray-300" : "bg-transparent"}
		`}
          >
            <Text>{paused ? "Resume" : "Pause"}</Text>
          </View>
        )}
      </Pressable>

      <Pressable onPress={() => setSmooth(!smooth)}>
        {({ pressed }) => (
          <View
            className={`border rounded bottom-4 p-4 mt-4
		  ${pressed ? "bg-gray-300" : "bg-transparent"}
		`}
          >
            <Text>{smooth ? "not smooth" : "Smooth"}</Text>
          </View>
        )}
      </Pressable>
    </>
  );
}

function convertSecondsToMinutesAndSeconds(seconds: number): string {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return (
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0")
  );
}
