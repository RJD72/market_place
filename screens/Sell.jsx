import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  ScrollView,
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
import { uuid } from "uuid";

const Sell = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Pick an Image from Device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 📌 Upload Image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `images/${uuid()}.jpg`;
    const imageRef = ref(storage, fileName);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  // 📌 Handle Form Submission
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

    setLoading(true);

    try {
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      const newItem = {
        name,
        title,
        phone,
        email,
        address,
        description,
        price: parseFloat(price),
        images: imageUrl ? [imageUrl] : [],
        createdAt: new Date(),
      };

      await addDoc(collection(db, "itemsForSale"), newItem);
      Alert.alert("Success", "Item listed for sale!");

      // Reset Form
      setName("");
      setTitle("");
      setPhone("");
      setEmail("");
      setAddress("");
      setDescription("");
      setPrice("");
      setImageUri(null);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
        Sell an Item
      </Text>

      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
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
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
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
      <Button title="Pick an Image" onPress={pickImage} />

      <Button
        title={loading ? "Uploading..." : "Submit Item"}
        onPress={handleSubmit}
        color="green"
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
