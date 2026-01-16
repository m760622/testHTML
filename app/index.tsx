import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";

import { useStore } from "../src/store/useStore";
import { detectLanguage, normalizeText } from "../src/utils/language";
import {
  captureImageFromCamera,
  pickImageFromLibrary,
  recognizeText,
  requestImagePermissions,
} from "../src/utils/ocr";

const ActionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="bg-cyan-500/90 px-4 py-3 rounded-full shadow-lg"
  >
    <Text className="text-slate-950 font-semibold text-sm">{label}</Text>
  </Pressable>
);

export default function HomeScreen() {
  const { text, setText, setLanguage } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const placeholder = useMemo(
    () =>
      "Paste your text here or scan an image to start speed reading.",
    []
  );

  const handleTextChange = (value: string) => {
    const cleaned = normalizeText(value);
    setText(cleaned);
    const { language, isRTL } = detectLanguage(cleaned);
    setLanguage(language, isRTL);
  };

  const handleOCR = async (source: "camera" | "library") => {
    setIsProcessing(true);
    const permissions = await requestImagePermissions();

    if ((source === "camera" && !permissions.camera) || !permissions.media) {
      Alert.alert("Permission needed", "Please grant camera and media permissions.");
      setIsProcessing(false);
      return;
    }

    const uri =
      source === "camera" ? await captureImageFromCamera() : await pickImageFromLibrary();

    if (!uri) {
      setIsProcessing(false);
      return;
    }

    const result = await recognizeText(uri);
    handleTextChange(result.text);
    setIsProcessing(false);
  };

  return (
    <View className="flex-1 bg-slate-950 px-6 pt-6">
      <Text className="text-slate-100 text-3xl font-semibold mb-4">
        Rapid Serial Visual Presentation
      </Text>

      <BlurView intensity={30} tint="dark" className="rounded-2xl overflow-hidden">
        <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <Text className="text-slate-200 text-sm mb-2">Input Text</Text>
          <TextInput
            value={text}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            className="text-slate-100 h-56 text-base"
          />
        </View>
      </BlurView>

      <View className="flex-row justify-between mt-6">
        <ActionButton
          label={isProcessing ? "Scanning..." : "Scan from Camera"}
          onPress={() => handleOCR("camera")}
        />
        <ActionButton
          label={isProcessing ? "Scanning..." : "Upload Image"}
          onPress={() => handleOCR("library")}
        />
      </View>

      <View className="mt-8 flex-row gap-3">
        <Link
          href="/editor"
          className="flex-1 bg-slate-200 rounded-xl py-3 items-center"
        >
          <Text className="text-slate-900 font-semibold text-base">Open Editor</Text>
        </Link>
        <Link
          href="/reader"
          className="flex-1 bg-cyan-500 rounded-xl py-3 items-center"
        >
          <Text className="text-slate-950 font-semibold text-base">Start Reading</Text>
        </Link>
      </View>

      <Link
        href="/settings"
        className="mt-4 bg-white/10 rounded-xl py-3 items-center"
      >
        <Text className="text-slate-100 font-semibold text-base">Reader Settings</Text>
      </Link>
    </View>
  );
}
