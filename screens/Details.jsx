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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const Details = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();

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

  /** 🗺️ Optional: Get Current Location & Directions */
  const handleDirectionsClick = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const encodedAddress = encodeURIComponent(item.address);

      // Open Google Maps with current location & destination
      const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedAddress}&travelmode=driving`;
      Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch current location.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
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
        <View className="p-4 mt-10">
          <Text className="text-2xl font-bold text-gray-800">{item.title}</Text>

          {/* Address */}
          <TouchableOpacity onPress={handleAddressClick}>
            <Text className="text-gray-500 underline mt-2">{item.address}</Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity onPress={handlePhoneClick}>
            <Text className="text-blue-600 mt-2 underline">{item.phone}</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity onPress={handleEmailClick}>
            <Text className="text-blue-600 mt-2 underline">{item.email}</Text>
          </TouchableOpacity>

          {/* Full Description */}
          <Text className="mt-4 text-gray-700">{item.description}</Text>

          {/* Contact Buttons */}
          <View style={{ marginTop: 20, gap: 10 }}>
            <Button
              title="Call or Text Seller"
              onPress={handlePhoneClick}
              color="#ffa500"
            />
            <Button
              title="Email Seller"
              onPress={handleEmailClick}
              color="#000"
            />
            <Button title="View Address in Maps" onPress={handleAddressClick} />
            <Button
              title="Get Directions"
              onPress={handleDirectionsClick}
              color="#555"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
