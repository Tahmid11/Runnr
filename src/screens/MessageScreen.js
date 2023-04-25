import React, { useEffect, useState } from "react";
import { Text,View,TouchableOpacity ,Image, StyleSheet, FlatList} from "react-native";
import { query, onSnapshot,collection,where, getDoc, doc, getDocs } from "firebase/firestore";
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import callingContext from '../components/callingContext';
import Conversation from "./ConversationScreen";



const Message=({navigation})=>{
    const {user}=callingContext();
    const [conversations,setConversations]=useState([])

    useEffect(() => {
        const fetchConversationsAndPictures = async () => {
          const q = query(collection(db, "ConversationsOfUsers"), where('userWhoIsLoggedInID', "==", user.uid));
          const querySnapshot = await getDocs(q);
          const convoList = [];
      
          for (const docu of querySnapshot.docs) {
            const otherUserId = docu.data().theOtherUserInConversation;
            const picURL = await gettingTheProfile(otherUserId);
            const nameOfPerson=await gettingTheOtherPersonsName(otherUserId)
            convoList.push({ id: docu.id, picURL,nameOfPerson, ...docu.data() });
          }
      
          setConversations(convoList);
        };
      
        fetchConversationsAndPictures();
      
      }, [user.uid]);
      
      const gettingTheProfile = async (idOfUser) => {
        const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', idOfUser);
        const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
        return getDocument.data().picURL;
      };
      const gettingTheOtherPersonsName = async (idOfUser) => {
        const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', idOfUser);
        const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
        return getDocument.data().name;
      };
      console.log('this is conversations:',conversations)
      

    return (
        <View>
          <Text>Message screen</Text>
          <FlatList
            data={conversations}
            renderItem={({ item: conversation }) => (
              <TouchableOpacity
                key={conversation.id}
                onPress={() =>
                  navigation.navigate("Conversation", {
                    conversationId: conversation.id,
                    nameOfPerson: conversation.nameOfPerson,
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  width: "100%",
                }}
              >
                <Image
                  source={{ uri: conversation.picURL }}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ color: "black", fontSize: 16 }}>
                    {conversation.nameOfPerson}
                  </Text>
                  {/* Replace "Latest message" with the actual message */}

                  {
                   conversations.messages?(
                    <Text style={{ color: "gray", fontSize: 14 }}>{conversations.messages[conversations.messages.length]}</Text>
                   ):(<Text style={{ color: "gray", fontSize: 14 }}></Text>)
                  }
                  
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
}

export default Message;
