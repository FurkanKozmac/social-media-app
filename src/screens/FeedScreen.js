import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "../../firebaseConfig";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const FeedScreen = () => {
  const [postData, setPostData] = useState([]);
  const firestore = FIREBASE_FIRESTORE;

  const fetchPostData = async () => {
    const querySnapshot = await getDocs(collection(firestore, "posts"));
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });
    setPostData(posts.reverse());
  };
  useEffect(() => {
    fetchPostData();
  }, []);

  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={fetchPostData}>
          <Text style={styles.title}>SocialMediaApp</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={postData}
        renderItem={({ item }) => {
          return (
            <View style={styles.postContainer}>
              <View
                style={[
                  styles.userContainer,
                  {
                    flex: 0.4,
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                    color: "#8370ef",
                    paddingLeft: 15,
                    fontSize: 12,
                  }}
                >
                  {item.userName}
                </Text>
              </View>
              <View
                style={[
                  styles.userContainer,
                  {
                    flex: 4.5,
                  },
                ]}
              >
                <Image style={{ flex: 1 }} source={{ uri: item.imageURL }} />
              </View>
              <View
                style={[
                  styles.userContainer,
                  {
                    flex: 0.4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    color: "#8370ef",
                    paddingLeft: 15,
                    fontSize: 12,
                  }}
                >
                  Comment: {item.userComment}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fef9ff",
  },

  header: {
    width: Dimensions.get("screen").width,
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

  postContainer: {
    width: Dimensions.get("screen").width,
    height: 500,
    borderBottomColor: "#8370ef",
    borderBottomWidth: 0.2,
    marginBottom: 5,
  },

  userContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
