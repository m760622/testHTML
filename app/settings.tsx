import { Pressable, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";

import { useStore } from "../src/store/useStore";

const chunkOptions = [1, 2, 3, 5];

export default function SettingsScreen() {
  const { settings, updateSettings } = useStore();

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-6">
      <Text className="text-slate-100 text-2xl font-semibold mb-4">
        Reader Settings
      </Text>

      <BlurView intensity={35} tint="dark" className="rounded-3xl overflow-hidden">
        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 gap-8">
          <View>
            <Text className="text-slate-200 text-sm mb-2">Font Size</Text>
            <Text className="text-slate-100 text-lg font-semibold mb-2">
              {settings.fontSize}px
            </Text>
            <Slider
              minimumValue={20}
              maximumValue={64}
              value={settings.fontSize}
              onValueChange={(value) => updateSettings({ fontSize: Math.round(value) })}
              minimumTrackTintColor="#22d3ee"
              maximumTrackTintColor="#1e293b"
              thumbTintColor="#f8fafc"
            />
          </View>

          <View>
            <Text className="text-slate-200 text-sm mb-3">Chunk Size</Text>
            <View className="flex-row flex-wrap gap-3">
              {chunkOptions.map((option) => {
                const isActive = settings.chunkSize === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => updateSettings({ chunkSize: option })}
                    className={`px-4 py-2 rounded-full ${
                      isActive ? "bg-cyan-500" : "bg-white/10"
                    }`}
                  >
                    <Text
                      className={`${
                        isActive ? "text-slate-950" : "text-slate-100"
                      } font-semibold`}
                    >
                      {option} word{option > 1 ? "s" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text className="text-slate-200 text-sm mb-2">Reading Speed</Text>
            <Text className="text-slate-100 text-lg font-semibold mb-2">
              {settings.wpm} WPM
            </Text>
            <Slider
              minimumValue={150}
              maximumValue={900}
              value={settings.wpm}
              onValueChange={(value) => updateSettings({ wpm: Math.round(value) })}
              minimumTrackTintColor="#22d3ee"
              maximumTrackTintColor="#1e293b"
              thumbTintColor="#f8fafc"
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
}
