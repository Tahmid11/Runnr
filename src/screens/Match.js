

import CustomModal from "react-native-modal";
import { SelectList } from 'react-native-dropdown-select-list'
import { Dropdown } from 'react-native-element-dropdown';
// Date Time Picker
import DatePicker,{ getFormatedDate, getToday } from 'react-native-modern-datepicker';

// Image Picker= https://docs.expo.dev/versions/latest/sdk/imagepicker/#mediatypeoptions

import React, { useState, useRef, useEffect} from 'react'
import { ImageBackground, Text, View, Button, TextInput, TouchableOpacity, Modal,Image} from 'react-native'
// import TinderCard from 'react-tinder-card'
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc } from "firebase/firestore";
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
        gettingUsersInformation()

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
        if(doc.id!==getDocumentOfCurrentUserLoggedIn.id && doc.data().allUsersSwipedRightOn && getDocumentOfCurrentUserLoggedIn.data().allUsersSwipedRightOn){
          if(doc.data().allUsersSwipedRightOn.includes(getDocumentOfCurrentUserLoggedIn.id) && getDocumentOfCurrentUserLoggedIn.data().allUsersSwipedRightOn.includes(doc.id)){
            setShowMatchPopup(true)
            setMatchedUserData(doc.data())
            console.log('This is matched user data: ', matchedUserData)
            setImageOfMatchedUser(doc.data().picURL)
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
      }
      
      
    }
    catch(err){
      console.log('The error is ', err)
    }
  }
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
  return unsubscribeCurrentUser;
  }
  const [showNoMoreUsers, setShowNoMoreUsers] = useState(false);


  // End Of Swiping Code



  // Getting User Information.
  const gettingUsersInformation=async()=>{
    const getReference=await getDocs(collection(db,'listOfUsers'))
    const getReferenceToUser=await getDoc(doc(db,'listOfUsers', user.uid))
    const gettingAllUsersInfo=[]
    const storeOfUserSwipedOn=getReferenceToUser.data().allUsersSwipedOn || []


    getReference.forEach((doc)=>{
      if (doc.id!==user.uid &&!storeOfUserSwipedOn.includes(doc.id)){
        console.log('The doc id:', doc.id, ' and its data: ', doc.data())
        // Creating an array of objects.
        gettingAllUsersInfo.push({id: doc.id, ...doc.data() })
      }
    })
     setListOfUsers(gettingAllUsersInfo)
     if (gettingAllUsersInfo.length === 0) {
      setShowNoMoreUsers(true);
    } else {
      setShowNoMoreUsers(false);
    }
  }

  // Creating a conversation:
  const creatingConversation=async(nameOfPerson)=>{
    const getReference=await getDocs(collection(db,'listOfUsers'))
    let id=null;
    getReference.forEach((doc)=>{
      if (doc.data().name===nameOfPerson){
        id=doc.id
      }
    })
    const detailsToStartConversationToSendToFirebase={
      userWhoIsLoggedInID:user.uid,
      theOtherUserInConversation:id ,
      messages:[]
    }
    await setDoc(doc(db, "ConversationsOfUsers",user.uid),detailsToStartConversationToSendToFirebase)

  }


  

 

  

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
      {showMatchPopup&& matchedUserData ? (
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
                creatingConversation(matchedUserData.name)
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

  // const [runningDistance,setRunningDistance]=useState('');

  // // PostCode that user gives
  // const [postCode,setPostCode]=useState('');
  // // if the postcode is true or false...
  // const [postCodeOutcome,setPostCodeOutcome]=useState(false);

  // const [boroughOfUser,setBoroughOfUser]=useState('');





  // // End Of postcode validation.

  // const handleFormSubmit=()=>{
  //   fetch(`https://api.postcodes.io/postcodes/${postCode}`)
  //     .then((response) => {
  //       return response.json(); // parse response body as JSON
  //     })
  //     .then((data) => {
  //       if (data.status === 200) {
  //         setPostCodeOutcome(true);
  //         setBoroughOfUser(data.result.admin_district)
  //       } else {
  //         setPostCodeOutcome(false);
  //         setBoroughOfUser('')
  //       }
  //     } 
  //     )
  //     .catch((error) => {
  //       console.log(error)
  //       setPostCodeOutcome(false);
  //       setBoroughOfUser('')
  //       throw error;
  //     })

  // }


{/* Touchable Opacity button
 <TouchableOpacity onPress={()=>{setShowDatePicker(true)}}>
  <Text>Date Of Birth {theUserDOB}</Text>
 </TouchableOpacity>

 { showDatePicker ?
 (<DatePicker
  options={{
    backgroundColor: '#090C08',
    textHeaderColor: '#FFA25B',
    textDefaultColor: '#F6E7C1',
    selectedTextColor: '#fff',
    mainColor: '#F4722B',
    textSecondaryColor: '#D6C7A1',
    borderColor: 'rgba(122, 146, 165, 0.1)',
  }}
  mode="calendar"
  style={{ borderRadius: 10 }}
  isGregorian={true}
  selectorEndingYear={2040}

  
  onDateChange={(value)=>{
    setUserDOB(value) 
    setShowDatePicker(false)}}
/>)
 :
 (
  <Text>Nothing</Text>
 )


 } */}




// const listOfParks=[

  //   {key:1,value:'Abbey Gardens'},
  //   {key:2,value:'Abney Park'},
  //   {key:3,value:'Albert Gardens'},
  //   {key:4,value:'Altab Ali Park'},
  //   {key:5,value:'Amhurst Park'},
  //   {key:6,value:'Archway Park'},
  //   {key:7,value:'Arnold Circus'},
  //   {key:8,value:'Aske Gardens'},
  //   {key:9,value:'Balaam Park'},
  //   {key:10,value:'Barking Park'},
  //   {key:11,value:'Barrow Hill Gardens'},
  //   {key:12,value:'Bethnal Green Gardens'},
  //   {key:13,value:'Bexton Green'},
  //   {key:14,value:'Bishops Square'},
  //   {key:15,value:'Bonner Gate'},
  //   {key:16,value:'Bow Churchyard'},
  //   {key:17,value:'Bow Road Gardens'},
  //   {key:18,value:'Bowling Green'},
  //   {key:19,value:'Boxley Street Park'},
  //   {key:20,value:'Brampton Park'},
  //   {key:21,value:'Broadway Gardens'},
  //   {key:22,value:'Bruce Castle Park'},
  //   {key:23,value:'Brunswick Park'},
  //   {key:24,value:'Burgess Park'},
  //   {key:25,value:'Butterfield Green'},
  //   {key:26,value:'Butterfly Walk Open Space'},
  //   {key:27,value:'Caledonian Park'},
  //   {key:28,value:'Canada Square Park'},
  //   {key:29,value:'Canary Riverside'},
  //   {key:30,value:'Canary Wharf Crossrail Station Roof Garden'},
  //   {key:31,value:'Canning Town Recreation Ground'},
  //   {key:32,value:'Canonbury Grove Open Space'},
  //   {key:33,value:'Cat and Mouse Grounds'},
  //   {key:34,value:'Cavell Street Open Space'},
  //   {key:35,value:'Central Park'},
  //   {key:36,value:'Charlton Park'},
  //   {key:37,value:'Chingford Plains'},
  //   {key:38,value:'Christ Church Oval'},
  //   {key:39,value:'Church Lane Recreation Ground'},
  //   {key:40,value:'Clapham Common'},
  //   {key:41,value:'Clapton Common'},
  //   {key:42,value:'Cleary Gardens'},
  //   {key:43,value:'Clichy Park'},
  //   {key:44,value:'Colegrave Gardens'},
  //   {key:45,value:'Coleman Fields'},
  //   {key:46,value:'Coleridge Gardens'},
  //   {key:47,value:'Commemoration Park'},
  //   {key:48,value:'Connaught Gardens'},
  //   {key:49,value:'Cornwallis Square'},
  //   {key:50,value:'Cranbrook Park'},
  //   {key:51,value:'Crescent Gardens'},
  //   {key:52,value:'Crispin Square'},
  //   {key:53,value:'Crofton Albion Open Space'},
  //   {key:54,value:'Crofton Park'},
  //   {key:55,value:'Crown Road Open Space'},
  //   {key:56,value:'Cundy Road Open Space'},
  //   {key:57,value:'Cypress Road Open Space'},
  //   {key:58,value:'Dalston Eastern Curve Garden'},
  //   {key:59,value:'Danbury Street Park'},
  //   {key:60,value:'De Beauvoir Square'},
  //   {key:61,value:'Devons Estate Community Garden'},
  //   {key:62,value:'Dollis Valley Greenwalk'},
  //   {key:63,value:'Down Lane Park'},
  //   {key:64,value:'Draper Estate'},
  //   {key:65,value:'Drummond Crescent Open Space'},
  //   {key:66,value:`Duckett's Common`},
  //   {key:67,value:`Dunstan's Road Gardens`},
  //   {key:68,value:`Durand's Wharf`},
  //   {key:69,value:'East Greenwich Pleasaunce'},
  //   {key:70,value:'East India Dock Basin'},
  //   {key:71,value:'Eastbrookend Country Park'},
  //   {key:72,value:'Eccleston Square Garden'},
  //   {key:73,value:'Elthorne Park'},
  //   {key:74,value:'Fairlop Waters Country Park'},
  //   {key:75,value:'Fassett Square'},
  //   {key:76,value:'Finsbury Park'},
  //   {key:77,value:'Fordham Park'},
  //   {key:78,value:'Forty Hall Park'},
  //   {key:79,value:'Fournier Street Garden'},
  //   {key:80,value:'Freightliners Farm'},
  //   {key:81,value:'Gallions Reach Park'},
  //   {key:82,value:'Globe Town Market Square'},
  //   {key:83,value:'Golden Lane Estate'},
  //   {key:84,value:'Golders Hill Park'},
  //   {key:85,value:'Goodmayes Park'},
  //   {key:86,value:'Goose Green'},
  //   {key:87,value:'Goresbrook Park'},
  //   {key:88,value:'Goulston Street Open Space'},
  //   {key:89,value:`Gower's Walk`},
  //   {key:90,value:'Graham Street Park'},
  //   {key:91,value:'Green Flag Award Memorial Garden'},
  //   {key:92,value:'Greenway'},
  //   {key:93,value:'Grove Park'},
  //   {key:94,value:'Hackney Downs'},
  //   {key:95,value:'Hackney Marshes'},
  //   {key:96,value:'Hackney Wick Woodland'},
  //   {key:97,value:'Haggerston Park'},
  //   {key:98,value:'Haileybury Youth Centre'},
  //   {key:99,value:'Hainault Forest Country Park'},
  //   {key:100,value:'Hale End Library Green'},
  //   {key:101,value:'Half Moon Crescent'},
  //   {key:102,value:'Hampstead Heath'},
  //   {key:103,value:'Haringey Sixth Form Centre Gardens'},
  //   {key:104,value:'Harris Garden'},
  //   {key:105,value:'Harrow Recreation Ground'},
  //   {key:106,value:'Hayes Common'},
  //   {key:107,value:'Hilly Fields'},
  //   {key:108,value:'Hogsmill River Walk'},
  //   {key:109,value:'Holland Park'},
  //   {key:110,value:'Hollydale Recreation Ground'},
  //   {key:111,value:'Homerton Grove Adventure Playground'},
  //   {key:112,value:'Honor Oak Rec'},
  //   {key:113,value:'Hornchurch Country Park'},
  //   {key:114,value:'Horniman Museum Gardens'},
  //   {key:115,value:'Horsenden Hill'},
  //   {key:116,value:'Horton Country Park'},
  //   {key:117,value:'Hoxton Trust Community Garden'},
  //   {key:118,value:'Ilford War Memorial Gardens'},
  //   {key:119,value:'Island Gardens'},
  //   {key:120,value:'Jamaica Street Park'},
  //   {key:121,value:'Jubilee Gardens'},
  //   {key:122,value:'Kennington Park'},
  //   {key:123,value:'Kensington Gardens'},
  //   {key:124,value:'Kilburn Grange Park'},
  //   {key:125,value:'King Edward Memorial Park'},
  //   {key:126,value:`King George's Field`},
  //   {key:127,value:'King Square Gardens'},
  //   {key:128,value:`King's Hall Leisure Centre Garden`},
  //   {key:129,value:'Kingsland Basin'},
  //   {key:130,value:'Kirkwood Nature Reserve'},
  //   {key:131,value:'Ladywell Fields'},
  //   {key:132,value:'Langtons Gardens'},
  //   {key:133,value:'Larkhall Park'},
  //   ]
        
 {/* <Button onPress={showPicker} title="Show date picker!" /> */}
          {/* {isPickerShow  && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          display='default'
          
          onChange={onChange}
        />
      )} */}

            {/* <View style={styles.buttons}>
        <Button onPress={() => swipe('left')} title='Swipe left!' />
        <Button onPress={() => swipe('right')} title='Swipe right!' />
      </View> */}
      {/* {lastDirection ? <Text style={styles.infoText} key={lastDirection}></Text> : <Text style={styles.infoText}>Swipe a card or press a button to get started!</Text>} */}

      {/* <Swiper
          showsButtons={false}      
          horizontal={true}
          alwaysBounceVertical={false}

        >
          <Image></Image>
          <Image></Image>
          <Image></Image>

          

        </Swiper> */}
        {/* {characters.map((character, index) =>
          <TinderCard ref={childRefs[index]} key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <View style={styles.card}>
              <ImageBackground style={styles.cardImage} source={character.img}>
                <Text style={styles.cardTitle}>{character.name}</Text>
              </ImageBackground>
            </View>
          </TinderCard>
        )} */}

        // const childRefs = useMemo(() => Array(db.length).fill(0).map(i => React.createRef()), [])

        // const swiped = (direction, nameToDelete) => {
        //   console.log('removing: ' + nameToDelete + ' to the ' + direction)
        //   setLastDirection(direction)
        //   alreadyRemoved.push(nameToDelete)
        // }
      
        // const seeModalPage=()=>{
        //   setModalVisible(true)
        // }
      
       
      
        // const outOfFrame = (name) => {
        //   console.log(name + ' left the screen!')
        //   charactersState = charactersState.filter(character => character.name !== name)
        //   setCharacters(charactersState)
        // }
      
        // const swipe = (dir) => {
        //   const cardsLeft = characters.filter(person => !alreadyRemoved.includes(person.name))
        //   if (cardsLeft.length) {
        //     const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
        //     const index = db.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
        //     alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
        //     childRefs[index].current.swipe(dir) // Swipe the card!
        //   }
        // }
      
        // const closeModal = (event) => {
        //   if (event.target === event.currentTarget) {
        //     setModalVisible(false);
        //   }
        // };