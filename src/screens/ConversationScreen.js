// Indivial Message screen between user and the other person.
import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,FlatList,SafeAreaView,StyleSheet,Image,} from 'react-native';
import {doc,onSnapshot,arrayUnion,updateDoc,getDoc,} from "firebase/firestore";
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
        });
      
      return unsubscribe;
    }
  };

  fetchMessages();
}, [conversationID, user, img, picURL]);


  const sendMessage = () => {
    if (inputText.length > 0) {
      const message = {
        text: inputText,
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
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          multiline={true}
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

