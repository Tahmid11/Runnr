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
                listOfConvos.push({conversationID:doc.id,idOfOtherPerson:doc.data().peopleWhoAreMessagingEachOther[0], messages:doc.data().messages, picture:null})
              }
              if(doc.data().peopleWhoAreMessagingEachOther[1]!==user.uid){
                listOfConvos.push({conversationID:doc.id,idOfOtherPerson:doc.data().peopleWhoAreMessagingEachOther[1], messages:doc.data().messages, picture:null})

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
                details.push({id:doc.id,idOfConversation:conversation.conversationID,nameOfOtherPerson:doc.data().name, messages:conversation.messages, picture:doc.data().picURL})

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

            return(
            <View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                width: "100%",
              }}
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
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
              <Text style={{ color: "red", fontSize: 16 }}>{convo.nameOfOtherPerson}</Text>
              <Text>Hey</Text>
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
{/* <FlatList
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
                  <Text>{conversation.messages}</Text>
                  
                </View>
              </TouchableOpacity>
            )}
             keyExtractor={(item) => item.id}
           />  */}


           // Old attempt didnt work..
    // const route = useRoute()
    // const matchedWithUserPic = route.params?.otherUserPicture
    // const theOtherPersonsName= route.params?.otherUsersName
    // console.log('Matchedwithuser picture:',matchedWithUserPic)
    // console.log('the other persons name:', theOtherPersonsName)





    // if (convoID){
    //   console.log('This entering the if statement')
    //   let userIds=convoID.split(':')
    //   console.log('user something:', userIds[0], 'user something else', userIds[1])
    // }
    // // console.log(matchedWithUser, IDOfOtherUser)
    // // let generatedID=generateCombinedId(user.id,IDOfOtherUser)
    // console.log('This is the convo ID', convoID)
    
    

    // Splitting ID to see whos what!


      







  

  // Creating a conversation:
  // function generateCombinedId(userA_id, userB_id){
  //   const array=[]
  //   array.push(userA_id,userB_id)
  //   array.sort()

  //   return `${array[0]}:${array[1]}`;
  // };

  // const gettingTheProfile = async (idOfUser) => {
  //   console.log('Geting the profile pic of the other person', idOfUser)
  //   const getProfilePicOfOtherUserInConvo = doc(db, 'listOfUsers', idOfUser);
  //   const getDocument = await getDoc(getProfilePicOfOtherUserInConvo);
  //   console.log('This is the other persons profile picture', getDocument.data().picURL)
  //   return getDocument.data().picURL;
  // };

  //   useEffect(() => {
  //       const fetchConversationsAndPictures = async () => {
  //         const q = query(collection(db, "ConversationsOfUsers"), where('_id', "==", generatedID ));
  //         const querySnapshot = await getDocs(q);
  //         console.log('This is query snapshot:',querySnapshot)
  //         const convoList = [];
      
  //         for (const docu of querySnapshot.docs) {
  //           // const otherUserId = IDOfOtherUser
  //           const picURL = await gettingTheProfile(otherUserId);
  //           const nameOfPerson=matchedWithUser.name
  //           convoList.push({ id: docu.id, picURL, nameOfPerson, messages, ...docu.data() });
  //         }
  //         setConversations(convoList)
  //       };
  //       fetchConversationsAndPictures();
  //     }, [user.uid]);

  // New attempt Idea:
  // 1) Get the current user id and fetch all documents in 'ConversationsOfUsers', where the fields inside of it include 
  // the current user logged in.
  // 2) Do two seperate ones for each field.
  // 3) Get them and remove and duplicates.

   // theListOfConversations.forEach((doc)=>{
        //   const docRef = doc(db, "listOfUsers", theListOfConversations.id);
        //   const docSnap = await getDoc(docRef);


        // })