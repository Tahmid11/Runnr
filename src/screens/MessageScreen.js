// The list of different conversations.


import React, { useEffect, useState } from "react";
import { Text,View,TouchableOpacity ,Image, StyleSheet, FlatList} from "react-native";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import callingContext from '../components/callingContext';
// import Conversation from "./ConversationScreen";








const Message=({navigation})=>{
    const {user}=callingContext();

  const [theListOfConversations,setListOfConversations]=useState([])
  // const [imageOfOtherPerson,setImageOfOtherPerson]=useState([])
  // const [nameOfOtherPeople,setNameOfOtherPeople]=useState([])
  const [listOfAllDetails,setListOfAllDetails]=useState([])

    useEffect(()=>{
      const fetchingConversations=()=>{
        console.log('Fetch conversations is running')
        const conversationRef = collection(db, "ConversationsOfUsers");
        
        const q=query(conversationRef,where('peopleWhoAreMessagingEachOther', 'array-contains', user.uid))
        console.log(q)
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            listOfConvos=[]
            querySnapshot.forEach((doc) => {
              console.log('Enters first use effect.')
              if(doc.data().peopleWhoAreMessagingEachOther[0]!==user.uid)
              {
                listOfConvos.push({conversationID:doc.id,idOfOtherPerson:doc.data().peopleWhoAreMessagingEachOther[0], 
                  messages:doc.data().messages, picture:null})
              }
              if(doc.data().peopleWhoAreMessagingEachOther[1]!==user.uid){
                listOfConvos.push({conversationID:doc.id,idOfOtherPerson:doc.data().peopleWhoAreMessagingEachOther[1], 
                  messages:doc.data().messages, picture:null})

              }

            });
        setListOfConversations(listOfConvos)
  
      });
      return unsubscribe;
    // }
    
      }
      const unsubscribe = fetchingConversations();
      return () => {
        unsubscribe();
      };

    },[user.uid])


    useEffect(()=>{
      const gettingOtherPeoplesProfilePicture=async()=>{
        console.log('GettingOtherPeroplesporifle picutres is running')
        console.log('Enters second use effect.')
        
        const getReference=await getDocs(collection(db,'listOfUsers'))
        // const imageOfOtherGuy=[]
        // const nameOfOtherGuy=[]
        const details=[]
        

        getReference.forEach((doc)=>{
          if(theListOfConversations){
            theListOfConversations.forEach((conversation)=>{
              if(doc.id===conversation.idOfOtherPerson){
                details.push({id:doc.id,
                  idOfConversation:conversation.conversationID,
                  nameOfOtherPerson:doc.data().name, messages:conversation.messages, 
                  picture:doc.data().picURL})
              }
            })
            
          }

        })
        setListOfAllDetails(details)

      }
      if (theListOfConversations.length > 0) {
        gettingOtherPeoplesProfilePicture();
      }
     
    },[theListOfConversations])






      
      

    return (
        <View>
          <FlatList
          data={listOfAllDetails}
          renderItem={({item:convo})=>{
            return(<View><TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                width: "100%",}}
              key={convo.id}
              onPress={() =>
                navigation.navigate("Conversation", {
                  conversationId: convo.idOfConversation,
                  nameOfPerson: convo.nameOfOtherPerson,
                  pictureOfTheOtherPerson: convo.picture
                })}
            >
              <Image source={{ uri: convo.picture }}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
              />
              <View
                  style={{flexDirection: "column",alignItems: "flex-start",}}
              >
              <Text style={{ color: "black", fontSize: 16, fontWeight:'bold', paddingLeft:10 }}>{convo.nameOfOtherPerson}</Text>
              </View>
            </TouchableOpacity>
            </View>
            )
          }}

          />
           
        </View>
      );
}

export default Message;
