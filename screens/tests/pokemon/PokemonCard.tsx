import {
  Canvas,
  RoundedRect,
  RadialGradient,
  useSharedValueEffect,
  useValue,
  vec,
  useImage,
  Image,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const WIDTH = SCREEN_WIDTH * 0.9;
const HEIGHT = WIDTH * 1.4;

const CARD_HEIGHT = HEIGHT - 5;
const CARD_WIDTH = WIDTH - 5;

const MAXANGLE = 10;

export function PokemonCardScreen() {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const x = useValue(vec(0, 0));

  useSharedValueEffect(
    () => {
      x.current = vec(
        WIDTH / 2 + (WIDTH / 2) * (rotateY.value / MAXANGLE),
        HEIGHT / 2 + (HEIGHT / 2) * (rotateX.value / MAXANGLE)
      );
    },
    rotateX,
    rotateY
  ); // you can pass other shared values as extra parameters

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      rotateX.value = withTiming(
        interpolate(
          event.y,
          [0, CARD_HEIGHT],
          [MAXANGLE, -MAXANGLE],
          Extrapolate.CLAMP
        )
      );
      rotateY.value = withTiming(
        interpolate(
          event.x,
          [0, CARD_WIDTH],
          [-MAXANGLE, MAXANGLE],
          Extrapolate.CLAMP
        )
      );
    })
    .onUpdate((event) => {
      rotateX.value = interpolate(
        event.y,
        [0, CARD_HEIGHT],
        [MAXANGLE, -MAXANGLE],
        Extrapolate.CLAMP
      );
      rotateY.value = interpolate(
        event.x,
        [0, CARD_WIDTH],
        [-MAXANGLE, MAXANGLE],
        Extrapolate.CLAMP
      );
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
    });

  const rStyle = useAnimatedStyle(() => {
    const rotateXvalue = `${rotateX.value}deg`;
    const rotateYvalue = `${rotateY.value}deg`;
    return {
      transform: [
        {
          perspective: 300,
        },
        { rotateX: rotateXvalue },
        { rotateY: rotateYvalue },
      ],
    };
  }, []);

  const image = useImage("https://images.pokemontcg.io/sm10/33_hires.png");
  if (image === null) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      {/* <BackgroundGradient width={WIDTH} height={HEIGHT} /> */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              height: CARD_HEIGHT,
              width: CARD_WIDTH,
              backgroundColor: "black",
              position: "absolute",
              borderRadius: 20,
              zIndex: 300,
            },
            rStyle,
          ]}
        >
          <Canvas
            style={{
              width: WIDTH,
              height: HEIGHT,
            }}
          >
            <Image image={image} height={HEIGHT} width={WIDTH} fit="fill" />
            <RoundedRect
              x={0}
              y={0}
              width={WIDTH}
              height={HEIGHT}
              color={"white"}
              r={20}
              blendMode={"overlay"}
            >
              <RadialGradient
                c={x}
                positions={[0.1, 0.2, 1]}
                colors={[
                  "rgba(255,255,255,.8)",
                  "rgba(255,255,255,.65) ",
                  "rgba(0,0,0,.5)",
                ]}
                r={(WIDTH / 2) * 2}
              />
            </RoundedRect>
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
