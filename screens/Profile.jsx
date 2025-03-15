import { View, Text, Pressable, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth, db, signOutUser } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.log("No user data found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="w-full h-full p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userData ? (
        <View>
          <Text>Name: {userData.name}</Text>
          <Text>Phone Number: {userData.phone}</Text>
          <Text>Address: {userData.address}</Text>
          <Text>City: {userData.city}</Text>
          <Text>Province/State: {userData.province}</Text>
          <Text>Country: {userData.country}</Text>
          <Text>Email Address: {userData.email}</Text>

          <Pressable onPress={() => navigation.navigate("EditProfile")}>
            <Text style={{ color: "blue", marginTop: 10 }}>Edit</Text>
          </Pressable>

          <Button
            title="Sign Out"
            onPress={() => {
              signOutUser();
              navigation.navigate("SplashScreen");
            }}
          />
        </View>
      ) : (
        <Text>No user data found.</Text>
      )}
    </SafeAreaView>
  );
};

export default Profile;
