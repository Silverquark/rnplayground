import React, { useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const signs = ["+", "-", "x", "/"];

export function MathScreen() {
  const [currentMath, setCurrentMath] = useState(0);
  const [solutions, setSolutions] = useState<number[]>([]);
  const [currentSolution, setCurrentSolution] = useState("");
  const { bottom } = useSafeAreaInsets();

  const ref = useRef<FlatList>(null);

  const addSolution = (solution: number) => {
    setSolutions([...solutions, solution]);
  };

  const maths = useMemo(() => {
    let bla = [];
    for (let i = 0; i < 20; i++) {
      let randomNumber1 = getRandomInt(1, 9);
      let sign = getRandomInt(1, 3);

      let randomNumber2 = getRandomInt(1, 9);
      bla.push({
        number1: randomNumber1.toString(),
        thing: signs[sign - 1],
        number2: randomNumber2.toString(),
      });
    }
    return bla;
  }, []);

  const calculate = (number1: string, sign: string, number2: string) => {
    switch (sign) {
      case "+":
        return Number(number1) + Number(number2);
      case "-":
        return Number(number1) - Number(number2);
      case "x":
        return Number(number1) * Number(number2);
      case "/":
        return Number(number1) / Number(number2);
      default:
        throw Error(`invalid case ${sign}`);
    }
  };

  const onPress = (digit: number) => {
    const newSolution = `${currentSolution}${digit}`;

    const realSolution = calculate(
      maths[currentMath].number1,
      maths[currentMath].thing,
      maths[currentMath].number2
    );

    if (newSolution === realSolution.toString() || newSolution.length > 1) {
      setCurrentSolution("");

      addSolution(Number(newSolution));
      setCurrentMath(currentMath + 1);
      ref.current?.scrollToIndex({
        index: currentMath,
        animated: true,
      });
    } else {
      setCurrentSolution(`${currentSolution}${digit}`);
    }
  };

  const onClear = () => {
    setCurrentSolution("");
  };

  const onMinus = () => {
    if (currentSolution.length < 1) {
      setCurrentSolution("-");
    } else {
      if (currentSolution[0] === "-") {
        setCurrentSolution(currentSolution.substring(1));
      } else {
        setCurrentSolution("-" + currentSolution);
      }
    }
  };
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      {/* <BackgroundGradient width={WIDTH} height={HEIGHT} /> */}
      <View className="flex-1 w-full">
        <FlatList
          ref={ref}
          data={maths}
          ListHeaderComponent={() => <View className="h-24" />}
          renderItem={({ index, item }) => {
            const item2 = item as {
              number1: string;
              thing: string;
              number2: string;
            };
            const realSolution = calculate(
              item2.number1,
              item2.thing,
              item2.number2
            );
            let sol: number | null = null;
            if (solutions.length > index) {
              sol = solutions[index];
            }
            return (
              <View className="w-full flex-row p-4">
                <Text
                  className={`text-6xl ${
                    index === currentMath ? "border-2 border-red-500" : ""
                  }`}
                >
                  {`${item2.number1}${item2.thing}${item2.number2}${
                    index < currentMath + 1 ? "=" : ""
                  }`}
                </Text>
                {sol && (
                  <Text
                    className={`text-6xl ${
                      sol == realSolution ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {sol}
                  </Text>
                )}
                {index === currentMath && (
                  <Text className={`text-6xl`}>{currentSolution}</Text>
                )}
              </View>
            );
          }}
        />
      </View>
      <View className="h-1 bg-black w-full" />
      <View className=" w-full">
        <View className="flex-row">
          <Digit digit={1} onPress={onPress} />
          <Digit digit={2} onPress={onPress} />
          <Digit digit={3} onPress={onPress} />
        </View>
        <View className="flex-row">
          <Digit digit={4} onPress={onPress} />
          <Digit digit={5} onPress={onPress} />
          <Digit digit={6} onPress={onPress} />
        </View>
        <View className="flex-row">
          <Digit digit={7} onPress={onPress} />
          <Digit digit={8} onPress={onPress} />
          <Digit digit={9} onPress={onPress} />
        </View>
        <View className="flex-row">
          <Clear onPress={onClear} />

          <Minus onPress={onMinus} />
          <Digit digit={0} onPress={onPress} />
        </View>
      </View>
      <View
        style={{
          marginBottom: bottom,
        }}
      />
    </View>
  );
}

const Thing = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <Pressable className="flex-1 aspect-square m-2" onPress={onPress}>
      {({ pressed }) => (
        <View
          className={`flex-1 items-center justify-center border-2
          ${pressed ? "bg-gray-300" : "bg-white"}
          `}
        >
          <Text className={` text-xl `}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

const Digit = ({
  digit,
  onPress,
}: {
  digit: number;
  onPress: (solution: number) => void;
}) => {
  return <Thing text={digit.toString()} onPress={() => onPress(digit)} />;
};

const Minus = ({ onPress }: { onPress: () => void }) => {
  return <Thing text="-" onPress={onPress} />;
};

const Clear = ({ onPress }: { onPress: () => void }) => {
  return <Thing text="<" onPress={onPress} />;
};
