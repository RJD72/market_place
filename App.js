import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Details from "./screens/Details";
import BottomTab from "./components/BottomTab";
import SplashScreen from "./screens/SplashScreen";
import EditProfile from "./screens/EditProfile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Login" component={SignIn} />
          <Stack.Screen name="Register" component={SignUp} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
