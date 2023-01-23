import { Button, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "./src/screen/Menu.js";
import AddLocal from "./src/screen/AddLocal.js";
import Salvos from "./src/screen/Salvos.js";
const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <StatusBar barStyle="default" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen component={Menu} name="menu" />
          <Stack.Screen component={AddLocal} name="AddLocal" />
          <Stack.Screen component={Salvos} name="Salvos" />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default App;
