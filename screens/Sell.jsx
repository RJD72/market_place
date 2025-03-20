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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Sell = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const post = route.params?.post; // Check if editing

  const [user, setUser] = useState(null);
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
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);

  /** 🔥 Listen for Auth State and Fetch User Data */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser);
      } else {
        setLoadingUserData(false);
      }
    });

    return unsubscribe;
  }, []);

  /** 📥 Fetch User Profile Data */
  const fetchUserData = async (currentUser) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setName(userData.name || "");
        setPhone(userData.phone || "");
        setEmail(userData.email || currentUser.email);
        setAddress(userData.address || "");
        setCity(userData.city || "");
        setProvince(userData.province || "");
        setCountry(userData.country || "");
      } else {
        setEmail(currentUser.email);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user data.");
    } finally {
      setLoadingUserData(false);
    }
  };

  /** Prefill if Editing */
  useEffect(() => {
    if (post) {
      setName(post.name);
      setTitle(post.title);
      setPhone(post.phone);
      setEmail(post.email);
      setAddress(post.address);
      setCity(post.city);
      setProvince(post.province);
      setCountry(post.country);
      setDescription(post.description);
      setPrice(post.price.toString());
      if (post.imageBase64) {
        setImageUri(post.imageBase64);
        setBase64Image(post.imageBase64);
      }
    }
  }, [post]);

  /** 📸 Pick Image from Gallery */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  /** 📷 Take Photo with Camera */
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera permission is needed.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  /** 📌 Handle Form Submission (Add or Edit) */
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
      Alert.alert("Error", "Please select or take a photo.");
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
        imageBase64: base64Image,
        createdAt: new Date(),
        userId: user.uid,
      };

      if (post) {
        // Edit mode
        const postRef = doc(db, "itemsForSale", post.id);
        await updateDoc(postRef, newItem);
        Alert.alert("Success", "Post updated!");
      } else {
        // Add mode
        await addDoc(collection(db, "itemsForSale"), newItem);
        Alert.alert("Success", "Item listed for sale!");
      }

      /** ✅ CLEAR FIELDS */
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUri(null);
      setBase64Image(null);

      /** ✅ Reset navigation stack to remove old params */
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile" }],
      });
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
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {post ? "Edit Post" : "Sell an Item"}
          </Text>

          <TextInput
            placeholder="Your Name"
            value={name}
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

          {/* Buttons */}
          <View className="gap-4 mt-4">
            <Button
              title="Pick Image from Gallery"
              onPress={pickImage}
              color="#555"
            />
            <Button title="Take Photo" onPress={takePhoto} color="#555" />

            <Button
              title={
                loading ? "Uploading..." : post ? "Update Post" : "Submit Item"
              }
              onPress={handleSubmit}
              color="#ffa500"
              disabled={loading}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f4f4f4",
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
};

export default Sell;
