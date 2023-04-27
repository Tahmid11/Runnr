

import CustomModal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { Dropdown } from 'react-native-element-dropdown';
// Date Time Picker
import DatePicker,{ getFormatedDate, getToday } from 'react-native-modern-datepicker';

// Image Picker= https://docs.expo.dev/versions/latest/sdk/imagepicker/#mediatypeoptions

import React, { useState, useRef, useEffect} from 'react'
import { ImageBackground, Text, View, Button, TextInput, TouchableOpacity, Modal,Image} from 'react-native'
// import TinderCard from 'react-tinder-card'
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where } from "firebase/firestore";
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import Swiper from 'react-native-deck-swiper';
import callingContext from '../components/callingContext';
import { useNavigation } from '@react-navigation/native';
import Message from "./MessageScreen";




const Match = ({navigation}) => {


  const [listOfUsers,setListOfUsers]=useState([])
  
  const {user}=callingContext();
  const [matchFound, setMatchFound] = useState(false);

  const[imageOfMatchedUser, setImageOfMatchedUser]=useState(null)
  const[imageOfCurrentUser, setImageOfCurrentUser]=useState(null)

  const[getIDOfOtherUser,setIDOfOtherUser]=useState(null)

  const [convoCheckingFinished, setConvoCheckingFinished] = useState(false);




  useEffect(()=>{
    const checkUserHasSignedUpFully=async()=>{
      const documentLocation=doc(db,'listOfUsers', user.uid)
      const getDocument=await getDoc(documentLocation)
      console.log('getDocument(): ' , getDocument.id)
      console.log("getDocument.exists():", getDocument.exists());
      console.log("getDocument.data():", getDocument.data());
      
      if (!getDocument.exists()||
      !getDocument.data().borough ||
      !getDocument.data().dOB ||
      !getDocument.data().name ||
      !getDocument.data().timestamp ||
      !getDocument.data().weeklyRunningTime){
        navigation.navigate("Setting", { screen: "edit", params: { disableBackButton: true } });
        }
      else{
        setImageOfCurrentUser(getDocument.data().picURL)
        navigation.navigate('Match')
        // gettingUsersInformation()

      }
    }
   
    checkUserHasSignedUpFully();
    
    
  },[navigation,user.uid])

  useEffect(()=>{
    const checkingUsersHaveMatchedPreSWipe=async()=>{
      const documentLocation=doc(db,'listOfUsers', user.uid)
      const getDocumentOfCurrentUserLoggedIn=await getDoc(documentLocation)
      const getReference=await getDocs(collection(db,'listOfUsers'))

      getReference.forEach((doc)=>{
        if(getDocumentOfCurrentUserLoggedIn.data() && getDocumentOfCurrentUserLoggedIn){
          if(doc.id!==getDocumentOfCurrentUserLoggedIn.id && doc.data().allUsersSwipedRightOn && getDocumentOfCurrentUserLoggedIn.data().allUsersSwipedRightOn){
            if(doc.data().allUsersSwipedRightOn.includes(getDocumentOfCurrentUserLoggedIn.id) && getDocumentOfCurrentUserLoggedIn.data().allUsersSwipedRightOn.includes(doc.id)){
              setShowMatchPopup(true)
              setIDOfOtherUser(doc.id)
              console.log('This is the id of the other user', getIDOfOtherUser)
              setMatchedUserData(doc.data())
  
              console.log('This is matched user data: ', matchedUserData)
              setImageOfMatchedUser(doc.data().picURL)
            }
          }

        }
        

      })
    }

    checkingUsersHaveMatchedPreSWipe();
  },[listOfUsers])


  // Start Swiping Code
  
  const swipe = useRef(null)
    
    const [showMatchPopup, setShowMatchPopup] = useState(false);
    const [matchedUserData, setMatchedUserData] = useState(null);

  

  

  const handleLeftSwipe=async(index)=>{
    console.log('It gets to this function.')
    console.log('Handling left swipe for card index:', index);
    try{
      if (swipe.current){
        console.log('This is the card index:',index)
        console.log('The current at position', index, ' is :', listOfUsers[index])
        const currentCardInfo=listOfUsers[index]
        const getReference=doc(db,'listOfUsers',user.uid)
        await updateDoc(getReference, {allUsersSwipedOn: arrayUnion(currentCardInfo.id),merge: true,});
        const updatedListOfUsers = await getUpdatedListOfUsers();
        setListOfUsers(updatedListOfUsers);
      }

    }
     
    catch(err){
      console.log('The error is ', err)
    }
    

  };



  const handleSwipeRight=async(index)=>{
    console.log('It gets to right hand swipe function.')
    console.log('Handling right swipe for card index:', index);
    
    try{
      if (swipe.current){

        console.log('This is the card index:',index)
        console.log('The current at position', index, ' is :', listOfUsers[index])
        const currentCardInfo=listOfUsers[index]
        console.log('Gets here')
        checkingIfUsersHaveMatched(currentCardInfo)
        console.log('Ends here')
        const getReference=doc(db,'listOfUsers',user.uid)
        await updateDoc(getReference, {allUsersSwipedOn: arrayUnion(currentCardInfo.id),merge: true,});
        await updateDoc(getReference, {allUsersSwipedRightOn: arrayUnion(currentCardInfo.id),merge: true,});
        const updatedListOfUsers = await getUpdatedListOfUsers();
        setListOfUsers(updatedListOfUsers);
      }
      
      
      
    }
    catch(err){
      console.log('The error is ', err)
    }
  }

  const getUpdatedListOfUsers = async () => {
    const gettingDocsFromUserCollection = collection(db, "listOfUsers");
    const querySnapshot = await getDocs(gettingDocsFromUserCollection);
    const gettingAllUsersInfo = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (doc.id !== user.uid && (!data.allUsersSwipedOn || !data.allUsersSwipedOn.includes(user.uid))) {
        gettingAllUsersInfo.push({ id: doc.id, ...data });
      }
    });
    return gettingAllUsersInfo;
  };
  


  const checkingIfUsersHaveMatched=async(currentCardInfo)=>{
   // Listen for changes in the current user's data
const currentUserRef = doc(db, "listOfUsers", user.uid);
const unsubscribeCurrentUser = onSnapshot(currentUserRef, (currentUserDocSnapshot) => {
  const currentUserData = currentUserDocSnapshot.data();

  // Check if the current user has swiped right on the other user
  if (currentUserData.allUsersSwipedRightOn && currentUserData.allUsersSwipedRightOn.includes(currentCardInfo.id)) {
    const otherUserRef = doc(db, "listOfUsers", currentCardInfo.id);

    // Listen for changes in the other user's data
    const unsubscribeOtherUser = onSnapshot(otherUserRef, (otherUserDocSnapshot) => {
      const otherUserData = otherUserDocSnapshot.data();

      // Check if the other user has swiped right on the current user
      if (otherUserData.allUsersSwipedRightOn && otherUserData.allUsersSwipedRightOn.includes(user.uid)) {
        setMatchedUserData(currentCardInfo);
        setMatchFound(true);
        setImageOfMatchedUser(currentCardInfo.picURL);
        setShowMatchPopup(true);
      }
    });
  }
});
   unsubscribeCurrentUser();
  }

  const [showNoMoreUsers, setShowNoMoreUsers] = useState(false);


  // End Of Swiping Code
  useEffect(() => {
    const gettingUsersInformation = async () => {
      const gettingDocsFromUserCollection = collection(db, "listOfUsers");
      
  
      // Use the onSnapshot listener on the collection
      const unsubscribe = onSnapshot(gettingDocsFromUserCollection, (querySnapshot) => {
        let gettingAllUsersInfo = [];
        querySnapshot.forEach((doc) => {
          const storeOfUserSwipedOn=doc.data().allUsersSwipedOn || []
          if (doc.id !== user.uid && !storeOfUserSwipedOn.includes(doc.id)) {
            gettingAllUsersInfo.push({id:doc.id, ... doc.data()})
            
          }
        });
        setListOfUsers(gettingAllUsersInfo);
        if (gettingAllUsersInfo.length === 0) {
          setShowNoMoreUsers(true);
        } else {
          setShowNoMoreUsers(false);
        }
      });
  
      return unsubscribe;
    };
  
    gettingUsersInformation();
  }, [user]);
  


  // useEffect(() => {
  //   const gettingUsersInformation = async () => {
  //     const gettingDocsFromUserCollection = collection(db, "listOfUsers");
  //     let gettingAllUsersInfo=[]
  //     // const storeOfUserSwipedOn=getReferenceToUser.data().allUsersSwipedOn || []
  //     const q = query(gettingDocsFromUserCollection);
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         if(doc.id!==user.uid ){
  //           if(doc.data().allUsersSwipedOn){
  //             if(!doc.data().allUsersSwipedOn.includes(user.uid)){
  //               gettingAllUsersInfo.push(doc.id,...doc.data())
  //             }
  //             else{
  //               gettingAllUsersInfo.push(doc.id,...doc.data())

  //             }
  //           }
  //         }
  //       });
  //       setListOfUsers(gettingAllUsersInfo)
  //       if (gettingAllUsersInfo.length === 0) {
  //         setShowNoMoreUsers(true);
  //       } 
  //       else {
  //         setShowNoMoreUsers(false);
  //       }
  //     });
      
     
  //     return unsubscribe;
  //   };
    
    
  
  //   gettingUsersInformation();
  // }, [user]);
  const creatingConversation=async()=>{
    console.log('Reaches this function of convo')
    const id=getIDOfOtherUser;
    const generatedConvoID=generateCombinedId(user.uid,id)
    const getRefernceToFindConvo=doc(db,'ConversationsOfUsers', generatedConvoID)
    console.log('This is what is inside of getRefernceToFindConvo : ',getRefernceToFindConvo)
    const gettingConvoDocument=await getDoc(getRefernceToFindConvo)
    console.log('This is what is inside of  gettingConvoDocument: ',gettingConvoDocument)
    if(!gettingConvoDocument.exists){
      const detailsToStartConversationToSendToFirebase = {
        userWhoIsLoggedInID: user.uid,
        theOtherUserInConversation: id,  
        messages: [],
      };
      console.log('Lets create that convo!')
       setDoc(doc(db, 'ConversationsOfUsers', generatedConvoID), detailsToStartConversationToSendToFirebase).then(() => {
        console.log("Successful")})
        .catch((error) => {
        console.log(`Unsuccessful returned error ${error}`)});

    }

  }

  // Creating a conversation:
  const generateCombinedId = (userA_id, userB_id) => {
    const array=[]
    array.push(userA_id,userB_id)
    array.sort()

    return `${array[0]}:${array[1]}`;
  };
  


  
    const checkingIfUsersAlreadyHaveAConvo=async()=>{
      console.log('reach this function!!!')
      const id=getIDOfOtherUser;
      const generatedConvoID=generateCombinedId(user.uid,id)

      const getRefernceToFindConvo=doc(db,'ConversationsOfUsers', generatedConvoID)
      const gettingConvoDocument=await getDoc(getRefernceToFindConvo)

      // console.log('This is the ',documentOfConvo)
      if (gettingConvoDocument.exists){
        console.log('This is getting here TO SHOW THE USERS ALREADY HAVE A CONVO')
        setShowMatchPopup(false)
      }
      else{
        setShowMatchPopup(true)
      }
      setConvoCheckingFinished(true)
    }
   

  
  useEffect(() => {
    if (getIDOfOtherUser) {
      checkingIfUsersAlreadyHaveAConvo();
    }
  }, [getIDOfOtherUser]);
  
  


  

 

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>React Native Tinder Card</Text>
      <View style={{position:'absolute', alignItems:'center'}}>
        {showNoMoreUsers?(<Text style={{marginTop: 50, alignContent:'center', color:'blue', left:20, fontSize:30}}>No more users to swipe on</Text>):(
          <View
          
            atyle={{zIndex: showMatchPopup ? -1 : 1, }}
          >
             
          <Swiper
          cards={listOfUsers}
          cardIndex={0}
          infinite={false}
          verticalSwipe={false}
          horizontalSwipe={true}
          showSecondCard={true}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          onSwipedAll={()=>{
            setShowNoMoreUsers(true)
          }}
          onSwipedLeft={(index)=>{
            handleLeftSwipe(index);
          }}
          onSwipedRight={(index)=>{
            handleSwipeRight(index);
          }}
          ref={swipe}
          renderCard={
            (card, index) => {
              return index < listOfUsers.length ? (
                  <View key={index} style={{ 
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: "#E8E8E8",
                    backgroundColor: "transparent",
                    height:400,
                    width:300}}>
                    <ImageBackground source={{uri:card.picURL}} style={styles.cardImage}>
                    </ImageBackground>
                    <Text style={{textAlign: "center",fontSize: 50,color:'black'}}>
                        {card.name}
                      </Text>
                  </View>
              ) : null;
            }
          }
          stackSize={5}
        />
        </View>

        )}
        
        
      </View>
      {showMatchPopup&& matchedUserData && convoCheckingFinished ? (
        <Modal visible={showMatchPopup} animationType="slide" transparent={true}>
        <View style={{flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
          // zIndex: 100, // Add this line
    }}>
          <Text style=
          {{fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20, 
            color:'blue'
            }}>It's a match!</Text>
          <Text 
          style={{fontSize: 18,
            textAlign: 'center',
            marginBottom: 20,
            color:'blue'
            }}>
            You and {matchedUserData.name} have both swiped right on each other.
          </Text>
          <View style={{flexDirection:'row' }}>
          <Image
          source={{ uri: imageOfCurrentUser }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Image
        source={{ uri: imageOfMatchedUser }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      </View>
        
          <View style=
          {{flexDirection: 'row',
            justifyContent: 'space-around',
            width: '80%',}}>
            <Button
              title="Keep Swiping"
              onPress={() => setShowMatchPopup(false)}
            />
            <Button
              title="Send a Message"
              onPress={() => {
                setShowMatchPopup(false);
                creatingConversation()
                navigation.navigate('Message');
              }}
            />
            
          </View>
        </View>
      </Modal>


      ):(
        null

      )
        }

    </View>

  )
}

export default Match
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  header: {
    color: '#000',
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center', // Added to center the text
  },
  // cardContainer: {
  //   width: '90%',
  //   maxWidth: 260,
  //   height: 300,
  // },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 260,
    height: 300,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    color: '#fff',
  },
  buttons: {
    margin: 20,
    zIndex: -100,
  },
  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  },
  textInputStyle:{
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    
  },
  selectDateButton:{
    overflow: 'hidden',
    alignItems:"center",
    justifyContent:"flex-end",
    backgroundColor:'white',
    borderRadius:15,
    paddingHorizontal:10,
    paddingVertical:10

},
font:{
    fontSize:20,
    fontWeight:"bold",
    textAlign:"center"

  },
  closeButton:{
    backgroundColor:'white',
    justifyContent:'center',
    paddingHorizontal:1,
    paddingVertical:4
  },
  closeButtonView: {
    paddingHorizontal: 1, // Adjust this value as needed to reduce the horizontal whitespace
    paddingVertical: 1, // Adjust this value as needed to reduce the vertical whitespace
  },
  submitButtonContainer:{
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 10,
  },
  buttonsContainer: {
    top:400
  },
  
  swipeLeftButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,

  },
  swipeRightButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    position:'absolute',
    left:300
  },
  swipeButtonText: {
    fontSize: 16,
  },

}
