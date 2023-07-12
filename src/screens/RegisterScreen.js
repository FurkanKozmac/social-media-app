import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_FIRESTORE;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      //console.log(response);
      const docRef = await addDoc(collection(firestore, "userInfo"), {
        name,
        lastName,
        email,
        password,
        userID: response.user.uid,
      });
      //console.log("Doc written by id:", docRef.id);
    } catch (error) {
      console.error("Cannot sign up. Please try again.", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.row, { justifyContent: "center", marginTop: 0 }]}>
          <Text style={styles.greet}>Social Media App</Text>
        </View>
      </TouchableWithoutFeedback>
      <View
        style={[
          styles.row,
          {
            flex: 3,
            borderTopStartRadius: 18,
            borderTopEndRadius: 18,
            backgroundColor: "#e9ecef",
          },
        ]}
      >
        <Text
          style={[
            styles.greet,
            { color: "#7161ef", fontSize: 24, paddingTop: "7%" },
          ]}
        >
          Create an account
        </Text>
        <TextInput
          style={[styles.input, { marginTop: "7%" }]}
          placeholder="First Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={[styles.input, { marginTop: "3%" }]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={[styles.input, { marginTop: "3%" }]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { marginTop: "3%" }]}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
    paddingTop: "10%",
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
