import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  doc,
  onSnapshot,
  arrayUnion,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import callingContext from '../components/callingContext';
import { useRoute } from '@react-navigation/native';
import { db} from '../Firebase Connectivity/Firebase';

const Conversation = ({ navigation }) => {
  const { user } = callingContext();
  const route = useRoute();
  const conversationID = route.params?.conversationId;
  const picURL = route.params?.pictureOfTheOtherPerson;
  const nameOfOtherPerson = route.params?.nameOfPerson;

  const [img, setImage] = useState();
  const [nameOfCurrentUserLoggedIn, setNameOfCurrentUserLoggedIn] = useState();

  const [messages, setMessages] = useState([]);
  const [newMessages,setNewMessages]=useState([])
  const [inputText, setInputText] = useState('');
  // let messages;

  useEffect(() => {
    const getCurrentUserProfilePic = async () => {
      const documentLocation = doc(db, 'listOfUsers', user.uid);
      const getDocument = await getDoc(documentLocation);
      if (getDocument.data().picURL) {
        setImage(getDocument.data().picURL);
        setNameOfCurrentUserLoggedIn(getDocument.data().name);
      }
    };
    getCurrentUserProfilePic();
  }, [user.uid]);

useEffect(() => {
  const fetchMessages = async () => {
    const conversationRef = doc(db, 'ConversationsOfUsers', conversationID);
    const gettingDoc=await getDoc(conversationRef)
    let getArrayOfMesssages;
    if(gettingDoc.exists){
      const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
        if(docSnapshot.data()){
          // setNewMessages(docSnapshot.data().messages)
          getArrayOfMesssages = docSnapshot.data().messages;
          setMessages([...getArrayOfMesssages].reverse());
          
        }

        // messages=newMessages.reverse
        });




       
      
      return unsubscribe;

    }
    

    
  };

  fetchMessages();
}, [conversationID, user, img, picURL]);


  const sendMessage = () => {
    
    
    
    if (inputText.trim().length > 0) {
      const message = {
        id: Date.now(),
        text: inputText,
        createdAt: new Date().toISOString(),
        user: {
          id: user.uid,
          name: nameOfCurrentUserLoggedIn,
          avatar: img,
        }
      };
      sendingMessageToFirebase(message)
    }
   
    setInputText('');
  };

  const sendingMessageToFirebase=async(messageToBeStored)=>{
    
    const convoRef = doc(db, 'ConversationsOfUsers', conversationID);
    if(messageToBeStored.text!=='')
    {
      await updateDoc(convoRef, {
        messages: arrayUnion(messageToBeStored),
      });  
    }
  }

  const renderItem = ({ item }) => {
    console.log('This is item:', item)
    return (
      <View
        style={[
          styles.messageContainer,
          item.user.id === user.uid ? styles.myMessage : styles.otherMessage,
        ]}>

        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={{fontSize:10, color:'red'}}>{item.user.name}</Text>
      </View>
    );
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Add your styles here


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dbf5ff',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
  },
  messageText: {
    fontSize: 16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Conversation;

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   StyleSheet,
// } from "react-native";
// import {
//   doc,
//   onSnapshot,
//   arrayUnion,
//   updateDoc,
//   getDoc,
// } from "firebase/firestore";
// import { db, getDownloadURL } from "../Firebase Connectivity/Firebase";
// import callingContext from "../components/callingContext";
// import { useRoute } from "@react-navigation/native";
// import { GiftedChat } from "react-native-gifted-chat";

// const Conversation = ({ navigation }) => {
//   const { user } = callingContext();
//   const route = useRoute();
//   const conversationID = route.params?.conversationId;
//   const picURL = route.params?.pictureOfTheOtherPerson;
//   const nameOfOtherPerson = route.params?.nameOfPerson;

//   const [messages, setMessages] = useState([]);

//   const [img, setImage] = useState();
//   const [nameOfCurrentUserLoggedIn, setNameOfCurrentUserLoggedIn] = useState();

//   useEffect(() => {
//     const getCurrentUserProfilePic = async () => {
//       const documentLocation = doc(db, "listOfUsers", user.uid);
//       const getDocument = await getDoc(documentLocation);
//       if (getDocument.data().picURL) {
//         setImage(getDocument.data().picURL);
//         setNameOfCurrentUserLoggedIn(getDocument.data().name);
//       }
//     };
//     getCurrentUserProfilePic();
//   }, [user.uid]);


//   // Fetching messages and formats it in a way gifted chat can understand.
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const conversationRef = doc(db, "ConversationsOfUsers", conversationID);
//       const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
//         const data = docSnapshot.data();
//         if (data && data.messages) {
//           const transformedMessages = data.messages.map((msg) => ({
//             _id: msg.id,
//             text: msg.text,
//             createdAt: new Date(msg.createdAt),
//             user: {
//               _id: msg.user.id,
//               name: msg.user.name,
//               avatar: msg.user.avatar,
//             },
//           }));
//           console.log("Transformed messages:", transformedMessages);
//           setMessages(transformedMessages.reverse());
//         }
//       });
  
//       return unsubscribe;
//     };
  
//     fetchMessages();
//   }, [conversationID, user, img, picURL]);
  

//   const updatingConvo = async (id, text, createdAt, user) => {
//     const convoRef = doc(db, "ConversationsOfUsers", conversationID);
//     await updateDoc(convoRef, {
//       messages: arrayUnion({
//         id: id,
//         text: text,
//         createdAt: createdAt,
//         user: user,
//       }),
//     });
//   };

//   const onSend = useCallback(
//     (messages = []) => {
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, messages)
//       );
//       const { _id, text, createdAt, user } = messages[0];
//       updatingConvo(_id, text, createdAt, user);
//     },
//     [img]
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       {img && (
//                 <GiftedChat
//                 messages={messages}
//                 showAvatarForEveryMessage={true}
//                 onSend={(messages) => onSend(messages)}
//                 user={{
//                   _id: user.uid,
//                   name: nameOfCurrentUserLoggedIn,
//                   avatar: img,
//                 }}
//               />
//             )}
//           </View>
//         );
//       };
// export default Conversation;
// import React, { useEffect, useState,useCallback} from "react";
// import { Text,View,TouchableOpacity, TextInput, FlatList, StyleSheet, } from "react-native";
// import { doc, onSnapshot, arrayUnion, updateDoc, getDoc} from "firebase/firestore";
// import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
// import callingContext from '../components/callingContext';
// import { useRoute } from "@react-navigation/native"
// import { GiftedChat } from 'react-native-gifted-chat'





// const Conversation = ({ navigation }) => {
//   const {user}=callingContext()
//   const route = useRoute()
//   const conversationID = route.params?.conversationId
//   const picURL = route.params?.pictureOfTheOtherPerson
//   const nameOfOtherPerson= route.params?.nameOfPerson


//   const [messages, setMessages] = useState([]);

//   const [img,setImage]=useState()
//   const [namrOfCurrentUserLoggedIn,seteNameOfCurrentUserLoggedIn]=useState()

//   console.log('Stuff:', nameOfOtherPerson, picURL, conversationID)

//   useEffect(()=>{
//     const gettingCurrentUserLoggedInProfilePic=async()=>{
//       const documentLocation=doc(db,'listOfUsers', user.uid)
//       const getDocument=await getDoc(documentLocation)
//       if (getDocument.data().picURL){
//         setImage(getDocument.data().picURL)
//         seteNameOfCurrentUserLoggedIn(doc.data().name)
//       }
//       console.log('Persons profile picture : ', getDocument.data().picURL);
//     }
//     gettingCurrentUserLoggedInProfilePic()
//   },[user.uid])





// useEffect(() => {
//   const fetchMessages = async () => {
//     const conversationRef = doc(db, "ConversationsOfUsers", conversationID);
//     const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
//       // const data = docSnapshot.data();
//       // if (data && data.messages) {
        
//         const transformedMessages = docSnapshot.map((msg) => ({
//           _id: doc.data(),id,
//           text: msg.userInput,
//           createdAt: new Date(msg.dateTime),
//           user: namrOfCurrentUserLoggedIn
//           }));
//         console.log("Avatar URL:", user.uid === user.uid ? img : picURL); 
//         console.log("Transformed messages:", transformedMessages);
//         setMessages(transformedMessages.reverse());
//       // }
//     });

//     return unsubscribe;
//   };

//   fetchMessages();
// }, [conversationID, user,img]);



// const updatingConvo=async(id,text,createdAt,user)=>{
//   const convoRef = doc(db, "ConversationsOfUsers", conversationID);
//   await updateDoc(convoRef, {
//     id:id,
//     messages: arrayUnion({ ...text}),
//     dateTime: createdAt,
//     user:user,

//   });
// }


// const onSend = useCallback((messages = []) => {
//   console.log("Sending messages:", messages);
//   setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//   const {_id,text,createdAt,user}=messages[0]
//   updatingConvo(_id,text,createdAt,user)
// }, [img])






//   return (
//     <View style={{flex:1}}>
//     {
//       img &&
//         <GiftedChat
//           messages={messages}
//           showAvatarForEveryMessage={true}
//           onSend={messages => onSend(messages)}
//           user={{
//         _id: user.uid,
//         name:namrOfCurrentUserLoggedIn,
//         avatar: img
//       }}
//     />
//     }
//     </View>
    
//   )
// }
// export default Conversation;

 {/* {
      img &&
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
        _id: user.uid,
        avatar: img
      }}
    />
    } */}

//   const [messages, setMessages] = useState([]);
//   const { user } = callingContext();
//   const [img,setImage]=useState()

//     useEffect(()=>{
//       const gettingCurrentUserLoggedInProfilePic=async()=>{
//         const documentLocation=doc(db,'listOfUsers', user.uid)
//         const getDocument=await getDoc(documentLocation)
//         if (getDocument.data().picURL){
//           setImage(getDocument.data().picURL)
//         }
        
//         console.log('Persons profile picture : ', getDocument.data().picURL);
//       }
//       gettingCurrentUserLoggedInProfilePic()
//     },[user.uid])



 

// useEffect(() => {
//   const fetchMessages = async () => {
//     const conversationRef = doc(db, "ConversationsOfUsers", conversationID);
//     const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
//       const data = docSnapshot.data();
//       if (data && data.messages) {
        
//         const transformedMessages = data.messages.map((msg) => ({
//           _id: msg.dateTime,
//           text: msg.userInput,
//           createdAt: new Date(msg.dateTime),
//           user: {
//             _id: msg.userLoggdInID,
//             name: msg.userLoggdInID === user.uid ? "You" : nameOfOtherPerson,
//             avatar:msg.userLoggdInID === user.uid? img:picURL ,
//           },
          
//         }));
//         console.log("Avatar URL:", user.uid === user.uid ? img : picURL); 
//         console.log("Transformed messages:", transformedMessages);
//         setMessages(transformedMessages.reverse());
//       }
//     });

//     return unsubscribe;
//   };

//   fetchMessages();
// }, [conversationID, user,img]);


//   const updatingConvo = async (newMessage) => {
//     const messageToStore = {
//       userInput: newMessage.text,
//       userLoggdInID: newMessage.user._id,
//       dateTime: newMessage.createdAt.toISOString()
//     };
  
//     const convoRef = doc(db, "ConversationsOfUsers", conversationID);
//     await updateDoc(convoRef, {
//       messages: arrayUnion({ ...messageToStore }),
//       dateTime: new Date().toISOString()
//     });
//   };
  

//   const onSend = useCallback((messages = []) => {
//     const newMessage = messages[0];
    
//     updatingConvo(newMessage);
//     console.log("Sending messages:", messages);
//     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//   }, [img])

//   console.log('This is IMAGE', img)





// const Conversation=({navigation})=>{
//     const route = useRoute()
//     const conversationID = route.params?.conversationId
//     const picURL=route.params?.pictureOfTheOtherPerson
//     // console.log('The other guys pic', picURL)
//     const [messages, setMessages] = useState([]);
//     const [data,setData]=useState([])
//     const [userInput,setUserInput]=useState()
//     const {user}=callingContext();
    


//     const findingUsersPfp=async()=>{
//       const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', user.uid);
//       const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
//       return getDocument.data().picURL;
//     }
   


//     useEffect(() => {
//       const unsub = onSnapshot(doc(db, "ConversationsOfUsers", conversationID), (doc) => {
//         const messagesData = doc.data().messages.map(message => {
//           return {
//             _id: message._id,
//             text: message.text,
//             createdAt: new Date(message.createdAt),
//             user: {
//               _id: message.user._id,
//               avatar: message.user.avatar
//             }
//           }
//         });
//         setMessages(messagesData);
//       });
  
//       return () => {
//         unsub()
//       }
//     }, [])


//       const updatingConvo=async(newMessage)=>{
//         const convoRef= doc(db, "ConversationsOfUsers", conversationID);
//         await updateDoc(convoRef, {
//             messages: arrayUnion(newMessage),
//             dateTime:new Date().toISOString()
            
//         });
//     }
 
  
//     const onSend = useCallback((messages = []) => {
//       const newMessage=messages[0]
//       updatingConvo(newMessage)
//       setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//     }, [])



//     return(
//       <GiftedChat
//       messages={messages}
//       onSend={messages => onSend(messages)}
//       user={{
//         _id: user.uid,
//         avatar:picURL
//       }}
//     />

//     )
    
// }
// export default Conversation;


// const styles = StyleSheet.create({
//         container: {
            
//             flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 padding: 10,
//                 borderTopWidth: 1,
//                 borderColor: 'lightgrey',
//                 position: 'absolute',
//                 bottom:0,
//                 left:0
//         },
//         textInputStyle: {
//           flex: 1,
//           minHeight: 40,
//           maxHeight: 100,
//           margin: 12,
//           borderWidth: 1,
//           padding: 10,
//           borderRadius: 20,
//         },
//         submitButton: {
//           backgroundColor: 'blue',
//           paddingHorizontal: 20,
//           paddingVertical: 10,
//           borderRadius: 20,
//         },
//         submitButtonText: {
//           color: 'white',
//           fontWeight: 'bold',
//         },
//         myMessage: {
//           backgroundColor: 'blue',
//           color: 'white',
//           padding: 15,
//           borderRadius: 20,
//           marginBottom: 5,
//           alignSelf: 'flex-end',
//           width:200
//         },
//         theirMessage: {
//           backgroundColor: 'white',
//           color: 'black',
//           padding: 10,
//           borderRadius: 20,
//           marginBottom: 5,
//           alignSelf: 'flex-start',
//         },
//       });



       // useEffect(() => {
    //   setMessages([
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ])
    // }, [])
        // <View style={{flex:1}}>
        // <FlatList 
        // data={data}
        // renderItem={renderItem}
        // contentContainerStyle={{ paddingTop: 10 }}
        // />
        // <View style={styles.container}>
        
        // <TextInput
        //   value={userInput}
        //   onChangeText={(value) => {
        //     setUserInput(value);
        //   }}
        //   placeholder='Enter A Message'
        //   style={styles.textInputStyle}
        //   multiline={true}
        // />
        
        // <TouchableOpacity  
        // style={styles.submitButton}
        // onPress={()=>{
        //     updatingConvo()
        //     setUserInput(null)
        // }}>
        //     <Text>Submit</Text>
        // </TouchableOpacity>

        // </View>
        // </View>

    // useEffect(()=>{
        
    // },[])

    // const 

    
    // const renderItem = ({ item }) => {
    //     // console.log(item)

    //     // console.log('It gets here:', user.uid)
    //     const isMyMessage = item.userLoggdInID === user.uid
    //     // console.log('is my message', isMyMessage)
    //     const messageStyle = isMyMessage ? styles.myMessage : styles.theirMessage;

    //     return <Text style={messageStyle}>{item.userInput}</Text>;
    //   };


    // useEffect(() => {
//   const fetchMessages = async () => {
//     const conversationRef = doc(db, "ConversationsOfUsers", conversationID);
//     const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
//       const data = docSnapshot.data();
//       if (data && data.messages) {
        
//         const transformedMessages = data.messages.map((msg) => ({
//           _id: msg.dateTime,
//           text: msg.userInput,
//           createdAt: new Date(msg.dateTime),
//           user: {
//             _id: msg.userLoggdInID,
//             name: msg.userLoggdInID === user.uid ? "You" : nameOfOtherPerson,
//             avatar:msg.userLoggdInID === user.uid? img:picURL ,
//           },
          
//         }));
//         console.log("Avatar URL:", user.uid === user.uid ? img : picURL); 
//         console.log("Transformed messages:", transformedMessages);
//         setMessages(transformedMessages.reverse());
//       }
//     });

//     return unsubscribe;
//   };


// const updatingConvo = async (newMessage) => {
//   const messageToStore = {
//     userInput: newMessage.text,
//     userLoggdInID: newMessage.user._id,
//     dateTime: newMessage.createdAt.toISOString()
//   };

 

// };

//   fetchMessages();
// }, [conversationID, user,img]);