import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView, Alert} from 'react-native'
import { db } from "../Firebase Connectivity/Firebase";
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where } from "firebase/firestore";
import callingContext from '../components/callingContext';
import DatePicker from 'react-native-modern-datepicker';

import { useNavigation,  CommonActions} from '@react-navigation/native';

import RadioGroup from 'react-native-radio-buttons-group';






const Activity = ({navigation}) => {
  
    const {user}=callingContext();
    // Modern dateTimePicker (Variables are declared from settings.js).
  const todaysDate = new Date();
  const [calendarOpen,setCalendarOpen]=useState(false)
  const [x,setX]=useState()
  const [y,setY]=useState()
  const [z,setZ]=useState()
  const [hasSelectedDate, setHasUserSelectedDate]=useState(false)
  const [gettingTheSelectedDate,setGettingTheSelectedDate]=useState();
  const [timing, setTime] = useState('');

  

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

    const checkingTimeIsValid=(userEnteredTime)=>{
      console.log('This is the type that the calendar time gives back:',typeof userEnteredTime)
      console.log('This is the length of the time object : ', userEnteredTime.length)
    }

    // End of Date Picker stuff

    // Start of post code
     // Postcode validation.
     const [postCode,setPostCode]=useState('');
     // if the postcode is true or false...
     const [postCodeOutcome,setPostCodeOutcome]=useState(false);
   
     const [boroughOfUser,setBoroughOfUser]=useState('');
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
// End Of Post code checker.

// Time Of Run
const [userSelectedTime, setUserHasSelectedTime]=useState(false)


// Radio Button Code
const [showSchedule, setShowSchedule]=useState(false)
const [radioButtonOptns,setRadioButtonOptions]=useState([{
  id:1,
  label: 'Start Now',
  value: 'option1',
  
},
{ 
  id:2,
  label:'Schedule Run',
  value:'option2'

}])

function onPressRadioButton(radioButtonsArray) {
  setRadioButtonOptions(radioButtonsArray);
  if(radioButtonOptns){
    console.log('This is: ',radioButtonOptns[1].id)
  }
  if(radioButtonOptns[1].id===2 && radioButtonOptns[1].selected===true){
    setShowSchedule(true)
  }
  else{
    setShowSchedule(false)
  }

}

// User Selecting How Long They Will Run For vairable
const[time, settingTheTime]=useState()


const createScheduledRuns=async()=>{
  const scheduledRunRef=doc(db,'ScheduledRuns', user.uid)
  const detailsToSendToFirebaseAboutScheduledRuns=[
    {
      id:user.id,
      postCodeWhereTheyRan:postCode,
      durationTheyPlanToRun:time,
    }
  ]
  setDoc(scheduledRunRef, detailsToSendToFirebaseAboutScheduledRuns, {merge:true})


    // createScheduledRuns(scheduledRunRef
  }







  
    return(
      <View>
         <RadioGroup 
            radioButtons={radioButtonOptns} 
            onPress={
              onPressRadioButton
            } 
        />
        { showSchedule?  (
          <View>

        
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
            // mode="calendar"
            onDateChange={(date)=>{
                afterSettingDate(date)
            }}
            onTimeChange={(selectedTime) =>{
              setTime(selectedTime)
              checkingTimeIsValid(selectedTime)


            }}
               
            minimumDate={`${todaysDate.getFullYear().toString()}-${(todaysDate.getMonth()+1).toString().padStart(2,'0')}-${(todaysDate.getDate()).toString().padStart(2,'0')}`}
            selectorEndingYear={2100}
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
    
    {hasSelectedDate && timing? (
              <Text style={styles.font}>
                {z + "/" + y + "/" + x} {"\n"}{console.log('This is the timing that the user selected: ',timing)}
              </Text>
            ) : (
              <Text style={styles.font}>Select Date And Time</Text>
            )}

        
        </TouchableOpacity>
        

          <Button
          title='Schedule Run'
            onPress={()=>{
              Alert.alert(
                "Alert Title",
                "Press OK if you are sure you want to schedule your activity.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => {
                    if (!x || !y || !z || !postCodeOutcome || !timing) {
                      // Show alert for missing date, time or invalid postcode
                      Alert.alert(
                        'Error',
                        'Please fill in the required fields: Date, Time and Postcode.',
                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                        { cancelable: true }
                      );
                    } else {
                      console.log("OK Pressed")
                      navigation.navigate('StartActivity')
                    }
                    
                  
                  } }
                ],
                { cancelable: true }
              );
              

            }}
          />
    </View>
    

        ):(
          <Button
          title='Start'
            onPress={()=>{
              Alert.alert(
                "Alert Title",
                "Press OK if you are sure you want to start your activity.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => {
                    console.log("OK Pressed")
                    navigation.navigate('StartActivity')
                  
                  } }
                ],
                { cancelable: true }
              );
              
  
            }}
          />

        )}

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
            : `Postcode is incorrect. Try again. `}
        </Text>
        <View style={{flexDirection:'row',height: 40,margin: 12,borderWidth: 1,padding: 10,width:250 }}>
        <TextInput

        placeholder="Enter planned running time in mins"
        keyboardType="numeric"
        maxLength={4}
        onChangeText={(val)=>{
          settingTheTime(val)
          setUserHasSelectedTime(true)
        }}
        />
        </View>

        {
          userSelectedTime?(
            <Text>Good you have selected a time</Text>
          ):(
            <Text>You have not selected a time!</Text>
          )
        }
       

       
      
      
      
  </View>
    )
};
    
export default Activity;
    



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


