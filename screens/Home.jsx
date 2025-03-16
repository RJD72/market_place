import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Card from "../components/Card";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch items in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "itemsForSale"),
      (querySnapshot) => {
        const fetchedItems = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setItems(fetchedItems);
        setLoading(false);
      }
    );

    return unsubscribe; // Clean up listener
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffa500" />
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card item={item} />}
        />
      ) : (
        <Text>No items found.</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;
