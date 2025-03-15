import { View, Text, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((_firebaseUser) => {
          setEmail("");
          setPassword("");
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomTab" }],
          });
        })
        .catch((error) => {
          if (
            error.code === "auth/wrong-password" ||
            error.code === "auth/wrong-email"
          ) {
            Alert.alert("Wrong email and/or password!");
          }
        });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center">
      <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "#f5f5f5", paddingHorizontal: 20, gap: 20 }}
      >
        <Text className="text-center text-2xl">Log In</Text>
        <View className=""></View>
        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your email"
          value={email}
          onChangeText={(value) => setEmail(value.trim())}
        />
        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your password"
          textContentType="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <Button title="Log In" onPress={handleLogIn} color={"#ffa500"}></Button>
        <Text className="text-center" style={{ color: "#333" }}>
          Don't have an account yet?{" "}
          <Text
            className="text-blue-500 text-center"
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default SignIn;
