import {
  View,
  Text,
  Pressable,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
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
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userData ? (
        <View style={styles.container}>
          <Text style={styles.heading}>User Profile</Text>
          <View style={styles.profileInfo}>
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

          <View style={styles.buttonContainer}>
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
              color={"#ffa500"}
            ></Button>

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
  buttonContainer: {
    justifyContent: "flex-end",
    marginTop: "auto",
    gap: 15,
  },
  noData: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default Profile;
