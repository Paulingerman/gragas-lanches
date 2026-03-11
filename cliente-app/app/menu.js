import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../src/theme/colors";
import { api } from "../src/config/api";

function formatBRL(value) {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  } catch {
    return `R$ ${Number(value).toFixed(2)}`;
  }
}

export default function Menu() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const tableId = params.tableId ? String(params.tableId) : null;
  const tableNumber = params.tableNumber ? String(params.tableNumber) : null;

  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState({});
  const [cart, setCart] = useState({});
  const [lastCallAt, setLastCallAt] = useState(null);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, row) => sum + row.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => Object.values(cart).reduce((sum, row) => sum + row.item.price * row.qty, 0),
    [cart]
  );

  async function loadMenu() {
    setLoading(true);
    try {
      const client = await api();
      const res = await client.get("/menu/available");
      setMenu(res.data?.data?.menu || {});
    } catch (e) {
      setMenu({});
      Alert.alert(
        "Sem conexão",
        "Não consegui carregar o cardápio. Configure o servidor e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function addItem(item) {
    setCart((prev) => {
      const current = prev[item.id];
      const nextQty = (current?.qty || 0) + 1;
      return { ...prev, [item.id]: { item, qty: nextQty } };
    });
  }

  function removeItem(item) {
    setCart((prev) => {
      const current = prev[item.id];
      if (!current) return prev;

      const nextQty = current.qty - 1;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }

      return { ...prev, [item.id]: { item, qty: nextQty } };
    });
  }

  function callWaiter() {
    const now = Date.now();
    if (lastCallAt && now - lastCallAt < 30_000) {
      Alert.alert("Aguarde", "O garçom já foi chamado. Aguarde um momento.");
      return;
    }

    setLastCallAt(now);
    Alert.alert("Pronto!", "Garçom chamado. Em breve ele virá até sua mesa.");
    // Depois ligaremos isso no backend/socket
  }

  useEffect(() => {
    if (!tableId) {
      // se entrou sem params, manda escolher mesa
      router.replace("/tables");
      return;
    }
    loadMenu();
  }, [router, tableId]);

  const categories = Object.keys(menu);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: 64, paddingHorizontal: 24, paddingBottom: 14 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>
          Cardápio
        </Text>

        <Text style={{ color: colors.muted, marginTop: 6 }}>
          {tableNumber ? `Mesa ${tableNumber}` : ""}
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          <Pressable
            onPress={callWaiter}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "900" }}>Chamar garçom</Text>
          </Pressable>

          <Pressable
            onPress={loadMenu}
            style={{
              flex: 1,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: "#2A3441",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>Atualizar</Text>
          </Pressable>
        </View>

        <Text style={{ color: colors.muted, marginTop: 10, fontSize: 12 }}>
          Para trocar de mesa, fale com o garçom.
        </Text>
      </View>

      {loading ? (
        <View style={{ padding: 24 }}>
          <ActivityIndicator />
          <Text style={{ color: colors.muted, marginTop: 10 }}>Carregando cardápio...</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={{ padding: 24 }}>
          <Text style={{ color: colors.muted }}>
            Nenhum item disponível (ou sem conexão).
          </Text>
          <Pressable
            onPress={() => router.push("/settings")}
            style={{
              marginTop: 14,
              borderWidth: 1,
              borderColor: "#2A3441",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>Configurar servidor</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>
          {categories.map((cat) => {
            const items = menu[cat] || [];
            return (
              <View key={cat} style={{ marginBottom: 18 }}>
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800", marginBottom: 10 }}>
                  {cat.toUpperCase()}
                </Text>

                <View style={{ gap: 12 }}>
                  {items.map((item) => {
                    const qty = cart[item.id]?.qty || 0;
                    return (
                      <View
                        key={item.id}
                        style={{
                          backgroundColor: colors.card,
                          borderRadius: 14,
                          padding: 14,
                          borderWidth: 1,
                          borderColor: "#2A3441",
                        }}
                      >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>
                              {item.name}
                            </Text>
                            {!!item.description && (
                              <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>
                                {item.description}
                              </Text>
                            )}
                          </View>

                          <Text style={{ color: colors.text, fontWeight: "800" }}>
                            {formatBRL(item.price)}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "row", gap: 10, marginTop: 12, alignItems: "center" }}>
                          <Pressable
                            onPress={() => removeItem(item)}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 14,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "#2A3441",
                              opacity: qty > 0 ? 1 : 0.5,
                            }}
                            disabled={qty === 0}
                          >
                            <Text style={{ color: colors.text, fontWeight: "800" }}>-</Text>
                          </Pressable>

                          <Text style={{ color: colors.text, minWidth: 28, textAlign: "center", fontWeight: "800" }}>
                            {qty}
                          </Text>

                          <Pressable
                            onPress={() => addItem(item)}
                            style={{
                              paddingVertical: 10,
                              paddingHorizontal: 14,
                              borderRadius: 10,
                              backgroundColor: colors.primary,
                            }}
                          >
                            <Text style={{ color: "#111", fontWeight: "900" }}>+</Text>
                          </Pressable>

                          <View style={{ flex: 1 }} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          backgroundColor: "rgba(11,15,20,0.95)",
          borderTopWidth: 1,
          borderTopColor: "#2A3441",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "800" }}>Itens: {cartCount}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Total (parcial): {formatBRL(cartTotal)}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              if (cartCount === 0) {
                Alert.alert("Carrinho vazio", "Adicione pelo menos 1 item.");
                return;
              }
              Alert.alert("Próximo passo", "Agora vamos criar a tela de confirmação do pedido.");
            }}
            style={{
              backgroundColor: cartCount > 0 ? colors.primary : "#2A3441",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: cartCount > 0 ? "#111" : colors.text, fontWeight: "900" }}>
              Confirmar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
