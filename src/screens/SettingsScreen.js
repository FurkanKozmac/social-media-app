import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const SettingsScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [userInfo, setUserInfo] = useState({ name: "", lastName: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(
          collection(FIREBASE_FIRESTORE, "userInfo"),
          where("userID", "==", user.uid)
        );
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserInfo(userData);
          console.log("User data:", userData);
        });
      } catch (error) {
        console.error("Cannot fetch data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.info("Signed out.");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch(() => {
        console.error("Cannot sign out.");
      });
  };

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.account, styles.name]}>
          {userInfo.name} {userInfo.lastName}
        </Text>
        <Text style={[styles.account, styles.email]}>{userInfo.email}</Text>
      </View>
      <TouchableOpacity onPress={handleSignOut}>
        <View style={[styles.row, styles.signOutButton]}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: Dimensions.get("screen").height / 9,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#7161ef",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    color: "white",
    fontSize: 18,
    paddingBottom: "3%",
  },
  row: {
    width: "100%",
    height: 80,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#7161ef",
    marginTop: "3%",
    justifyContent: "center",
  },
  account: {
    paddingLeft: "5%",
  },
  name: {
    color: "#7161ef",
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
  },
  email: {
    color: "#7161ef",
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  signOutButton: {
    width: Dimensions.get("screen").width,
    height: 40,
  },
  signOutText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    color: "red",
  },
});
