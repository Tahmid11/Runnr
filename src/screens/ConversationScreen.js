import React, { useEffect, useState } from "react";
import { Text,View,TouchableOpacity, TextInput, FlatList, StyleSheet, KeyboardAvoidingView,plat} from "react-native";
import { doc, onSnapshot, arrayUnion, updateDoc} from "firebase/firestore";
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import callingContext from '../components/callingContext';
import { useRoute } from "@react-navigation/native"




const Conversation=({navigation})=>{
    const route = useRoute()
    const conversationID = route.params?.conversationId
    const [data,setData]=useState([])
    const [userInput,setUserInput]=useState()
    const {user}=callingContext();
    let id;



    useEffect(()=>{

        const unsub = onSnapshot(doc(db, "ConversationsOfUsers", conversationID), (doc) => {
            setData(doc.data().messages)    
        });
        return()=>{
            unsub()
        }
        
        
    },[])

    // useEffect(()=>{
        
    // },[])

    // const 

    
    const renderItem = ({ item }) => {
        // console.log(item)

        // console.log('It gets here:', user.uid)
        const isMyMessage = item.userLoggdInID === user.uid
        // console.log('is my message', isMyMessage)
        const messageStyle = isMyMessage ? styles.myMessage : styles.theirMessage;

        return <Text style={messageStyle}>{item.userInput}</Text>;
      };
      const updatingConvo=async()=>{
        const convoRef= doc(db, "ConversationsOfUsers", conversationID);
        await updateDoc(convoRef, {
            messages: arrayUnion({userInput,userLoggdInID:user.uid})
            
        });
    }



    return(
        <View style={{flex:1}}>
        <FlatList 
        data={data}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10 }}
        />
        <View style={styles.container}>
        
        <TextInput
          value={userInput}
          onChangeText={(value) => {
            setUserInput(value);
          }}
          placeholder='Enter A Message'
          style={styles.textInputStyle}
          multiline={true}
        />
        
        <TouchableOpacity  
        style={styles.submitButton}
        onPress={()=>{
            updatingConvo()
            setUserInput(null)
        }}>
            <Text>Submit</Text>
        </TouchableOpacity>

        </View>
        </View>

    )
    
}
export default Conversation;


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
      