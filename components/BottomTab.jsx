import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Profile from "../screens/Profile";
import Home from "../screens/Home";
import Sell from "../screens/Sell";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Profile") iconName = "person-outline";
          else if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Sell") iconName = "pricetags-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ffa500",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          paddingBottom: 10,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Sell" component={Sell} />
    </Tab.Navigator>
  );
};
export default BottomTab;
