import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { colors } from "../src/theme/colors";
import { getActiveTable } from "../src/config/session";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = await getActiveTable();
      if (session?.tableId) {
        router.replace({
          pathname: "/menu",
          params: {
            tableId: session.tableId,
            tableNumber: session.tableNumber,
          },
        });
      }
    })();
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: "center" }}>
      <Text style={{ color: colors.primary, fontSize: 44, fontWeight: "800" }}>Gragas</Text>
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: "700", marginTop: 6 }}>
        Lanches
      </Text>

      <Text style={{ color: colors.muted, marginTop: 18, fontSize: 16, lineHeight: 22 }}>
        Faça seu pedido direto do celular e chame o garçom quando precisar.
      </Text>

      <Pressable
        onPress={() => router.push("/tables")}
        style={{
          marginTop: 28,
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#111", fontSize: 16, fontWeight: "800" }}>Começar</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/settings")}
        style={{
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#2A3441",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          Configurar servidor
        </Text>
      </Pressable>

      <View style={{ marginTop: 18, flexDirection: "row", gap: 10, alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ color: colors.muted }}>Verificando sessão...</Text>
      </View>
    </View>
  );
}
