import { View, Text, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(""); // New
  const [province, setProvince] = useState(""); // New
  const [country, setCountry] = useState(""); // New
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !province ||
        !country ||
        !email ||
        !password
      ) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(collection(db, "users"), user.uid), {
        name,
        phone,
        address,
        city,
        province,
        country,
        email,
        uid: user.uid,
        createdAt: new Date(),
      });

      Alert.alert(
        "Success",
        "Account created successfully!",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
        { cancelable: true }
      );

      // Clear input fields
      setName("");
      setPhone("");
      setAddress("");
      setCity("");
      setProvince("");
      setCountry("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Firebase Error:", error.code, error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="w-full h-full justify-center">
      <View className="w-full p-3 mx-auto gap-4">
        <Text className="text-center text-2xl">Sign Up</Text>

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your province/state"
          value={province}
          onChangeText={setProvince}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your country"
          value={country}
          onChangeText={setCountry}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your email"
          value={email}
          onChangeText={(value) => setEmail(value.trim())}
        />

        <TextInput
          className="border-gray-200 border rounded"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Sign Up" onPress={handleSignUp} color={"#ffa500"} />

        <Text className="text-center">
          Already have an account?{" "}
          <Text
            className="text-blue-500 text-center"
            onPress={() => navigation.navigate("Login")}
          >
            Log in
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
