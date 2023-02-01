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
  Alert,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import api from "../../servicos/api.js";
import axios from "axios";
import storage from "@react-native-firebase/storage";

//import firestore from "@react-native-firebase/firestore";
import { firebase } from "../../firebaseConfig";

export default function AddLocal() {
  const [texto, onChangeText] = useState("Titulo da foto/local");
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [foto, setFoto] = useState();
  const [uploading, setUploading] = useState();
  const [urlFoto, setUrlFoto] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = Location.requestForegroundPermissionsAsync();

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setInterval(() => {
        setMinhaLocalizacao(localizacaoAtual);
        setLoading(false);
      }, 1000);
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
  const novaLocalizacao = async (event) => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(imagem);
    setFoto(imagem.assets[0].uri);
  };
  /* UPLOAD IMAGEM */
  const uploadingImage = async () => {
    setUploading(true);
    const response = await fetch(foto);
    const blob = await response.blob();
    const filename = foto.substring(foto.lastIndexOf("/") + 1);
    let upload = firebase.storage().ref("produtos/").child(filename).put(blob);

    upload.on("state_changed", function () {
      upload.snapshot.ref.getDownloadURL().then(function (url_imagem) {
        setUrlFoto(url_imagem);
      });
    });
    try {
      await upload;
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
    Alert.alert("photo Uploaded");
    setFoto(null);
  };
  //console.log(urlFoto);
  /* Salvar */
  const salvar = async () => {
    const link = await axios.get(
      `https://nominatim.openstreetmap.org/reverse.php?lat=${localizacao.latitude}&lon=${localizacao.longitude}&zoom=18&format=jsonv2`
    );
    //console.log(link.data.address.road);

    //let nomeArquivo = foto.substring(foto.lastIndexOf("/") + 1);

    try {
      uploadingImage();
      if (!urlFoto == null) {
        const resposta = await api.post("/locais.json", {
          local: localizacao,
          nomeFoto: texto,
          caminhoFoto: urlFoto,
          nomeRua: link.data.address.road,
          numero: link.data.address.house_number,
          estado: link.data.address.state,
        });
      }

      Alert.alert("Salvo com sucesso!!!");
    } catch (error) {
      console.log("Deu ruim na busca da API: " + error.message);
    }
  };
  //console.log(foto.substring(foto.lastIndexOf("/") + 1));
  // console.log(caminhoFoto);
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
          {minhaLocalizacao && (
            <Pressable style={styles.botao} onPress={novaLocalizacao}>
              <Text style={styles.textoBotao}>localizar no mapa</Text>
            </Pressable>
          )}
          <Pressable style={styles.botao} onPress={salvar}>
            <Text style={styles.textoBotao}>Salvar localização</Text>
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
    height: 100,
    width: 250,
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
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "gray",
  },
  textoBotao: {
    fontSize: 20,
  },
});
