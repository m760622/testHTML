import * as ImagePicker from "expo-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export type OCRResult = {
  text: string;
};

export const requestImagePermissions = async () => {
  const camera = await ImagePicker.requestCameraPermissionsAsync();
  const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return {
    camera: camera.status === "granted",
    media: media.status === "granted",
  };
};

export const pickImageFromLibrary = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
};

export const captureImageFromCamera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
};

export const recognizeText = async (imageUri: string): Promise<OCRResult> => {
  const result = await TextRecognition.recognize(imageUri);
  return {
    text: result.text,
  };
};
