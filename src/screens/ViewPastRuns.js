
import React,{useState, useEffect} from "react";
import { View, Text, FlatList, StyleSheet} from "react-native";
import { useRoute } from '@react-navigation/native';
import callingContext from "../components/callingContext";
import { db, storage, getDownloadURL} from '../Firebase Connectivity/Firebase';
import { collection, doc, getDoc,  getDocs, updateDoc, arrayUnion, onSnapshot, setDoc, query, where, orderBy, limit,deleteField, arrayRemove, addDoc, deleteDoc, increment, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
const ViewPastRuns=({navigation})=>{

  const route = useRoute();
  const{user}=callingContext()
  
  const [listOfScheduledRuns, setListOfScheduledRuns]=useState([])
  useEffect(()=>{
    const fetchScheduledRuns=async()=>{
      const scheduledRunRef=doc(db,'ScheduleRuns', user.uid)  
      const doesDocExist=await getDoc(scheduledRunRef)
      const array=[]
      if (doesDocExist.exists()){
        const unsub=onSnapshot(scheduledRunRef, (doc)=>{
          if(doc.data().activity){
            doc.data().activity.forEach(element => {
            if(element.points>=0 && element.points && element.completed && element.completed===true){
                array.push(element)
            }    
            });
            setListOfScheduledRuns(array.reverse())
        }
      })
      return unsub;
      }
    }
    fetchScheduledRuns()
  },[user.uid, listOfScheduledRuns])

    return (
      <View>
      <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      data={listOfScheduledRuns}
      renderItem={({ item }) => {
        return (
         <View style={styles.scheduledRunContainer} key={item.UniqueID}>
            <View style={styles.scheduledRunInfo}>
            <Text style={styles.scheduledRunText}>Date Of Run: {item.DateOfRun}</Text>
              <Text style={styles.scheduledRunText}>Run Duration: {item.DurationOfRun} minutes</Text>
              <Text style={styles.scheduledRunText}>Date Of When Run Was Completed: {item.dateRunWasCompleted}</Text>
              <Text style={styles.scheduledRunText}>Points Achieved: {item.points}</Text>
            </View>
          </View>
        )
      }}
    />

      
          
</View>
      

    )


}

export default ViewPastRuns;

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