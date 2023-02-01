import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import api from "../../servicos/api";
import axios from "axios";

const Salvos = () => {
  const [locais, setLocais] = useState([]);
  useEffect(() => {
    async function capturarDados() {
      try {
        const resposta = await api.get("/locais.json");
        const dados = resposta.data;
        let listaLocais = [];

        for (const res in dados) {
          const objLocais = {
            id: res,
            rua: dados[res].nomeRua,
            foto: dados[res].nomeFoto,
            numero: dados[res].numero,
            caminhoFoto: dados[res].caminhoFoto,
            estado: dados[res].estado,
          };
          listaLocais.push(objLocais);
        }
        setLocais(listaLocais);
      } catch (error) {
        console.log("Deu ruim na busca da API: " + error.message);
      }
    }
    capturarDados();
  }, []);

  console.log(locais);
  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {locais.map((local) => (
          <>
            <Text>{local.rua}</Text>
            <Text>{local.numero}</Text>
            <Text>{local.estado}</Text>
            <Text>{local.foto}</Text>

            <Image
              source={{ uri: local.caminhoFoto }}
              style={{ width: 350, height: 200 }}
            />
          </>
        ))}
      </ScrollView>
    </View>
  );
};

export default Salvos;

const styles = StyleSheet.create({});
