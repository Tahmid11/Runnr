import React from "react";
import { Text, View, TextInput, TouchableOpacity, Modal,Image,StyleSheet, ScrollView,  TouchableHighlight,SafeAreaView, Button} from 'react-native'



const FinishScreen=({navigation})=>{
    return(
        <View>
            <Text>Some medal.</Text>
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate('ActivityScreen')
                }}
            >
                <Text>Done</Text>

            </TouchableOpacity>
        </View>
    )
}

export default FinishScreen;