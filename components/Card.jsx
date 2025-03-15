import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Card = ({ item }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View
        className="bg-white shadow-lg rounded-xl overflow-hidden mx-2"
        style={{ padding: 10 }}
      >
        {/* Image */}
        <Image
          source={{ uri: item.images[0] }}
          className="w-full h-48"
          resizeMethod="cover"
        />

        {/* Divider */}
        <View className="border-b border-gray-300 my-2"></View>

        {/* Description */}
        <View className="p-4">
          <Text className="text-lg font-semibold text-gray-800">
            {item.images.length === 1
              ? item.images.length + " photo"
              : item.images.length + " photos"}
          </Text>
          <Text className="text-lg font-semibold text-gray-800">
            {item.title}
          </Text>
          <Text className=" text-gray-600 line-clamp-3">
            {item.description}
          </Text>

          {/* Read More */}
          <Pressable onPress={() => navigation.navigate("Details", { item })}>
            <Text className="text-blue-500 mt-2 font-bold">Read More</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Card;
