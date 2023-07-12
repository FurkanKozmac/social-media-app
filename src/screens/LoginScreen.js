import {
  Alert,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const auth = FIREBASE_AUTH;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    //  console.log(response);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch {
      Alert.alert("Warning", "Invalid email or password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.row, { justifyContent: "center", marginTop: 0 }]}>
          <Text style={styles.greet}>SocialMediaApp</Text>
        </View>
      </TouchableWithoutFeedback>
      <View
        style={[
          styles.row,
          {
            flex: 2,
            borderTopStartRadius: 18,
            borderTopEndRadius: 18,
            backgroundColor: "#e9ecef",
          },
        ]}
      >
        <Text
          style={[
            styles.greet,
            { color: "#7161ef", fontSize: 24, paddingTop: "5%" },
          ]}
        >
          Log in to your account
        </Text>
        <TextInput
          style={[styles.input, { marginTop: "5%" }]}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={[styles.input, { marginTop: "3%" }]}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            color: "#7161ef",
            marginTop: "5%",
            fontFamily: "Poppins_500Medium",
          }}
        >
          Don't have an account? No problem.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#7161ef",
  },
  row: {
    flex: 1,
    alignItems: "center",
  },

  greet: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },

  input: {
    width: (Dimensions.get("screen").width * 80) / 100,
    height: 60,
    backgroundColor: "#dee2e6",
    padding: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    borderRadius: 8,
  },

  button: {
    width: (Dimensions.get("screen").width * 80) / 100,
    height: 60,
    backgroundColor: "#7161ef",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },

  text: {
    color: "#e9ecef",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
});
