import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "react-native";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SplashScreen = () => {
  const navigation = useNavigation();
  const image = require("../assets/images/homescreen.jpg");

  return (
    <SafeAreaView className="flex-1 bg-black overflow-hidden">
      <ImageBackground
        source={image}
        resizeMode="contain"
        className="flex-1 justify-center"
      >
        <View
          className="h-full gap-9"
          style={{
            justifyContent: "space-between",
            paddingVertical: 50,
            paddingHorizontal: 20,
          }}
        >
          <View className="gap-4">
            <Text className="text-2xl text-white text-center">Welcome To</Text>
            <Text
              className=" text-white text-center font-bold"
              style={{ fontSize: 56 }}
            >
              Marketplace
            </Text>
          </View>
          <View className="gap-9">
            <View className="w-full">
              <Button
                title="Log In"
                color={"#ffa500"}
                onPress={() => navigation.navigate("Login")}
              ></Button>
            </View>
            <View className="w-full">
              <Button
                color={"#ffa500"}
                title="Register"
                onPress={() => navigation.navigate("Register")}
              ></Button>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default SplashScreen;
