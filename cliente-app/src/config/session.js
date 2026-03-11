import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "ACTIVE_TABLE_SESSION";

export async function getActiveTable() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * session: { tableId: string, tableNumber: string, startedAt: string }
 */
export async function setActiveTable(session) {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function clearActiveTable() {
  await AsyncStorage.removeItem(KEY);
}
