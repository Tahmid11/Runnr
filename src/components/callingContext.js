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

