import { SelectList } from 'react-native-dropdown-select-list'
import { Dropdown } from 'react-native-element-dropdown';
// Date Time Picker
import DatePicker,{ getFormatedDate, getToday } from 'react-native-modern-datepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect} from 'react'
import { Text, View, Button, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView} from 'react-native'

import callingContext from '../components/callingContext';
import {doc,setDoc,serverTimestamp} from 'firebase/firestore'
import { db, getDownloadURL} from '../Firebase Connectivity/Firebase';
import { storage } from '../Firebase Connectivity/Firebase';
import {ref,uploadBytes, updateMetadata} from 'firebase/storage'

import { useNavigation,  CommonActions} from '@react-navigation/native';


const differentRunningTimes=[
    {
      label:'0-10 minutes', value:1
    },
    {label:'11-20 minutes',value:2
    },
    {
      label:'21-30 minutes',value:3
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

        const piczx=await handleImageSubmission()
        console.log('This is picxzs' , piczx)
        console.log('postCodeOutcome:', postCodeOutcome);
        console.log('young:', young);
        console.log('userSelectedTime', userSelectedTime)
        console.log('PhotoURL:', theURLOfPhoto)
        console.log('The name of the guy: ', displayName)
        


    if (postCodeOutcome&& !young &&userSelectedTime && piczx &&displayName){
        console.log('Your here!')

        try{
          const userDetailsToSendToFirebase={
            name:displayName,
            dOB:`${z}/${y}/${x}`,
            borough:boroughOfUser,
            weeklyRunningTime:time,
            timestamp:serverTimestamp(),
            picURL:piczx,
            allUsersSwipedOn:[],
            allUsersSwipedRightOn:[]
        }
        console.log('This is the stuff that is being sent to firebase:', userDetailsToSendToFirebase)

        await setDoc(doc(db, "listOfUsers",user.uid),userDetailsToSendToFirebase)
        
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
        catch(error){   
          console.log('This is the error:'.error)
        }
    }
    else{
        console.log('Wrong.')
    }
  }

  const submissionSuccess=()=>{
    if (succesfulPosting){
      navigation.navigate('Match');
    }

  }


  
    
return (
    <View style={styles.container}>
      <View style={styles.viewStyle}>

        <Dropdown 
            data={differentRunningTimes}
            mode='default'
            
            placeholder={userSelectedTime?({time}):('How Many Minutes Do You Run A Week.')
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
          placeholder='Please Enter Your First Name'
          style={styles.textInputStyle}
        />
        <TextInput
          value={postCode}
          onChangeText={(value) => {
            setPostCode(value);
          }}
          placeholder='Please Enter Your Postcode.'
          style={styles.textInputStyle}
        />
      
  
        <Text>
          {postCodeOutcome
            ? `Postcode is correct And Your Borough is ${boroughOfUser} `
            : `Postcode is incorrect `}
        </Text>
  
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
                {z + "/" + y + "/" + x}
              </Text>
            ) : (
              <Text style={styles.font}>Select Date </Text>
            )}
        </TouchableOpacity>
        {
              young
              ?
              (
                <Text>You are too young!</Text>
              ):(
                <Text>Nice!</Text>
              )
            }
        
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={handleSelectProfilePhoto} style={{height:50}}>
                
                <Text>Pick an Image</Text>
            </TouchableOpacity>
        <Image style={{height:90, width:200}}source={{uri:photoUrl}}/>


        </View>
        <TouchableOpacity style={{justifyContent:'center',bottom:30,borderWidth:1,left:0, borderRadius: 10}} 
        onPress={handleEditProfileSubmission}
        >
            <Text style={{textAlign:'center', color:'red'}}>Submit</Text>
        </TouchableOpacity>

    </View>
  );

}

export default EditProfile;

const styles = StyleSheet.create({
        container: {
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
    textInputStyle:{
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width:215,

      
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

