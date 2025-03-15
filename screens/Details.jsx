import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Details = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();

  // Ensure `item.images` is an array
  const images = Array.isArray(item.images) ? item.images : [item.images];

  const sendSMS = () => {};
  const sendEmail = () => {};

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
        </View>

        {/* Seller Info */}
        <View className="p-4 mt-10">
          <Text className="text-2xl font-bold text-gray-800">{item.title}</Text>
          <Text className=" text-gray-500">
            {item.name} - {item.address}
          </Text>

          {/* Full Description */}
          <Text className="mt-4 text-gray-700">{item.description}</Text>

          {/* Contact Seller */}
          <Button title="Contact Seller" onPress={sendSMS} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
