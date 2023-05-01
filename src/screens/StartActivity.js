import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView,  TouchableHighlight,SafeArea} from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
// import CircularProgress from 'react-native-circular-progress-indicator'

// import { Stopwatch, Timer } from 'react-native-stopwatch-timer'

const StartActivity=({navigation})=>{
    const [isTimerStart, setIsTimerStart] = useState(false);
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

  const togglePauseStart = () => {
    setIsPlaying(!isPlaying);
  };
  const [done,setDone]=useState(false)

    return(
      <View style={{flex:1, alignItems:'center'}}>
         <CountdownCircleTimer
    isPlaying={isPlaying}
    duration={1}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[20, 15, 10, 5]}
    onComplete={()=>{
      setDone(true)
    }}
  >
    {({ remainingTime }) => <Text style={{fontSize:50}}>{remainingTime}</Text>}
  </CountdownCircleTimer>
  <Button title={isPlaying ? 'Pause' : 'Start'} onPress={togglePauseStart} /> 
  {
    done&&(
      <Text>Congrats you have completed the exrercise!</Text>
    )
  }

  <Button 
    title="Finish"
    onPress={()=>{
      navigation.navigate('FinishScreen')

    }}
  />

      </View>
    )
  };


    


export default StartActivity


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      padding: 20,
    },
    sectionStyle: {
      flex: 1,
      marginTop: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 20,
      marginTop: 10,
    },
  });
  
  const options = {
    container: {
      backgroundColor: '#FF0000',
      padding: 5,
      borderRadius: 5,
      width: 200,
      alignItems: 'center',
    },
    text: {
      fontSize: 25,
      color: '#FFF',
      marginLeft: 7,
    },
  };
  


     {/* <CircularProgress
            value={60}
            radius={120}
        duration={2000}
            progressValueColor={'#ecf0f1'}
            maxValue={200}
            title={'KM/H'}
            titleColor={'white'}
            titleStyle={{fontWeight: 'bold'}}
/> */}
 {/* <CircleTimer
                        radius={80}
                        borderWidth={10}
                        seconds={1800}
                        borderColor={'#F5F5F5'}
                        borderBackgroundColor={"#FF0000"}
                        onTimeElapsed={() => {
                            console.log('Timer Finished!');
                        }}
                        showSecond={true}
                    /> */}