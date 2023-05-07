import React , { useState, useMemo, useEffect} from "react";
import { Text,Button,View, Platform, ScrollView, Touchable, TouchableOpacity, StyleSheet, Image,FlatList} from "react-native";
import auth from '@react-native-firebase/auth';
import callingContext from "../components/callingContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as ImagePicker from 'expo-image-picker';
import { db, storage, getDownloadURL} from '../Firebase Connectivity/Firebase';
import { ref, uploadBytes } from '@firebase/storage';
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where, orderBy, limit,deleteField, arrayRemove, addDoc, deleteDoc, increment, enableMultiTabIndexedDbPersistence } from "firebase/firestore";






const Setting=({navigation})=>{

    const {setUser, setLoading,user}=callingContext();
    const [username,setusername]=useState('')
    const [usersPicture,setUsersPicture]=useState()


    const [usersPoints,setUsersPoints]=useState(null)
    const [otherPeoplesIDs,setOtherPeoplesIDs]=useState([])
    const [otherPeoplesNamesAndPoints,setOtherPeoplesNamesAndPoints]=useState([])

    const [userHasScheduledRuns, setScheduledRuns]=useState(false)
    const [listOfScheduledRuns, setListOfScheduledRuns]=useState([])

    useEffect(()=>{
        const displayProfilePictureNameAndPoints=async()=>{
            const docRef=doc(db,'listOfUsers',user.uid)
            const getUserDocument=await getDoc(docRef)

        if (getUserDocument.exists()&&getUserDocument.data().name && getUserDocument.data().picURL){
            setusername(getUserDocument.data().name)
            setUsersPicture(getUserDocument.data().picURL)
            if(getUserDocument.data().points ){
                setUsersPoints(getUserDocument.data().points)
            }
        }


        }
        displayProfilePictureNameAndPoints()

    },[user.uid])

    useEffect(()=>{

        const gettingOtherUsersPoints=()=>{
            const conversationRef = collection(db, "ConversationsOfUsers");
            const q=query(conversationRef,where('peopleWhoAreMessagingEachOther', 'array-contains', user.uid))
            
              const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const listOfOtherUserIDs=[]
                querySnapshot.forEach((doc) => {
                  
                  if(doc.data().peopleWhoAreMessagingEachOther[0]!==user.uid)
                  {
                    listOfOtherUserIDs.push(doc.data().peopleWhoAreMessagingEachOther[0])
                  }
                  if(doc.data().peopleWhoAreMessagingEachOther[1]!==user.uid){
                    listOfOtherUserIDs.push(doc.data().peopleWhoAreMessagingEachOther[1])
                  }
    
                });
                setOtherPeoplesIDs(listOfOtherUserIDs)
        })
        return unsubscribe;
        }



        gettingOtherUsersPoints();
       
},[otherPeoplesIDs])

useEffect(() => {
    const getOtherPeoplesPoints = async () => {
      if (otherPeoplesIDs) {
        const tempArray = [];
        for (const ID of otherPeoplesIDs) {
          const docRef = doc(db, "listOfUsers", ID);
          const getUserDocument = await getDoc(docRef);
  
          if (getUserDocument.data().points) {
            tempArray.push({
              id: getUserDocument.id,
              name: getUserDocument.data().name,
              points: getUserDocument.data().points,
            });
          }
        }
        setOtherPeoplesNamesAndPoints(tempArray);
      }
    };
    getOtherPeoplesPoints();
  }, [user.uid]);
  
  useEffect(()=>{
    const fetchScheduledRuns=async()=>{
      
      const scheduledRunRef=doc(db,'ScheduleRuns', user.uid)  
      
      const doesDocExist=await getDoc(scheduledRunRef)
      const array=[]
      
      if (doesDocExist.exists()){
        
        const unsub=onSnapshot(scheduledRunRef, (doc)=>{


          if(doc.data().activity){
            doc.data().activity.forEach(element => {
            if(element.points!==0 && element.points){
                array.push(element)
            }    
            });
            setListOfScheduledRuns(array)
        }
        
        setScheduledRuns(true)
      })
      
      return unsub;
      }
    }
    fetchScheduledRuns()
  },[user.uid, listOfScheduledRuns])
    
  
  

    // End of image picker code
    return( 

        <View style={{flex:1}}>
            <Text>{username}</Text>
            <Image source={{uri:usersPicture}}/>
             {
                usersPoints&&(
                    <Text>{usersPoints}</Text>
                )
            } 
            {
                otherPeoplesNamesAndPoints && otherPeoplesNamesAndPoints.map((element)=>{

                    return (<Text key={element.id}>{element.name}: his points are:  {element.points}</Text>)
                })
            }
        <View>
        </View>
        <ScrollView>
        <Text>Setting Screen</Text>
        <Button
        title="Press me"
        onPress={()=>{
            navigation.navigate('edit')
        }} />

        <Button 
        title="Logout"
        onPress={async ()=>{
            setLoading(true)
            await auth().signOut()
            await GoogleSignin.revokeAccess()
            .then(() => 
            console.log('User signed out!'),
            setUser(null))
            .catch((err)=>{console.log(err)})
            setLoading(false)
        }}
        />
        

    </ScrollView>



    <FlatList
         contentContainerStyle={{ flexGrow: 1 }}
         data={listOfScheduledRuns}
   
         renderItem={({ item }) => {

           return (
            <View style={styles.scheduledRunContainer} key={item.UniqueID}>
               <View style={styles.scheduledRunInfo}>
               <Text style={styles.scheduledRunText}>Total Running Time: {item.DateOfRun} minutes</Text>
                 <Text style={styles.scheduledRunText}>Original Planned Runing Time: {item.DurationOfRun} minutes</Text>
                 {/* <Text style={styles.scheduledRunText}>Completed Running Time: {item.} minutes</Text> */}
                 <Text style={styles.scheduledRunText}>Date Of When Run Was Completed: {item.dateRunWasCompleted}</Text>
                 <Text style={styles.scheduledRunText}>Points Achieved: {item.points}</Text>
               </View>
             </View>
           )
         }}
       />
        </View>
    );

}
export default Setting;

const styles=StyleSheet.create({
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
      scheduledRunContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#d4d4d4',
    },
    startButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
    },
    deleteButton: {
      backgroundColor: '#F44336',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    }
})


    // // Modern dateTimePicker.
    // const [calendarOpen,setCalendarOpen]=useState(false)
    // const [maxYear,setMaxYear]=useState(todaysDate.getFullYear()-18)
    // const [maxMonth,setMonth]=useState(todaysDate.getMonth()+1)
    // const [maxDay,setDay]=useState(todaysDate.getDate())
    // const [x,setX]=useState()
    // const [y,setY]=useState()
    // const [z,setZ]=useState()
    // const [hasSelectedDate, setHasUserSelectedDate]=useState(false)
    // const [gettingTheSelectedDate,setGettingTheSelectedDate]=useState();
    // const[young,setYoungness]=useState(false);


    


    // const closeCalendar=()=>{
    //     setCalendarOpen(false);
    // }
    // const seeingCalendar=()=>{
    //     setCalendarOpen(true)
    // }

    

    // const afterSettingDate=(date)=>{
    //     setGettingTheSelectedDate(date)
    //     setHasUserSelectedDate(true)
    //     closeCalendar()
    // }
    // useEffect(() => {
        
        
    //     const yearString=maxYear.toString()
    //     const monthString=maxMonth.toString().padStart(2,'0')
    //     const dayString=maxDay.toString().padStart(2,'0')
        

    //     if (x && y && z)
    //     {

    //     if (Number(yearString)>=Number(x) && Number(monthString)>=Number(y) && Number(dayString)>=Number(z)){
    //         setYoungness(false)
    //         console.log('Your good!')
    //     }
    //     else{
    //         setYoungness(true)
    //         console.log('Too young sorry.')
    //     }
    // }
    //   }, [x, y, z]);

    // useEffect(()=>{
    //     if (gettingTheSelectedDate!==todaysDate || gettingTheSelectedDate!==null){

    //         // gettingTheSelectedDate stores the Year/Month/Day
    //         const h=gettingTheSelectedDate;
    //         if (h){
    //             setX(h.split("/")[0].toString())
    //             setY(h.split('/')[1].toString())
    //             setZ(h.split('/')[2].toString())
    //         }
    //     }
    //     else{
    //         console.log('Error')
    //     }   

    // }, [gettingTheSelectedDate])

    
    
    

    // useEffect(()=>{
    //     console.log(gettingTheSelectedDate)
    // },[gettingTheSelectedDate])

    
    
    
    
    


    // Code For New dateTimepicker
    
    // Todays date. 
    // const [date,setDate]=useState(new Date());

    // const [show, setShow]=useState(false);

    // const [text,setText]=useState('')

    // const onChange=(event,selectedDate)=>{
    //     const currentDate=selectedDate||date
    //     setShow(!show);
    //     setDate(currentDate);

    //     // temoDate gets what currently in the currentDate var
    //     let tempDate=new Date(currentDate);
    //     // formatting the date.
    //     let formatDate=tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear();
    //     setText(formatDate)
    //     console.log(text)
    // }

    // const showings=()=>{
    //     setShow(true)        
    // }


    // Modal DatePicker
    // const [visible,setVisible]=useState(false);
    // const showDatePicker=()=>{
    //     setVisible(true)
    // }
    // const hideDatePicker=()=>{
    //     setVisible(false)
    // }
    // const confirm=()=>{
    //     hideDatePicker()

    // }



        
        {/* Modal Date Time Picker */}

        {/* <DateTimePickerModal
            onConfirm={confirm}
            onCancel={hideDatePicker}
            mode="date"
            />
             */}


{/* Normal Calendar doesnt allow quick changing dates. */}
    {/* <Calendar
        onDayPress={day => {
            setSelected(day.dateString);
        }}
        markedDates={{
            [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
        }}
    /> */}


    {/* <TouchableOpacity
        style={styles.selectDateButton}
        onPress={seeingCalendar}
    >
        <View >
            {
            hasSelectedDate?
            (<Text style={styles.font}>{z + '/' + y + '/' + x}</Text>)
            :
            (
                <Text style={styles.font}>Select Date </Text>
            )
            }
            


            
            </View>

    </TouchableOpacity>
    <View>
    {
                young?
                (
                    <Text style={{color:'red'}}>Too young!</Text>
                ):(
                    <Text></Text>
                )
            }
    </View> */}
    {/* <Modal
        animationType="slide"
        transparent={true}
        visible={calendarOpen}
    >
        <View style={{flex:1, justifyContent:'center' }}>
            <View style={{margin:20, backgroundColor:'white',flexDirection:'column', paddingVertical:12, alignItems:'center', justifyContent:'center', borderRadius:4}}>
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
                    <Text style={{color:'black',fontSize:20 }}>Close</Text>
                </View>
            </TouchableOpacity>
                
            </View>
       </View>

        
    </Modal> */}

// import DateTimePicker from '@react-native-community/datetimepicker'; = https://docs.expo.dev/versions/latest/sdk/date-time-picker/


// import {Calendar} from 'react-native-calendars';

// import DateTimePickerModal from 'react-native-modal-datetime-picker'

// import DatePicker,{ getFormatedDate, getToday } from 'react-native-modern-datepicker';

// const todaysDate = new Date();