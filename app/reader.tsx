import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { useStore } from "../src/store/useStore";
import { normalizeText } from "../src/utils/language";

const chunkWords = (words: string[], startIndex: number, size: number) => {
  return words.slice(startIndex, startIndex + size).join(" ");
};

export default function ReaderScreen() {
  const { text, settings, isRTL } = useStore();
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const words = useMemo(() => {
    if (!text.trim()) {
      return [] as string[];
    }
    return normalizeText(text).split(" ");
  }, [text]);

  const intervalMs = useMemo(() => {
    const safeWpm = Math.max(settings.wpm, 50);
    const perWord = 60000 / safeWpm;
    return perWord * settings.chunkSize;
  }, [settings.wpm, settings.chunkSize]);

  useEffect(() => {
    if (!isPlaying || words.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((current) => {
        const next = current + settings.chunkSize;
        if (next >= words.length) {
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, words.length, settings.chunkSize, intervalMs]);

  const displayed = words.length
    ? chunkWords(words, index, settings.chunkSize)
    : "Add text from the Home screen to begin.";

  return (
    <View className="flex-1 bg-slate-950 px-6 items-center justify-center">
      <Text
        className="text-slate-100 font-semibold text-center"
        style={{
          fontSize: settings.fontSize,
          textAlign: isRTL ? "right" : "center",
        }}
      >
        {displayed}
      </Text>

      <View className="absolute bottom-10 left-6 right-6">
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setIsPlaying((prev) => !prev)}
            className="flex-1 bg-cyan-500 rounded-xl py-3 items-center"
          >
            <Text className="text-slate-950 font-semibold text-base">
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIndex(0)}
            className="flex-1 bg-white/10 rounded-xl py-3 items-center"
          >
            <Text className="text-slate-100 font-semibold text-base">Restart</Text>
          </Pressable>
        </View>

        <View className="mt-3 flex-row justify-between">
          <Link
            href="/settings"
            className="bg-white/10 rounded-xl py-2 px-4"
          >
            <Text className="text-slate-100 font-semibold">Settings</Text>
          </Link>
          <Link href="/" className="bg-white/10 rounded-xl py-2 px-4">
            <Text className="text-slate-100 font-semibold">Home</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
