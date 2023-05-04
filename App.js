// import 'react-native-get-random-values'
// import { v4 as uuidv4 } from 'uuid';
import Navigation from "./src/navigation/Navigation";
import { DiffProvider } from "./src/components/callingContext";
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from "react";


// import messaging from '@react-native-firebase/messaging';








export default function App() {
  // useEffect(()=>{
  //   pushNoitifs()
  // },[])
  // const pushNoitifs=async()=>{
  //   const fcmToken=await messaging().getToken()
  //   if (fcmToken){
  //     console.log('This is the token', fcmToken)
  //   }

  // }

  
  
  return (
    
    <DiffProvider>
      <Navigation/>
    </DiffProvider>
    
   
  )
};
