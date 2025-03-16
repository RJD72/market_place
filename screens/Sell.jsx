import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  db,
  storage,
  addDoc,
  collection,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-native-safe-area-context";

const Sell = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null); // <-- New state
  const [loading, setLoading] = useState(false);

  // 📌 Fetch logged-in user's data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name || "");
          setPhone(userData.phone || "");
          setEmail(userData.email || user.email);
          setAddress(userData.address || "");
          setCity(userData.city || "");
          setProvince(userData.province || "");
          setCountry(userData.country || "");
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user]);

  // 📌 Pick image and convert to Base64
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduce quality to limit size
      base64: true, // <-- Base64 enabled
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // For preview
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`); // Save Base64 string
    }
  };

  // 📌 Handle form submission
  const handleSubmit = async () => {
    if (
      !name ||
      !title ||
      !price ||
      !phone ||
      !email ||
      !address ||
      !description
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (!base64Image) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const newItem = {
        name,
        title,
        phone,
        email,
        address,
        city,
        province,
        country,
        description,
        price: parseFloat(price),
        imageBase64: base64Image, // Save Base64 image in Firestore
        createdAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(db, "itemsForSale"), newItem);
      Alert.alert("Success", "Item listed for sale!");

      // Reset Form
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUri(null);
      setBase64Image(null);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {loadingUserData ? (
        <ActivityIndicator size="large" color="#ffa500" />
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text
                style={{ fontSize: 32, textAlign: "center", marginBottom: 15 }}
              >
                Sell an Item
              </Text>

              <TextInput
                placeholder="Your Name"
                value={name}
                editable={false}
                style={styles.input}
              />

              <TextInput
                placeholder="Phone Number"
                value={phone}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="Email Address"
                value={email}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="Address"
                value={address}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="City"
                value={city}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="Province/State"
                value={province}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="Country"
                value={country}
                editable={false}
                style={styles.input}
              />
              <TextInput
                placeholder="Item Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Price ($)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={styles.inputLarge}
              />

              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                />
              )}
            </View>
            <View style={styles.buttonContainer} className="">
              <Button
                title="Pick an Image"
                onPress={pickImage}
                color="#ffa500"
              />

              <Button
                title={loading ? "Uploading..." : "Submit Item"}
                onPress={handleSubmit}
                color="#ffa500"
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f4f4f4", // Light gray for non-editable fields
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
});

export default Sell;
