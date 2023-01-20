import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Pressable,
  Image,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [texto, onChangeText] = useState("Titulo da foto/local");
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [foto, setFoto] = useState();

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = Location.requestForegroundPermissionsAsync();

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);

  const regiaoInicial = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };
  const [localizacao, setLocalizacao] = useState();
  const novaLocalizacao = (event) => {
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.0052,
      longitudeDelta: 0.0012,
    });
  };
  useEffect(() => {
    async function verPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verPermissoes();
  }, []);
  const acessaCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(imagem);
    setFoto(imagem.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar animated={true} backgroundColor="black" />
        <Text style={styles.texto}>App 1 - Fotos de lugares visitados</Text>
        <View style={styles.caixa}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={texto}
          />
          <View style={styles.view}>
            {foto && (
              <Image
                source={{ uri: foto }}
                style={{ width: 350, height: 200 }}
              />
            )}
          </View>
          <Pressable style={styles.botao} onPress={acessaCamera}>
            <Text style={styles.textoBotao}>Tirar foto</Text>
          </Pressable>
        </View>
        <View style={styles.caixa}>
          <View style={styles.view}>
            <MapView
              style={styles.map}
              region={localizacao ?? regiaoInicial}
              liteMode={false}
            >
              {localizacao && (
                <Marker coordinate={localizacao} title="Titulo" draggable />
              )}
            </MapView>
          </View>
          <Pressable style={styles.botao} onPress={novaLocalizacao}>
            <Text style={styles.textoBotao}>localizar no mapa</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texto: {
    textAlign: "center",
    fontSize: 18,
  },
  caixa: {
    width: 400,
    alignItems: "center",
  },
  input: {
    height: 60,
    width: 350,
    margin: 30,
    borderWidth: 1,
    padding: 10,
  },
  view: {
    height: 200,
    width: 350,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  botao: {
    height: 40,
    width: 350,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "gray",
  },
  textoBotao: {
    fontSize: 20,
  },
});
