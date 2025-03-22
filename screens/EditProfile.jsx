import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setName(userData.name);
          setPhone(userData.phone);
          setAddress(userData.address);
          setCity(userData.city);
          setProvince(userData.province);
          setCountry(userData.country);
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);

      await updateDoc(userDocRef, {
        name,
        phone,
        address,
        city,
        province,
        country,
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView className="w-full h-full p-4">
      {/* Back Button */}
      <View className="p-3">
        <Ionicons
          name="arrow-back-outline"
          size={32}
          onPress={() => navigation.goBack()}
        />
      </View>

      <Text className="text-center text-2xl">Edit Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container} className="gap-4 mt-4">
          <View style={styles.inputContainer}>
            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
            />

            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your city"
              value={city}
              onChangeText={setCity}
            />

            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your province/state"
              value={province}
              onChangeText={setProvince}
            />

            <TextInput
              className="border-gray-200 border rounded p-2"
              placeholder="Enter your country"
              value={country}
              onChangeText={setCountry}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={updating ? "Updating..." : "Save Changes"}
              onPress={handleUpdateProfile}
              disabled={updating}
              color={"#ffa500"}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  inputContainer: {
    gap: 15,
  },
  buttonContainer: {
    marginTop: "auto",
  },
});

export default EditProfile;
