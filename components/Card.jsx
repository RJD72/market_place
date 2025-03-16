import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Card = ({ item }) => {
  const navigation = useNavigation();

  // Determine which image to display:
  let imageSource = null;
  if (item.images && item.images.length > 0) {
    imageSource = item.images[0]; // From array
  } else if (item.image) {
    imageSource = item.image; // Single URL or Base64 field
  } else if (item.imageBase64) {
    imageSource = item.imageBase64; // Base64 field if used
  }

  return (
    <SafeAreaView>
      <View
        className="bg-white shadow-lg rounded-xl overflow-hidden mx-2 mb-4"
        style={{ padding: 10 }}
      >
        {/* Image */}
        {imageSource && (
          <Image
            source={{ uri: imageSource }}
            className="w-full h-48"
            resizeMethod="cover"
          />
        )}

        {/* Divider */}
        <View className="border-b border-gray-300 my-2"></View>

        {/* Description */}
        <View className="p-4">
          {/* Number of Photos */}
          {item.images && (
            <Text className="text-lg font-semibold text-gray-800">
              {item.images.length === 1
                ? item.images.length + " photo"
                : item.images.length + " photos"}
            </Text>
          )}

          <Text className="text-lg font-semibold text-gray-800">
            {item.title}
          </Text>

          <Text className="text-gray-600 line-clamp-2">{item.description}</Text>

          {/* Read More */}
          <Pressable onPress={() => navigation.navigate("Details", { item })}>
            <Text className="text-blue-500 mt-2 ">Read More</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Card;
