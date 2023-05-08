import { SelectList } from 'react-native-dropdown-select-list'
import { Dropdown } from 'react-native-element-dropdown';
// Date Time Picker
import DatePicker,{ getFormatedDate, getToday } from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect} from 'react'
import { Alert,Text, View, Button, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView, KeyboardAvoidingView, Platform} from 'react-native'

import callingContext from '../components/callingContext';
import {doc,setDoc,serverTimestamp, getDoc, updateDoc} from 'firebase/firestore'
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import { storage } from '../Firebase Connectivity/Firebase';
import {ref,uploadBytes, updateMetadata} from 'firebase/storage'

import { useNavigation,  CommonActions} from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

const differentRunningTimes=[
    {
      label:'50-60 minutes', value:1
    },
    {label:'61-70 minutes',value:2
    },
    {
      label:'71-80 minutes',value:3
    }
  ]
const EditProfile=()=>{
  const navigation = useNavigation();


    const {user}=callingContext();
    console.log('This is user: ',user)

    const [displayName, setDisplayName]=useState('')
    const [succesfulPosting, setSuccesfulPosting]=useState(false)

    // Profile Picture Addiing
    const [photoUrl, setPhotoUrl] = useState(null);
    const[theURLOfPhoto, setTheURLOfPhoto]=useState(null)

  const handleSelectProfilePhoto = async () => {
   //   console.log(ImagePicker);
     try {
         let result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Images,
             allowsEditing: true,
             aspect: [4, 3],
             quality: 1,
           });       
         //   console.log(result);
       
           if (!result.canceled) {
             setPhotoUrl(result.assets[0].uri)
             console.log('PhotoURL is set.')
            }
            //  if(user){
                
            //     setPhotoUrl(result.assets[0].uri);
            //  }
             else{
                console.log('User is not logged in.')
             }
             
           }
           catch (error) {
            console.error("Please try picking an image again:", error);
     } 
     }

   useEffect(()=>{
    if (photoUrl){
        console.log('This is the photo url:' + photoUrl)
    }

   },[photoUrl])
 
   const handleImageSubmission = async () => {
    let somePic;
      if (photoUrl) {
          console.log('IT reaches to this function and the photoURL is ' + photoUrl);

            // const pictureReference = ref(storage, `images/${user.uid}/profilePic.jpeg`, { auth: token });
            const picRef=ref(storage, `profilePictures/${user.uid}/pic`);
            const fetchedPhotoUrl=await fetch(photoUrl)
            const thePicture = await fetchedPhotoUrl.blob();
            try {
              await uploadBytes(picRef, thePicture);
              console.log("Image uploaded successfully");
              somePic=await handleRetrievalOfImage(picRef)
              return somePic;
            } catch (error) {
              console.log(error);
            }
      } else {
        console.log('photo is empty.');
      }
      
  };

  const handleRetrievalOfImage=async(picRef)=>{
    const picture=await getDownloadURL(picRef)
    return picture;
    
  }
   

    // End Of Profile Picture
    
    
   

  const [time,setTime]=useState('');
  const [userSelectedTime, setUserHasSelectedTime]=useState(false)




  // PostCode that user gives
  const [postCode,setPostCode]=useState('');
  // if the postcode is true or false...
  const [postCodeOutcome,setPostCodeOutcome]=useState(false);

  const [boroughOfUser,setBoroughOfUser]=useState('');

  const [favouriteLocation, setFavouriteLocationToRun]=useState('')

  // Modern dateTimePicker (Variables are declared from settings.js).
  const todaysDate = new Date();
  const [calendarOpen,setCalendarOpen]=useState(false)
  const [maxYear,setMaxYear]=useState(todaysDate.getFullYear()-18)
  const [maxMonth,setMonth]=useState(todaysDate.getMonth()+1)
  const [maxDay,setDay]=useState(todaysDate.getDate())
  const [x,setX]=useState()
  const [y,setY]=useState()
  const [z,setZ]=useState()
  const [hasSelectedDate, setHasUserSelectedDate]=useState(false)
  const [gettingTheSelectedDate,setGettingTheSelectedDate]=useState();
  const[young,setYoungness]=useState(false);
  // End Of Variables.

    // Different functions to calendar work
    const closeCalendar=()=>{
        setCalendarOpen(false);
    }
    const seeingCalendar=()=>{
        setCalendarOpen(true)
    }

    const afterSettingDate=(date)=>{
        setGettingTheSelectedDate(date)
        setHasUserSelectedDate(true)
        closeCalendar()
    }
    useEffect(() => {

        console.log('This is the year ' + maxYear + ' this is the max month: ' + maxMonth + ' this is the daay ' + maxDay )
        const yearString=maxYear.toString()
        const monthString=maxMonth.toString().padStart(2,'0')
        const dayString=maxDay.toString().padStart(2,'0')
        
        
        if (x && y && z)
        {
            console.log('This is x' + x + ' this is y : ' + y + ' this is z ' + z)
            console.log('This is the yearString: ' + Number(yearString))
        if (Number(yearString)>=Number(x) || Number(yearString)==Number(x) && Number(monthString)>=Number(y) || Number(yearString)==Number(x) && Number(monthString)==Number(y) &&  Number(dayString)>=Number(z)){
            setYoungness(false)
            console.log('Your good!')
        }
        else{
            setYoungness(true)
            console.log('Too young sorry.')
        }
    }
      }, [x, y, z]);

    useEffect(()=>{

            const h=gettingTheSelectedDate;
            if (h){
                setX(h.split("/")[0].toString())
                setY(h.split('/')[1].toString())
                setZ(h.split('/')[2].toString())
            }
        
        else{
            console.log('Error')
        }   

    }, [gettingTheSelectedDate])

    // End Of DateTime Functions.


 
  // Postcode validation.
  useEffect(() => {
    fetch(`https://api.postcodes.io/postcodes/${postCode}`)
      .then((response) => {
        return response.json(); // parse response body as JSON
      })
      .then((data) => {
        if (data.status === 200) {
          setPostCodeOutcome(true);
          setBoroughOfUser(data.result.admin_district)
        } else {
          setPostCodeOutcome(false);
          setBoroughOfUser('')
        }
      } 
      )
      .catch((error) => {
        console.log(error)
        setPostCodeOutcome(false);
        setBoroughOfUser('')
        throw error;
      })
      
      
  }, [postCode]);

  // End Of postcode validation.
  // image picker code



  const handleEditProfileSubmission=async ()=>{
    console.log('edrfctvgybhjnkml,cftvgybhujnkml,')
    console.log('reaches this function.')

        const piczx=await handleImageSubmission()
        console.log('This is picxzs' , piczx)
        console.log('postCodeOutcome:', postCodeOutcome);
        console.log('young:', young);
        console.log('userSelectedTime', userSelectedTime)
        console.log('PhotoURL:', theURLOfPhoto)
        console.log('The name of the guy: ', displayName)
        if (young) {
          Alert.alert(
            'Error',
            'You are too young!',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
          );
        } 


      const docRef = doc(db, 'listOfUsers', user.uid);
      const documentOfUser = await getDoc(docRef);


      if (!photoUrl) {
        Alert.alert('Error', 'Please pick an image.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }
     if (!hasSelectedDate) {
        Alert.alert(
          'Error', 'Please select your date of birth.', 
          [{ text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    return;
  }
  if (!userSelectedTime) {
    Alert.alert(
      'Error', 'Please select your goal weekly running time.', 
      [{ text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
    return;
  }
  if (!favouriteLocation) {
    Alert.alert(
      'Error', 'Please enter your favourite location to run.', 
      [{ text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
    return;
  }
  if (!postCodeOutcome) {
    Alert.alert('Error', 'Please enter a valid postcode.', 
    [{ text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
    return;
  }
  if (!displayName) {
    Alert.alert('Error', 'Please enter your first name.', 
    [{ text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
    return;
  }






              
        

    if (postCodeOutcome&&userSelectedTime && piczx &&displayName && favouriteLocation && !young){
      let userDetailsToSendToFirebase={
        name:displayName,
        dOB:reformatDate(`${z}/${y}/${x}`),
        borough:boroughOfUser,
        postCode:postCode,
        weeklyRunningTime:time,
        favouriteLocation:favouriteLocation,
        timestamp:serverTimestamp(),
        picURL:piczx,
        allUsersSwipedOn:[],
        allUsersSwipedRightOn:[]
      }

      if (documentOfUser.exists()) {
        if (documentOfUser.data().allUsersSwipedOn.length > 0) {
          userDetailsToSendToFirebase.allUsersSwipedOn = documentOfUser.data().allUsersSwipedOn
        }
  
        if (documentOfUser.data().allUsersSwipedRightOn.length > 0 && documentOfUser.data().allUsersSwipedOn ) {
          userDetailsToSendToFirebase.allUsersSwipedRightOn = documentOfUser.data().allUsersSwipedRightOn
        }
      }

      

      if (documentOfUser.exists()) {
        await updateDoc(docRef, userDetailsToSendToFirebase)
      } else {
        await setDoc(docRef, userDetailsToSendToFirebase)
      }
    }
        

        
         
          Alert.alert(
            'Success',
            'Nice!',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false })

            
            
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Setting' },
                ],
              })
            );
            console.log('Woooo')
            console.log('SUCCESSFUL!')
            submissionSuccess()
          
          
    

  }

  const submissionSuccess=()=>{
    if (succesfulPosting){
      navigation.navigate('Match');
    }

  }

  useEffect(()=>{
    const getUserDetails=async()=>{
      const getUserDoc=await getDoc(doc(db,'listOfUsers', user.uid))
    if(getUserDoc.exists() ){
      setDisplayName(getUserDoc.data().name)
      setPhotoUrl(getUserDoc.data().picURL)
      setFavouriteLocationToRun(getUserDoc.data().favouriteLocation)
      setPostCode(getUserDoc.data().postCode)
      console.log(getUserDoc.data().dOB)
      setGettingTheSelectedDate(reformatDate2(getUserDoc.data().dOB));
      setHasUserSelectedDate(true) 
      
    }
    }
    getUserDetails()

    
  },[user.id])
  const reformatDate = (date) => {
    const dateParts = date.split('/');
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
  };
  const reformatDate2 = (date) => {
    const dateParts = date.split('/');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  };
  

  
    
return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <View style={styles.container}>
      <View style={styles.viewStyle}>

        <Dropdown 
            data={differentRunningTimes}
            mode='default'
            
            placeholder={userSelectedTime?({time}):('Goal Weekly Running Time')
            }
            search={false}
            onChange={(item)=>{
                setTime(item.value)
                setUserHasSelectedTime(true)
            }}
            valueField='value'
            value={time}
            labelField='label'
            style={styles.menu}
        />
  
        <TextInput
          value={displayName}
          onChangeText={(value) => {
            setDisplayName(value);
            
          }}
          placeholder='Enter Your First Name'
          style={styles.textInputStyle}
        />
        <View>
        <TextInput
          value={postCode}
          onChangeText={(value) => {
            setPostCode(value);
          }}
          placeholder='Please Enter Your Postcode'
          style={styles.textInputStyle}
        />
        {postCodeOutcome && (
          <View style={styles.checkmarkContainer}>
                  <FontAwesome name="check" size={24} color="green" />

          </View>
        )}
        </View>

        <TextInput
          value={favouriteLocation}
          onChangeText={(value) => {
            setFavouriteLocationToRun(value);
          }}
          placeholder='Favourite Location To Run'
          style={styles.textInputStyle}
        />

            
  
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={seeingCalendar}
        >
       
        <Modal
        animationType="slide"
        transparent={true}
        visible={calendarOpen}
    >
         <View style={styles.overlay}>
            <View style={{ backgroundColor:'transparent', alignItems:'center', justifyContent:'center', borderRadius:10, width:320, height:500}}>
            <DatePicker 
            isGregorian={true}
            mode="calendar"
            onDateChange={(date)=>{
                afterSettingDate(date)
            }}
            maximumDate={`${todaysDate.getFullYear().toString()}-${(todaysDate.getMonth()+1).toString().padStart(2,'0')}-${(todaysDate.getDate()).toString().padStart(2,'0')}`}
            current={gettingTheSelectedDate}
            />
                
            <TouchableOpacity onPress={closeCalendar} style={styles.closeButton}>
                <View style={styles.closeButtonView}>
                    <Text style={{color:'black',fontSize:20 , alignSelf:'center'}}>Close</Text>
                </View>
            </TouchableOpacity>
            </View>
            </View>
        
    </Modal>
    

            {hasSelectedDate ? (
              <Text style={styles.font}>
                {reformatDate(`${z}/${y}/${x}`)}
              </Text>
            ) : (
              <Text style={styles.font}>Select DOB </Text>
            )}
        </TouchableOpacity>

        
        
      </View>
      <View style={{ position: 'absolute', top: 20}}>
      <TouchableOpacity 
        onPress={handleSelectProfilePhoto} 
        style={styles.circularButton}
      >
        <View style={styles.imageContainer}>
          {photoUrl ? (
            <Image style={styles.image} source={{uri:photoUrl}} />
          ) : (
            <Text style={styles.buttonText}>Pick an Image</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>


    <TouchableOpacity 
          style={{
            backgroundColor: '#346eeb',
            borderRadius: 20,
            padding: 10,
            width: '80%',
            alignSelf: 'center',
            marginTop: 20
          }} 
          onPress={handleEditProfileSubmission}
        >
          <Text style={{textAlign:'center', color:'#FFF', fontWeight: 'bold'}}>Submit</Text>
        </TouchableOpacity>

  
  </View>
 

    
    </KeyboardAvoidingView>
  );
        }


export default EditProfile;

const styles = StyleSheet.create({
        container: {
          backgroundColor: 'white',
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        },
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
        viewStyle: {
          alignContent: "center"
        },
        header: {
          color: "#000",
          fontSize: 30,
          marginBottom: 30,
        },
        textInputStyle: {
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          borderRadius: 10,
          paddingLeft: 10,
          marginBottom: 10,
          height: 40,
        },
        checkmarkContainer: {
          position: 'absolute',
          top: 7,
          right: 10,
        },
    circularButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 20,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: '#ccc',
      overflow: 'hidden',
    },
    buttonPosition: {
      position: 'absolute',
      bottom: -20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    selectDateButton:{
      overflow: 'hidden',
      alignItems:"center",
      borderColor: '#ddd',
      borderWidth: 1,
      justifyContent:"flex-end",
      backgroundColor:'white',
      borderRadius:15,
      paddingHorizontal:10,
      paddingVertical:2,
      shadowOffset: { width: 0, height: 2 }, 
      height: 40, 
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
        width:319
    },
    menu:{
            height:40,
            width:210,
            margin:30,
            borderBottomColor:'black',
            borderBottomWidth:1,
            
            
        }
  
  })
