// After the user completes an activity, this screen will be shown displaying points, dates etc.
import React,{useEffect, useState} from "react";
import { Text,  TouchableOpacity, StyleSheet,SafeAreaView} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { doc, getDoc,   updateDoc,  increment} from "firebase/firestore";
import callingContext from '../components/callingContext';
import { db } from "../Firebase Connectivity/Firebase";
import { FontAwesome5 } from '@expo/vector-icons';
const FinishScreen=({navigation})=>{
    
    const {user}=callingContext()
    const route = useRoute();
    const totalActivityTime=route.params?.totalActivityTime
    const UniqueID = route.params?.UniqueID;
    const DurationOfRun = route.params?.DurationOfRun;
    const currentDate = route.params?.currentDate;
    const dateOfOriginalRun= route.params?.originalDateOfRun;
    const timeOfOriginalRun= route.params?.timeOfOriginalRun;
    const postCode=route.params?.postCode


    const dateTimeRunTookPlace=new Date(currentDate)

    const [userPoints,setUserPoints]=useState(0)
    const [timeInMinutes,setTimeOfOriginalUserSetInMinutes]=useState(0)
    const [whatUserDidInMinutes,setUserDidInMinutes]=useState(0)

    useEffect(()=>{
      const getPointsForUser=async()=>{
        const getUserPoints=await calculatePoints()
        setUserPoints(getUserPoints)

      }
      getPointsForUser()
    },[user])

    useEffect(()=>{
      const convertMSToMins=()=>{
        setTimeOfOriginalUserSetInMinutes((((Number(DurationOfRun))/1000)/60))
        setUserDidInMinutes((((Number(totalActivityTime))/1000)/60).toFixed(2))


      }
      convertMSToMins()
    })



    // Gets it into millisecondss
    const getTimeZoneOffset = () => {
        const now = new Date();
        return now.getTimezoneOffset() * 60 * 1000;
      };

    //   Will always work since getTimeZoneOffset (UTC vs BST/GMT)
      const correctlyUpdatedOriginalDateTimeOfRun = new Date(
        Date.parse(`${dateOfOriginalRun}T${timeOfOriginalRun}`) + getTimeZoneOffset()
      );
      

    console.log('This is the current date time obejct', dateTimeRunTookPlace)
    console.log('This is the original time  in hours which is ', correctlyUpdatedOriginalDateTimeOfRun)


    

  
    const calculatePoints=async()=>{
        let points=0
        if(!dateOfOriginalRun && !timeOfOriginalRun){
          if(totalActivityTime===DurationOfRun){
            points=50
          }
          else if(totalActivityTime>(DurationOfRun/2)){
            points=30
          }
          else if(totalActivityTime<=(DurationOfRun/2)){
            points=20
          }
        }
        else{

        if(correctlyUpdatedOriginalDateTimeOfRun===dateTimeRunTookPlace && totalActivityTime===DurationOfRun ){
            points=100
        }
        else if
        (correctlyUpdatedOriginalDateTimeOfRun.getFullYear()===dateTimeRunTookPlace.getFullYear() 
        && correctlyUpdatedOriginalDateTimeOfRun.getDate()===dateTimeRunTookPlace.getDate() 
        && correctlyUpdatedOriginalDateTimeOfRun.getMonth()===dateTimeRunTookPlace.getMonth() 
        && correctlyUpdatedOriginalDateTimeOfRun.getHours()>dateTimeRunTookPlace.getHours() 
        && correctlyUpdatedOriginalDateTimeOfRun.getMinutes()>dateTimeRunTookPlace.getMinutes() 
        && totalActivityTime===DurationOfRun
        ){
            points=100
        }
        else if(
            correctlyUpdatedOriginalDateTimeOfRun.getHours()<dateTimeRunTookPlace.getHours() 
            && correctlyUpdatedOriginalDateTimeOfRun.getMinutes()<dateTimeRunTookPlace.getMinutes() 
            &&  totalActivityTime===DurationOfRun
            && correctlyUpdatedOriginalDateTimeOfRun.getFullYear()===dateTimeRunTookPlace.getFullYear() 
            && correctlyUpdatedOriginalDateTimeOfRun.getDate()===dateTimeRunTookPlace.getDate() 
            && correctlyUpdatedOriginalDateTimeOfRun.getMonth()===dateTimeRunTookPlace.getMonth() 
            ){
            points=50
        }
        else if
        (correctlyUpdatedOriginalDateTimeOfRun.getHours()===dateTimeRunTookPlace.getHours() 
        && correctlyUpdatedOriginalDateTimeOfRun.getMinutes()===dateTimeRunTookPlace.getMinutes() 
        && totalActivityTime===DurationOfRun
        && correctlyUpdatedOriginalDateTimeOfRun.getFullYear()!=dateTimeRunTookPlace.getFullYear() 
        && correctlyUpdatedOriginalDateTimeOfRun.getDate()!=dateTimeRunTookPlace.getDate() 
        && correctlyUpdatedOriginalDateTimeOfRun.getMonth()!=dateTimeRunTookPlace.getMonth() 
        ){
            points=40
        }
        else if(totalActivityTime>=(DurationOfRun/2) && correctlyUpdatedOriginalDateTimeOfRun>dateTimeRunTookPlace){
          points=50
        }
        else if((totalActivityTime>(DurationOfRun/2) &&correctlyUpdatedOriginalDateTimeOfRun<dateTimeRunTookPlace )){
            points=30
        }
        else if((totalActivityTime<=(DurationOfRun/2)&&correctlyUpdatedOriginalDateTimeOfRun!=dateTimeRunTookPlace )){
            points=20
        }
      }
        return points;
    }


    const updateUsersPoints=async(pointsForUser)=>{
        const docRef=doc(db,'listOfUsers',user.uid)
        const getDocument=await getDoc(docRef)

            if(pointsForUser>0 && pointsForUser){
              await updateDoc(docRef,{
                points:increment(pointsForUser)
              })

            }
            
    }

    // Updating The Run To Be Completed

    const updatingUserRuns = async (pointsForUser,dateTimeRunTookPlace) => {
      try{
        const docRef = doc(db, 'ScheduleRuns', user.uid);
        const gettingDocToUpdate = await getDoc(docRef);

        if (gettingDocToUpdate.data().activity) {
          console.log('Entered here');

        //   Updates every field in the database.
          const updatedActivity = gettingDocToUpdate.data().activity.map((doc) => {
            console.log('Entered here into the for');
            if (doc.UniqueID === UniqueID) {
              console.log('Into the new if condition');
              return { ...doc, completed: true, points:pointsForUser, timeRunWasCompleted:`${(dateTimeRunTookPlace.getHours()).toString().padStart(2,'0')}: ${(dateTimeRunTookPlace.getMinutes()).toString().padStart(2,'0')}`,dateRunWasCompleted:`${((dateTimeRunTookPlace.getDate()).toString().padStart(2,'0'))}/${((dateTimeRunTookPlace.getMonth()+1).toString().padStart(2,'0'))}/${dateTimeRunTookPlace.getFullYear()}`, ActualCompletedRunTime:totalActivityTime};
            }
            return doc; 
          });
        //   Updates the whole field.
          await updateDoc(docRef, { activity: updatedActivity });
        }

      }
      catch(err){
        // console.log('error user points:', err)
      }
      };
    return (
        <SafeAreaView style={styles.container}>
            <FontAwesome5 name="medal" size={100} color="#346eeb" />
            <Text style={styles.text}>Original Time You Set In Mins: {timeInMinutes}</Text>
            <Text style={styles.text}>What You Completed In Mins: {whatUserDidInMinutes}</Text>
            <Text style={styles.text}>Today's date: 
            {`${dateTimeRunTookPlace.getDate().toString().padStart(2,'0')}/${(dateTimeRunTookPlace.getMonth()+1).toString().padStart(2,'0')}/${dateTimeRunTookPlace.getFullYear()}`}</Text>
            <Text style={styles.text}>Points Earned: {userPoints}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={async()=>{
                    const pointsForUser=await calculatePoints()
                    console.log('Number of points: ',pointsForUser)
                    await updateUsersPoints(pointsForUser)
                    await updatingUserRuns(pointsForUser, dateTimeRunTookPlace)
                    navigation.navigate('ActivityScreen')
                }}
            >
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default FinishScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 18,
        color: '#346eeb',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#346eeb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 1,
        width: 200,
        height: 70,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
});
