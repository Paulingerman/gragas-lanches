import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../src/theme/colors";
import { api } from "../src/config/api";
import { getActiveTable, setActiveTable } from "../src/config/session";

const mockTables = [
  { id: "table_01", number: 1, status: "available" },
  { id: "table_02", number: 2, status: "available" },
  { id: "table_03", number: 3, status: "occupied" },
];

export default function Tables() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const client = await api();
      const res = await client.get("/tables");
      setTables(res.data?.data?.tables || []);
    } catch (e) {
      setTables(mockTables);
      Alert.alert(
        "Sem conexão com o servidor",
        "Mostrando mesas de exemplo. Configure o servidor quando quiser usar online."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const session = await getActiveTable();
      if (session?.tableId) {
        // já existe mesa ativa → não deixa escolher outra
        router.replace({
          pathname: "/menu",
          params: { tableId: session.tableId, tableNumber: session.tableNumber },
        });
        return;
      }
      load();
    })();
  }, [router]);

  async function pickTable(t) {
    if (t.status !== "available") return;

    await setActiveTable({
      tableId: t.id,
      tableNumber: String(t.number),
      startedAt: new Date().toISOString(),
    });

    router.replace({
      pathname: "/menu",
      params: { tableId: t.id, tableNumber: String(t.number) },
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: 64 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Escolha uma mesa</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>
        Depois de selecionar, a mesa fica fixa até o fim do atendimento.
      </Text>

      <Pressable
        onPress={() => router.push("/settings")}
        style={{
          marginTop: 16,
          borderWidth: 1,
          borderColor: "#2A3441",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}>
          Configurar servidor
        </Text>
      </Pressable>

      <Pressable
        onPress={load}
        style={{
          marginTop: 10,
          backgroundColor: colors.card,
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#2A3441",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}>Atualizar</Text>
      </Pressable>

      {loading ? (
        <View style={{ marginTop: 24 }}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted, marginTop: 10 }}>Carregando mesas...</Text>
        </View>
      ) : (
        <View style={{ marginTop: 18, gap: 12 }}>
          {tables.map((t) => (
            <Pressable
              key={t.id}
              disabled={t.status !== "available"}
              style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: "#2A3441",
                opacity: t.status === "available" ? 1 : 0.6,
              }}
              onPress={() => pickTable(t)}
            >
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>
                Mesa {t.number}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 4 }}>
                Status: {t.status === "available" ? "Disponível" : "Ocupada"}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
