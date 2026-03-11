import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const STORAGE_KEY = "API_BASE_URL";

// fallback (você troca depois por ngrok/render)
const DEFAULT_BASE_URL = "http://localhost:3000";

export async function getBaseUrl() {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  return saved || DEFAULT_BASE_URL;
}

export async function setBaseUrl(url) {
  await AsyncStorage.setItem(STORAGE_KEY, url);
}

export async function api() {
  const baseURL = await getBaseUrl();
  return axios.create({ baseURL, timeout: 8000 });
}
