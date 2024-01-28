import { FirestorePost } from "@utils/types/types";
import { Text, View, StyleSheet, Image, ScrollView,Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { constStyles } from "@constants/Styles";
import BookmarkPost from "./BookmarkedPosts";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import CommentButton from "./CommentButton";
import EditDeletePost from "./EditDeletePost";
import LikeAThing from "@components/LikeAThing";
import firestore from '@react-native-firebase/firestore';
import { calculateTimeDifference } from "@utils/timeFunctions";

const PostListView = ({
  postsRef,
}: {
  postsRef:
    | FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>
    | FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;
}) => {
  const [posts, setPosts] = useState<FirestorePost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts((prevExpandedPosts)=> 
      prevExpandedPosts.includes(postId)
      ? prevExpandedPosts.filter((id)=> id !== postId)
      : [...prevExpandedPosts, postId]
    );
  };

  useEffect(() => {
    const subscriber = postsRef.onSnapshot((querySnapshot) => {
      if (querySnapshot) {
        const updatedPosts: FirestorePost[] = [];
        querySnapshot.forEach((doc) => {
          updatedPosts.push({
            content: doc.get("content"),
            uid: doc.get("uid"),
            timestamp: doc.get("timestamp"),
            displayName: doc.get("displayName"),
            post_id: doc.get("post_id"),
            likedArray: doc.get("likedArray"),
            photoURL: doc.get("photoURL"),
            bookmarkedPosts: doc.get("bookmarkedPosts"),
          } as FirestorePost);
        });
        setPosts(updatedPosts);
      }
    });
    return subscriber; 
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={{gap:12, marginVertical: 12}}>
        {posts
          ?.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
          .map((post) => (
            <View key={post.post_id} style={styles.postsContainer}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View
                  key={post.post_id}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}>
                  <Image
                    source={{ uri: post.photoURL }}
                    style={{ height: 35, aspectRatio: 1, borderRadius: 50 }}
                  />

                  <View>
                    <Text style={styles.name}>{post.displayName}</Text>
                    <Text>
                      {post.timestamp?.seconds &&
                        calculateTimeDifference(post.timestamp.toDate())}
                    </Text>
                  </View>

                </View>
                <BookmarkPost post={post} />
              </View>
              <View>
              <Pressable onPress={() => togglePostExpansion(post.post_id)} style={{paddingRight: 23}}>
                <Text style={constStyles.postText} numberOfLines={expandedPosts.includes(post.post_id) ? undefined : 4}>
                  {post.content}
                </Text>
                </Pressable>
                <View style={styles.labels}>
                  <LikeAThing post={post} firestoreRef={firestore().collection('Posts').doc(post.post_id)}/>
                  <CommentButton post={post} />
                </View>
              </View>
              <EditDeletePost post={post} />
            </View>
          ))}
      </ScrollView>
    </>
  );
};

export default PostListView;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    height: "100%",
  },
  button: {
    marginTop: 10,
  },
  postsContainer: {
    width: "100%",
    paddingLeft: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
    gap: 12,
  },
  filterButton: {
    borderColor: "black",
    borderWidth: 1,
    width: "40%",
    alignItems: "center",
  },
  labels: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  name: {
    fontSize: 19,
  },
  commentContainer: {
    width: "100%",
    paddingLeft: 10,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "white",
    gap: 8,
  },
});
