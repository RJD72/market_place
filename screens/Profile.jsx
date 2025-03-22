import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth, db, signOutUser } from "../firebaseConfig";
import { useState, useCallback } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      }

      const postsQuery = query(
        collection(db, "itemsForSale"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingPosts(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setLoadingPosts(true);
      fetchData();
    }, [])
  );

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "itemsForSale", postId));
      setUserPosts((prev) => prev.filter((post) => post.id !== postId));
      Alert.alert("Deleted", "Post has been deleted.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete post.");
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {item.imageBase64 ? (
        <Image
          source={{ uri: item.imageBase64 }}
          style={styles.postImage}
          resizeMode="cover"
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          {item.title}
        </Text>
        <Text>Price: ${item.price}</Text>
      </View>
      <View style={styles.postButtons}>
        <Button
          title="Edit"
          color="#ffa500"
          onPress={() => navigation.navigate("Sell", { post: item })}
        />
        <Button
          title="Delete"
          color="red"
          onPress={() =>
            Alert.alert("Delete Post", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => handleDeletePost(item.id),
              },
            ])
          }
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userData ? (
        <View style={styles.container}>
          <View style={styles.profileInfo}>
            <Text style={styles.heading}>User Profile</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.name}</Text>

            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{userData.phone}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{userData.address}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{userData.city}</Text>

            <Text style={styles.label}>Province/State:</Text>
            <Text style={styles.value}>{userData.province}</Text>

            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{userData.country}</Text>

            <Text style={styles.label}>Email Address:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>

          {/* User Posts */}
          <View style={{ flex: 1 }}>
            <Text style={styles.postsHeading}>Your Posts</Text>

            {loadingPosts ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : userPosts.length === 0 ? (
              <Text style={styles.noData}>You have no posts yet.</Text>
            ) : (
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
              color={"#ffa500"}
            />

            <Button
              title="Sign Out"
              color={"#ffa500"}
              onPress={() => {
                signOutUser();
                navigation.navigate("SplashScreen");
              }}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.noData}>No user data found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  postsHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  postButtons: {
    flexDirection: "column",
    marginLeft: 10,
    gap: 6,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 16,
  },
  noData: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default Profile;
