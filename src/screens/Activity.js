import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView, Alert, FlatList} from 'react-native'
import { db } from "../Firebase Connectivity/Firebase";
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where, orderBy, limit,deleteField, arrayRemove } from "firebase/firestore";
import callingContext from '../components/callingContext';
import DatePicker from 'react-native-modern-datepicker';
import DatePicker2 from 'react-native-date-picker';


import { useNavigation,  CommonActions} from '@react-navigation/native';

import RadioGroup from 'react-native-radio-buttons-group';






const Activity = ({navigation}) => {
  
    const {user}=callingContext();
    // Modern dateTimePicker (Variables are declared from settings.js).
  const todaysDate = new Date();
  const outCome=addHours(todaysDate)
  



  const [calendarOpen,setCalendarOpen]=useState(false)
  const [x,setX]=useState()
  const [y,setY]=useState()
  const [z,setZ]=useState()
  const [hasSelectedDate, setHasUserSelectedDate]=useState(false)
  const [gettingTheSelectedDate,setGettingTheSelectedDate]=useState();
  const [timing, setTime] = useState('');

  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [userPickedTime,setHasUserPickedTime]=useState(false)


 

  

  // End Of Variables.

    // Different functions to calendar work
    const closeCalendar=()=>{
        setCalendarOpen(false);
    }
    const seeingCalendar=()=>{
        setCalendarOpen(true)
    }
    function addHours(date)
      {
        const dateGiven=new Date(date.setTime(date.getTime() + 1 *( 60 * 60 * 1000)))
        return dateGiven;
      }

    const afterSettingDate=(date)=>{
      // const userSelectedDate=new Date(date);
      // setGettingTheSelectedDate(userSelectedDate);
      let newDate1 = date.replace('/','-');
      let newDate2 = newDate1.replace('/','-');
    

      
      setGettingTheSelectedDate(newDate2)
      setHasUserSelectedDate(true)
      closeCalendar()
      console.log('date is ',newDate2);
      setX(date.split("/")[0].toString());
      setY(date.split("/")[1].toString());
      setZ(date.split("/")[2].toString());
    }
    const closeTimer=()=>{
      setTimePickerOpen(false);
  }
  const seeTimer=()=>{
      setTimePickerOpen(true)
  }

  const afterSettingTime=(time)=>{
    setTime(time)
    setHasUserPickedTime(true)
    closeTimer()
    console.log('the time set is', time);
  }
  
 

  const onScheduleRunSubmit = () => {
    let selectedDateTime = new Date(gettingTheSelectedDate+"T"+timing);
    console.log(selectedDateTime)
    console.log(outCome)


    if(selectedDateTime < outCome){
      Alert.alert(
        "Date Error",
        "You cannot select a date and time before the current date/time. Please select a date/time in the FUTURE!",
        [
          { text: "OK", onPress: () => {
            
            return false;
          
          } }
        ],
      );
      return false;
    } 
      return true;

    // console.log('the selected date year is', selectedDateTime.getFullYear());
    // console.log('the selected date month is', selectedDateTime.getMonth());
    // console.log('the selected date date is', selectedDateTime.getDate());
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



// Scheduled Runs
const [userHasScheduledRuns, setScheduledRuns]=useState(false)
const [listOfScheduledRuns, setListOfScheduledRuns]=useState([])

// Unique ID
const generateUniqueID=()=>{
  let randomValue=Math.floor(Math.random()*1000)
  let randomValue2=Math.floor(Math.random()*10000)
  let randomValue3;
  if (randomValue===randomValue2){
    randomValue=randomValue-11
  }

  return `${user.uid}${randomValue}${randomValue2}`

}


const createScheduledRuns=async()=>{
  console.log('Comes to this function')
  const scheduledRunRef=doc(db,'ScheduledRuns', user.uid)
  const getDocument=await getDoc(scheduledRunRef)

  
  const detailsToSendToFirebaseAboutScheduledRuns={
    activity:[{
      id:generateUniqueID(),
      postCodeWhereTheyRan:postCode,
      whenUserDecidesToRun:new Date(gettingTheSelectedDate+"T"+timing),
      howLongUserRuns:time,
      completed:false
    }]
  }

  if(getDocument.exists()){
    console.log('enters here')
    await updateDoc(scheduledRunRef,{activity:arrayUnion(detailsToSendToFirebaseAboutScheduledRuns.activity[0]), merge:true})

  }
  else{
    console.log('enters the else')
    setDoc(scheduledRunRef, detailsToSendToFirebaseAboutScheduledRuns)
  }
  }

  useEffect(()=>{
    const fetchScheduledRuns=async()=>{
      
      const scheduledRunRef=doc(db,'ScheduledRuns', user.uid)  
      const doesDocExist=await getDoc(scheduledRunRef)
      const array=[]

      if (doesDocExist.exists()){
        
        const unsub=onSnapshot(scheduledRunRef, (doc)=>{

          if(doc.data() && !doc.data().completed && doc.id===user.uid){
            doc.data().activity.forEach(element => {
              // console.log('This is the id wihtin the doc', element.id)
              array.push(element)
            });
        }
        setListOfScheduledRuns(array)
      })
      setScheduledRuns(true)
      return unsub;
      }
    }
    fetchScheduledRuns()
  },[user.uid, listOfScheduledRuns])


  const deleteAField=async(id)=>{
    console.log('Ges to this function')
      const scheduledRunRef=doc(db,'ScheduledRuns', user.uid)  
      const doesDocExist=await getDoc(scheduledRunRef)
      if (doesDocExist.exists()){
        console.log('Enters the first if statement.')
        const unsub=onSnapshot(scheduledRunRef, (doc)=>{
          
          if(doc.data() && !doc.data().completed){
            console.log('Comes here', doc.data().activity)
            console.log('This is the id it receives: ',id)
            doc.data().activity.forEach(element => {
              console.log('This is each element, ', element)
              if(element.id===id){

                console.log('This is entering here: ',element.id)
                 updateDoc(scheduledRunRef, {
                  activity: arrayRemove(element),
                });
              }
            

            });
        }

      })
      return unsub;
      } 
     
    

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
            mode="calendar"
            onDateChange={(date)=>{
                afterSettingDate(date)
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

    
    
    
    
    {hasSelectedDate? (
              <Text style={styles.font}>
                {z + "/" + y + "/" + x} 
              </Text>
            ) : (
              <Text style={styles.font}>Select Date</Text>
            )}
        </TouchableOpacity>


        {/* Time Picker */}

        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={seeTimer}
        >
        <Modal
          animationType="slide"
          transparent={true}
          visible={timePickerOpen}
          >
        <View style={styles.overlay}>
            <View style={{ backgroundColor:'transparent', alignItems:'center', justifyContent:'center', borderRadius:10, width:320, height:500}}>
            <DatePicker 
            mode="time"
            onTimeChange={(time)=>
              { 
                afterSettingTime(time)
              
              }}
            minuteInterval={1}
            />
        
          <TouchableOpacity onPress={closeTimer} style={styles.closeButton}>
              <View style={styles.closeButtonView}>
                  <Text style={{color:'black',fontSize:20 , alignSelf:'center'}}>Close</Text>
              </View>
          </TouchableOpacity>
          </View>
          </View>

      </Modal>
      {userPickedTime? (
            <Text style={styles.font}>
              {timing}
            </Text>
          ) : (
            <Text style={styles.font}>Select Time</Text>
          )}
      </TouchableOpacity>
              
              
        
        

        

          <Button
          title='Schedule Run'
            onPress={()=>{
              if(onScheduleRunSubmit()){
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
                      createScheduledRuns()
                      // navigation.navigate('StartActivity')
                    }
                    
                  
                  } }
                ],
                { cancelable: true }
              );
              }

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

        { userHasScheduledRuns?(
         <FlatList
         contentContainerStyle={{ flexGrow: 1 }}
         data={listOfScheduledRuns}
   
         renderItem={({ item }) => {
          // Converts it from timestamp to normal use.
          const dateTime=item.whenUserDecidesToRun.toDate();
           return (
             <View style={styles.scheduledRunContainer}>
               <View style={styles.scheduledRunInfo}>
                 <Text style={styles.scheduledRunText}>Date and Time of Run: { dateTime.toLocaleDateString('')}</Text>
                 <Text style={styles.scheduledRunText}>Time: {dateTime.toLocaleTimeString('')}</Text>
                 <Text style={styles.scheduledRunText}>Total Running Time: {item.howLongUserRuns} minutes</Text>
                 <Text style={styles.scheduledRunText}>Location of Run: {item.postCodeWhereTheyRan} </Text>
               </View>
               <View style={styles.scheduledRunButtons}>
                 <TouchableOpacity
                   style={styles.startButton}
                   onPress={() => navigation.navigate('StartActivity')}
                 >
                   <Text style={styles.startButtonText}>Start</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.deleteButton}
                   onPress={() => {
                    console.log('This is the item.id:',item.id)
                    deleteAField(item.id)

                   }}
                 >
                   <Text style={styles.deleteButtonText}>Delete</Text>
                 </TouchableOpacity>
               </View>
             </View>
           )
         }}
         keyExtractor={(item) => item.id}
       />
        ):
        (
          null
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
      
      
  },

  scheduledRunContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  scheduledRunInfo: {
    // flex: 1,
    paddingRight: 10,
  },
  scheduledRunText: {
    color: 'red',
    fontSize: 14,
  },
  scheduledRunButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#32CD32',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#DC143C',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  }


})


