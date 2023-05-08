import React , { useState, useMemo, useEffect} from "react";
import { Text,Button,View, Platform, ScrollView, Touchable, TouchableOpacity, StyleSheet, Image,FlatList} from "react-native";
import auth from '@react-native-firebase/auth';
import callingContext from "../components/callingContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as ImagePicker from 'expo-image-picker';
import { db, storage, getDownloadURL} from '../Firebase Connectivity/Firebase';
import { ref, uploadBytes } from '@firebase/storage';
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where, orderBy, limit,deleteField, arrayRemove, addDoc, deleteDoc, increment, enableMultiTabIndexedDbPersistence } from "firebase/firestore";

import { AntDesign } from '@expo/vector-icons'; 




const Setting=({navigation})=>{

    const {setUser, setLoading,user}=callingContext();
    const [username,setusername]=useState('')
    const [usersPicture,setUsersPicture]=useState()


    const [usersPoints,setUsersPoints]=useState(null)
    const [otherPeoplesIDs,setOtherPeoplesIDs]=useState([])
    const [otherPeoplesNamesAndPoints,setOtherPeoplesNamesAndPoints]=useState([])

    const [currentUserNameAndPoints,setCurrentUserNameAndPoints]=useState([])

    const [userHasScheduledRuns, setScheduledRuns]=useState(false)
    const [listOfScheduledRuns, setListOfScheduledRuns]=useState([])
    const [allUserNamesAndPoints,setAllUserNamesAndPoints]=useState([])

    useEffect(()=>{
        const displayProfilePictureNameAndPoints=async()=>{
            const docRef=doc(db,'listOfUsers',user.uid)
            
            const unsub=onSnapshot(docRef,(doc)=>{
                if (doc.exists()&&doc.data().name && doc.data().picURL){
                    setusername(doc.data().name)
                    setUsersPicture(doc.data().picURL)
                    if(doc.data().points ){
                        setUsersPoints(doc.data().points)
                        setCurrentUserNameAndPoints({
                            personName:doc.data().name,
                            personPoints:doc.data().points
                        })
                    }
                }

            })
            return unsub;

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
       
},[otherPeoplesIDs, user.uid])

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
              personName: getUserDocument.data().name,
              personPoints: getUserDocument.data().points,
            });
          }
        }
        setOtherPeoplesNamesAndPoints(tempArray);
        if (currentUserNameAndPoints){
            tempArray.push(currentUserNameAndPoints)
        }
        setAllUserNamesAndPoints(tempArray.sort((a,b)=>{
            return b.personPoints-a.personPoints
        }))
      }
    };
    getOtherPeoplesPoints();
  }, [user.uid, otherPeoplesIDs, currentUserNameAndPoints]);
  
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


//   useEffect(()=>{
//     let array=[]
//     if(otherPeoplesNamesAndPoints){
//         otherPeoplesNamesAndPoints.map((element)=>{
//             array.push({
//                 personName:element.name,
//                 personsPoints:element.points
//             })
//         })
        
        
//     }
//     if(username && usersPoints && !array.includes(username)){
//         array.push({
//             personName:username,
//             personsPoints:usersPoints
//         })
        
//     }

    
    


//   },[ usersPoints, user.uid])
    
  
  

    // End of image picker code
    return( 

        <View style={{flex:1}}>
         

        
            <View style={{flexDirection:'row'}}>

            <Image source={{uri:usersPicture}} style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: '#ccc',
            overflow: 'hidden',
            paddingLeft:20
            }}/>
            <View style={{flexDirection:'column', paddingLeft:10}}>
            <Text style={{color:'black', textAlign:'center',fontSize:40, fontWeight:'bold'}}>{username}</Text>
            {
                usersPoints&&(
                    <Text style={{color:'black', textAlign:'center',fontSize:30, fontWeight:'bold'}}> Points: {usersPoints}</Text>
                )
            } 
            </View>
            </View>
            
             
           
        <View>
        </View>
        <ScrollView>

        <TouchableOpacity onPress={()=>{
            navigation.navigate('edit')
        }}
        style={styles.editProfileButton}
        
        >
            <Text style={{textAlign:'center', color:'#FFF', fontWeight: 'bold'}}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={()=>{
            if(listOfScheduledRuns){
                {console.log(listOfScheduledRuns)}
                navigation.navigate('ViewPastRuns', {
                    
                    data:{listOfScheduledRuns}
                })
            }
           
        }}
        style={styles.previousRuns}
        >
            <Text style={{textAlign:'center', color:'#FFF', fontWeight: 'bold'}}>Previous Runs</Text>
        </TouchableOpacity>

        <TouchableOpacity
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
        style={styles.logoutbutton}
        >
        <Text style={{textAlign:'center', color:'#FFF', fontWeight: 'bold'}}>Logout</Text> 
        </TouchableOpacity>


        
        <Text style={{color:'black', fontSize:30, alignSelf:'center', paddingTop:10, fontWeight:'bold'}}>LEADERBOARD</Text>
        

        <ScrollView style={{height:110}}>
        {
        allUserNamesAndPoints && allUserNamesAndPoints.length > 0 && allUserNamesAndPoints.map((element, index) => {
            let rank=index
                return (
                    <View key={index} style={styles.leaderboardItem}>
                    
                        
                    <Text style={{fontSize: 20,paddingLeft: 10}}>{rank+1}</Text>
                    <Text style={styles.leaderboardName}>{element.personName}</Text>
                    <Text style={styles.leaderboardPoints}>Points: {element.personPoints}</Text>
                    
                    </View>
            )
        }
        )
    }
    </ScrollView>




    </ScrollView>
  
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
    },
    editProfileButton:{
        
            backgroundColor: '#346eeb',
            borderRadius: 20,
            padding: 10,
            width: '80%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom:10
    },
    previousRuns:{
        
        backgroundColor: '#346eeb',
        borderRadius: 20,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom:10
    },
    logoutbutton:{
        backgroundColor: '#346eeb',
        borderRadius: 20,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom:10

    },


leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
borderRadius: 10,
    padding: 10,
        marginBottom: 10,
    },
    leaderboardRank: {
        fontSize: 18,
        fontWeight: "bold",
        },
leaderboardName: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    fontWeight:'bold'
},
leaderboardPoints: {
    fontSize: 18,
    fontWeight: "bold",
    },


      
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