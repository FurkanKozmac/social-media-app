import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import { FontAwesome } from "@expo/vector-icons";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  FIREBASE_STORAGE,
} from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const SharePostScreen = () => {
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    lastName: "",
    userID: "",
  });
  const user = FIREBASE_AUTH.currentUser;
  const storage = FIREBASE_STORAGE;
  const firestore = FIREBASE_FIRESTORE;

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
          //      console.log("User data:", userData);
        });
      } catch (error) {
        console.error("Cannot fetch data", error);
      }
    };
    fetchUserData();
    setComment("");
    setImage(null);
  }, []);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const userName = userInfo.name + " " + userInfo.lastName;

  const handleSetImage = async () => {
    const picker = ImagePicker;
    const status = await picker.getMediaLibraryPermissionsAsync();

    if (status.granted) {
      console.log("Permission granted.");

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      const source = { uri: result.assets[0].uri };
      console.log(source);
      setImage(source);
    } else {
      console.log("Permission denied.");
      picker.requestMediaLibraryPermissionsAsync();
    }
  };

  const handleStorage = async () => {
    const getBlobFromUri = async (uri) => {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      return blob;
    };

    try {
      const imageBlob = await getBlobFromUri(image.uri);

      const storageRef = ref(storage, `Images/image-${Date.now()}.png`);
      setIsUploading(true);
      const uploadTask = await uploadBytes(storageRef, imageBlob, "image/png");
      console.log("Image stored succesfully.");

      await getDownloadURL(storageRef).then((downloadURL) => {
        addDoc(collection(firestore, "posts"), {
          userName,
          imageURL: downloadURL,
          userID: userInfo.userID,
          userComment: comment,
        });
        setIsUploading(false);
        setVisible(true);
        setImage(null);
        setComment("");
      });
    } catch (error) {
      console.error("Cannot upload image.", error);
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share a Post</Text>
      </View>
      <View style={styles.setPost}>
        <TouchableOpacity
          style={{
            width: (Dimensions.get("screen").width * 80) / 100,
            height: (Dimensions.get("screen").width * 80) / 100,
            backgroundColor: "#dee2e6",
            marginTop: "8%",
            borderColor: "#7161ef",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
          onPress={handleSetImage}
        >
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: (Dimensions.get("screen").width * 80) / 100,
                height: (Dimensions.get("screen").width * 80) / 100,
                borderRadius: 8,
              }}
            />
          ) : (
            <>
              <FontAwesome name="file-photo-o" size={64} color="#7161ef" />
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  paddingTop: 8,
                  color: "#7161ef",
                }}
              >
                Choose photo from gallery
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { marginTop: "8%", marginBottom: "8%" }]}
          placeholder="Type comment"
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleStorage}
        disabled={isUploading}
      >
        {isUploading ? ( // Show activity indicator when uploading
          <Text style={styles.text}>
            <ActivityIndicator size="small" color="#e9ecef" /> Sending Post
          </Text>
        ) : (
          <Text style={styles.text}>
            <FontAwesome name="paper-plane" size={18} color="white" /> Share Now
          </Text>
        )}
      </TouchableOpacity>
      <Snackbar style={{backgroundColor: "#7161ef", color: "#e9ecef"}} visible={visible} onDismiss={() => setVisible(false)} duration={2000}>
        Post sent.
      </Snackbar>
    </View>
  );
};

export default SharePostScreen;

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
  setPost: {
    width: Dimensions.get("screen").width,
    alignItems: "center",
    borderColor: "#7161ef",
    marginTop: "6%",
  },
  input: {
    width: (Dimensions.get("screen").width * 80) / 100,
    height: 50,
    backgroundColor: "#dee2e6",
    padding: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    borderRadius: 8,
  },
  button: {
    width: (Dimensions.get("screen").width * 80) / 100,
    height: 50,
    backgroundColor: "#7161ef",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#e9ecef",
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
});
