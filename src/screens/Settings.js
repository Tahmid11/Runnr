// Setting Page where user can edit their profile, logout and view past scheduled runs.

import React , { useState,  useEffect} from "react";
import { Text,View,  ScrollView, TouchableOpacity, StyleSheet, Image} from "react-native";
import auth from '@react-native-firebase/auth';
import callingContext from "../components/callingContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { db} from '../Firebase Connectivity/Firebase';
import { collection, doc, getDoc,   onSnapshot,  query, where } from "firebase/firestore";






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
        const gettingOtherUsersIDs=()=>{
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

        gettingOtherUsersIDs();
       
},[otherPeoplesIDs, user.uid])







useEffect(() => {
    const getOtherPeoplesPoints = async () => {
      if (otherPeoplesIDs) {
        const tempArray = [];
        for (const ID of otherPeoplesIDs) {
          const docRef = doc(db, "listOfUsers", ID);
          const getUserDocument = await getDoc(docRef);
          
          if (getUserDocument.data().points!==undefined) {
            tempArray.push({
              id: getUserDocument.id,
              personName: getUserDocument.data().name,
              personPoints: getUserDocument.data().points,
            });
          }
        }
        setOtherPeoplesNamesAndPoints(tempArray);
        if (currentUserNameAndPoints && currentUserNameAndPoints.personPoints !== undefined){
            tempArray.push(currentUserNameAndPoints)
        }
        setAllUserNamesAndPoints(tempArray.sort((a,b)=>{
            return b.personPoints-a.personPoints
        }))
      }
    };
    getOtherPeoplesPoints();
  }, [user.uid, otherPeoplesIDs, currentUserNameAndPoints]);
  
  


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
            // if(listOfScheduledRuns){
                {console.log(listOfScheduledRuns)}
                // navigation.navigate('ViewPastRuns', {
                    
                //     data:{listOfScheduledRuns}
                // })
                navigation.navigate('ViewPastRuns')
            // }
           
        }}
        style={styles.previousRuns}
        >
            <Text style={{textAlign:'center', color:'#FFF', fontWeight: 'bold'}}>Previous Scheduled Runs</Text>
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
        

        <ScrollView style={{height:150}}>
        {
            allUserNamesAndPoints && allUserNamesAndPoints.length>0?(
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
            ):(
                null
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
        paddingHorizontal: 1, 
        paddingVertical: 1,
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

