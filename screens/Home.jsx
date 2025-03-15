import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { items } from "../data/data";
import Card from "../components/Card";

const Home = () => {
  return (
    <SafeAreaView>
      <FlatList
        data={items}
        keyExtractor={(items) => items.id}
        renderItem={({ item }) => <Card item={item} />}
      />
    </SafeAreaView>
  );
};
export default Home;
