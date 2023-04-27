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
            const messagesRef = collection(db, "ConversationsOfUsers", docu.id, "messages");
            const messagesSnapshot = await getDocs(messagesRef);
            const messages = messagesSnapshot.docs.map((messageDoc) => messageDoc.data());
        
            convoList.push({ id: docu.id, picURL, nameOfPerson, messages, ...docu.data() });
          }
          
          setConversations(convoList)
        };
      
        fetchConversationsAndPictures();
      
      }, [user.uid]);

      // Import the required functions from 'firebase/firestore'

// ... other imports and code

useEffect(() => {
  const fetchConversations = async () => {
    const userConversationsRef = collection(db, "ConversationsOfUsers");
    const q = query(userConversationsRef, where("userWhoIsLoggedInID", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversations = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({ id: doc.id, ...data });
      });
      setConversations(conversations);
    });
    console.log(conversations)

    return unsubscribe;
  };

  fetchConversations();
}, [user]);

      
      const gettingTheProfile = async (idOfUser) => {
        console.log('Geting the profile pic of the other person', idOfUser)
        const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', idOfUser);
        const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
        console.log('This is the other persons profile picture', getDocument.data().picURL)
        return getDocument.data().picURL;
      };
      const gettingTheOtherPersonsName = async (idOfUser) => {
        const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', idOfUser);
        const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
        return getDocument.data().name;
      };
      // console.log('this is conversations:',conversations.messages[0].userInput)
      
      

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
                    pictureOfTheOtherPerson: conversation.picURL
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

                  {
                   conversation.messages.length>0?(
                    <Text style={{ color: "gray", fontSize: 14 }}>{conversation.messages[conversation.messages.length - 1].userInput}</Text>
                   ):(<Text style={{ color: "gray", fontSize: 14 }}>Something</Text>)
                  }
                  {/* <Text>{conversation.messages}</Text> */}
                  
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
}

export default Message;
