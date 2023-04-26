import React, { useEffect, useState,useCallback} from "react";
import { Text,View,TouchableOpacity, TextInput, FlatList, StyleSheet, } from "react-native";
import { doc, onSnapshot, arrayUnion, updateDoc, getDoc} from "firebase/firestore";
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import callingContext from '../components/callingContext';
import { useRoute } from "@react-navigation/native"
import { GiftedChat } from 'react-native-gifted-chat'




const Conversation = ({ navigation }) => {
  const route = useRoute()
  const conversationID = route.params?.conversationId
  const picURL = route.params?.pictureOfTheOtherPerson
  const nameOfOtherPerson= route.params?.nameOfOtherPerson


  const [messages, setMessages] = useState([]);
  const { user } = callingContext();
  const [img,setImage]=useState()

    useEffect(()=>{
      const gettingCurrentUserLoggedInProfilePic=async()=>{
        const documentLocation=doc(db,'listOfUsers', user.uid)
        const getDocument=await getDoc(documentLocation)
        if (getDocument.data().picURL){
          setImage(getDocument.data().picURL)
        }
        
        console.log('Persons profile picture : ', getDocument.data().picURL);
      }
      gettingCurrentUserLoggedInProfilePic()
    },[user.uid])



 

useEffect(() => {
  const fetchMessages = async () => {
    const conversationRef = doc(db, "ConversationsOfUsers", conversationID);
    const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data && data.messages) {
        
        const transformedMessages = data.messages.map((msg) => ({
          _id: msg.dateTime,
          text: msg.userInput,
          createdAt: new Date(msg.dateTime),
          user: {
            _id: msg.userLoggdInID,
            name: msg.userLoggdInID === user.uid ? "You" : nameOfOtherPerson,
            avatar:msg.userLoggdInID === user.uid? img:picURL ,
          },
          
        }));
        console.log("Avatar URL:", user.uid === user.uid ? img : picURL); 
        console.log("Transformed messages:", transformedMessages);
        setMessages(transformedMessages.reverse());
      }
    });

    return unsubscribe;
  };

  fetchMessages();
}, [conversationID, user,img]);


  const updatingConvo = async (newMessage) => {
    const messageToStore = {
      userInput: newMessage.text,
      userLoggdInID: newMessage.user._id,
      dateTime: newMessage.createdAt.toISOString()
    };
  
    const convoRef = doc(db, "ConversationsOfUsers", conversationID);
    await updateDoc(convoRef, {
      messages: arrayUnion({ ...messageToStore }),
      dateTime: new Date().toISOString()
    });
  };
  

  const onSend = useCallback((messages = []) => {
    const newMessage = messages[0];
    
    updatingConvo(newMessage);
    console.log("Sending messages:", messages);
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [img])

  console.log('This is IMAGE', img)

  return (
    <View style={{flex:1}}>
    {
      img &&
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
        _id: user.uid,
        avatar: img
      }}
    />
    }
    </View>
    
  )
}
export default Conversation;






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


const styles = StyleSheet.create({
        container: {
            
            flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                borderTopWidth: 1,
                borderColor: 'lightgrey',
                position: 'absolute',
                bottom:0,
                left:0
        },
        textInputStyle: {
          flex: 1,
          minHeight: 40,
          maxHeight: 100,
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderRadius: 20,
        },
        submitButton: {
          backgroundColor: 'blue',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 20,
        },
        submitButtonText: {
          color: 'white',
          fontWeight: 'bold',
        },
        myMessage: {
          backgroundColor: 'blue',
          color: 'white',
          padding: 15,
          borderRadius: 20,
          marginBottom: 5,
          alignSelf: 'flex-end',
          width:200
        },
        theirMessage: {
          backgroundColor: 'white',
          color: 'black',
          padding: 10,
          borderRadius: 20,
          marginBottom: 5,
          alignSelf: 'flex-start',
        },
      });



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