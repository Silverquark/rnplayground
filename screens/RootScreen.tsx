import { FlatList, TouchableOpacity, View, Text } from "react-native";

import { RootStackParamList, RootStackScreenProps } from "../types";
import Material from "@expo/vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "react-native";

type ScreenType = {
  screen: keyof RootStackParamList;
  title: string;
};

export default function RootScreen({
  navigation,
}: RootStackScreenProps<"Root">) {
  const colorScheme = useColorScheme();
  const screens: ScreenType[] = [
    {
      screen: "Stopwatch",
      title: "Stopwatch",
    },
    {
      screen: "PokemonCard",
      title: "Pokemon",
    },
    {
      screen: "PokemonCardSensor",
      title: "Pokemon Sensor",
    },
  ];

  return (
    <View className="flex-1 items-center justify-center ">
      <FlatList
        className="flex-1 w-full bg-white dark:bg-black"
        data={screens}
        ItemSeparatorComponent={() => (
          <View className="h-[0.5] bg-gray-400 w-full" />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 items-center bg-white dark:bg-black flex-row justify-between w-full"
            key={item.title}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text className="text-xl text-black dark:text-white">
              {item.title}
            </Text>
            <Material
              color={colorScheme === "dark" ? "white" : "black"}
              name="chevron-right"
              size={32}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
