// import 'react-native-get-random-values'
// import { v4 as uuidv4 } from 'uuid';
import Navigation from "./src/navigation/Navigation";
import { DiffProvider } from "./src/components/callingContext";
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from "react";


export default function App() {
  
  
  return (
    
    <DiffProvider>
      <Navigation/>
    </DiffProvider>
    
   
  )
};
