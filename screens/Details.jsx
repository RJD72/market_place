import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const { width } = Dimensions.get("window");

const Details = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const [isOwner, setIsOwner] = useState(false);

  // Check if logged-in user is the owner
  useEffect(() => {
    const user = auth.currentUser;
    if (user && item.userId === user.uid) {
      setIsOwner(true);
    }
  }, []);

  /** ✅ Handle all possible image cases */
  let images = [];

  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    images = item.images;
  } else if (item.image) {
    images = [item.image];
  } else if (item.imageBase64) {
    images = [item.imageBase64];
  }

  /** 📱 Handle Phone Number Click */
  const handlePhoneClick = () => {
    Alert.alert(
      "Contact Seller",
      `Would you like to call or text ${item.phone}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => Linking.openURL(`tel:${item.phone}`),
        },
        {
          text: "Text",
          onPress: () => Linking.openURL(`sms:${item.phone}`),
        },
      ]
    );
  };

  /** 📧 Handle Email Click - Prefill */
  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Interested in: ${item.title}`);
    const body = encodeURIComponent(
      `Hi ${item.name},\n\nI'm interested in your item "${item.title}". Please provide more details.\n\nThank you!`
    );
    Linking.openURL(`mailto:${item.email}?subject=${subject}&body=${body}`);
  };

  /** 🗺️ Handle Address Click - Open Google Maps */
  const handleAddressClick = () => {
    const encodedAddress = encodeURIComponent(item.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(url);
  };

  /** 🔥 Handle Deletion */
  const handleDelete = async () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "itemsForSale", item.id));
            Alert.alert("Deleted", "Your post has been deleted.");
            navigation.goBack(); // Go back after deletion
          } catch (error) {
            Alert.alert("Error", "Failed to delete post.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Button */}
        <View className="p-3">
          <Ionicons
            name="arrow-back-outline"
            size={32}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* Image Carousel */}
        <View className="h-60">
          {images.length > 0 ? (
            <Carousel
              loop
              width={width}
              height={240}
              autoPlay={false}
              data={images}
              scrollAnimationDuration={2000}
              renderItem={({ item }) => (
                <View className="flex-1 justify-center items-center">
                  <Image
                    source={{ uri: item }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              )}
            />
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              No Image Available
            </Text>
          )}
        </View>

        {/* Seller Info */}
        <View style={styles.contentContainer}>
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              {item.title}
            </Text>

            {/* Address */}
            <TouchableOpacity onPress={handleAddressClick}>
              <Text className="text-blue-600 underline mt-2">
                {item.address}
              </Text>
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity onPress={handlePhoneClick}>
              <Text className="text-blue-600 mt-2 underline">{item.phone}</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity onPress={handleEmailClick}>
              <Text className="text-blue-600 mt-2 underline">{item.email}</Text>
            </TouchableOpacity>

            {/* Description */}
            <Text className="mt-4 text-gray-700">{item.description}</Text>
          </View>

          {/* Buttons at bottom */}
          <View style={styles.buttonContainer}>
            {isOwner && (
              <Button title="Delete Post" onPress={handleDelete} color="red" />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "space-between", // Push buttons to bottom
    padding: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});

export default Details;
