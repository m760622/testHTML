import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

import { useStore } from "../src/store/useStore";
import { detectLanguage, normalizeText } from "../src/utils/language";

export default function EditorScreen() {
  const router = useRouter();
  const { text, setText, setLanguage } = useStore();
  const [draft, setDraft] = useState(text);

  const handleSave = () => {
    const cleaned = normalizeText(draft);
    setText(cleaned);
    const { language, isRTL } = detectLanguage(cleaned);
    setLanguage(language, isRTL);
    Alert.alert("Saved", "Your changes were saved.");
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-6">
      <Text className="text-slate-100 text-2xl font-semibold mb-4">Editor</Text>

      <BlurView intensity={30} tint="dark" className="rounded-2xl overflow-hidden flex-1">
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            textAlignVertical="top"
            className="text-slate-100 text-base flex-1"
          />
        </View>
      </BlurView>

      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-cyan-500 rounded-xl py-3 items-center"
        >
          <Text className="text-slate-950 font-semibold text-base">Save Text</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="flex-1 bg-white/10 rounded-xl py-3 items-center"
        >
          <Text className="text-slate-100 font-semibold text-base">Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
