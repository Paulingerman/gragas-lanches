import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../src/theme/colors";
import { api, getBaseUrl, setBaseUrl } from "../src/config/api";

export default function Settings() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async () => {
      const current = await getBaseUrl();
      setUrl(current);
    })();
  }, []);

  async function testConnection() {
    try {
      const client = await api();
      const res = await client.get("/health");
      Alert.alert("Conectou!", JSON.stringify(res.data, null, 2));
    } catch (e) {
      Alert.alert("Falhou", "Não consegui conectar no /health. Verifique a URL e a internet.");
    }
  }

  async function save() {
    const trimmed = url.trim().replace(/\/$/, "");
    await setBaseUrl(trimmed);
    Alert.alert("Salvo", `Servidor definido para:\n${trimmed}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 64 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Servidor</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>
        Use uma URL pública (ex: ngrok/render). No celular, localhost não funciona.
      </Text>

      <Text style={{ color: colors.text, marginTop: 18, marginBottom: 8, fontWeight: "700" }}>
        API Base URL
      </Text>

      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://xxxx.ngrok-free.app"
        placeholderTextColor="#6B7688"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          backgroundColor: colors.card,
          color: colors.text,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: "#2A3441",
        }}
      />

      <Pressable
        onPress={save}
        style={{
          marginTop: 16,
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#111", fontSize: 16, fontWeight: "800" }}>Salvar</Text>
      </Pressable>

      <Pressable
        onPress={testConnection}
        style={{
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#2A3441",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>Testar conexão</Text>
      </Pressable>
    </View>
  );
}
