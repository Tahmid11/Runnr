import React,{createContext, useContext, useState, useEffect, useMemo} from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import 'expo-dev-client';

const userContext=createContext({});
GoogleSignin.configure({
        webClientId: '821295978995-uo6acice4frciqk5isf902uvapi3sr9f.apps.googleusercontent.com',
      });


export const DiffProvider=({children})=>{
    async function onGoogleButtonPress() {
      setLoading(true)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken); 
    return auth().signInWithCredential(googleCredential);
  }
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isLoading,setLoading]=useState(false);
  function onAuthStateChanged(user) {
    try{
        setUser(user);
      if (initializing) {
        setInitializing(false)
        
      }}
    catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);
  
  const cachedValue=useMemo(()=>({
    user,
    onGoogleButtonPress,
    setUser,
    isLoading,
    setLoading,
    initializing
  }),[user,initializing,isLoading]);
    return(
        <userContext.Provider value={cachedValue}>{!initializing && children}</userContext.Provider>
        
    )
};
export default function callingContext(){
    return useContext(userContext);
}


// Initial state of the context, will be blank.
// context in react native allows for the passing of data between components.
// Custom Hook To Use in App.js
// Cant call this function without it being a child of DiffProvider.
// Using the useContext hook to retrieve the current value of 'userContext' variable which can be used in 
// other components.

// userContext.Provider -Making use of userContext variable
        //  is a component which is providing data to the children components.
        // The value property will be the one sending the data to the children.
        // the userContext variable will then store whatever 'value' prop stores.

      // initializing blocks ui...?
      // Passing in cachedValues... give the previous value if nothing has changed.
      // unsubscribe on unmount
      // Sign-in the user with the credential (Firebase)- 
    // There is no try and catch block; I always assume they correctly sign in.
    // Returns a promise to see if the login was successful or not.

      // unsubscribe on unmount

      // have a picture of loading spinner before the if statement.
    // if (initializing) 

    // if(user){// When user state is changed, this function is called.
    // The destructured argument in the component DiffProvider, is a way to render the child components of DiffProvider.
    // Check if your device supports Google Play

    // }
    // Create a Firebase credential with the ID token since they sign with their google // The initialising variable is keep track of whether the authentication process has happened or not.// 'user' stores user information.