import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";

const Menu = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <View>
          <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate("AddLocal")}
          >
            <Text style={styles.texto}>Locais</Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate("Salvos")}
          >
            <Text style={styles.texto}>Salvos</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    flexDirection: "row",
  },
  botao: {
    height: 100,
    width: 100,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    margin: 5,
  },
  texto: {
    color: "white",
  },
});
