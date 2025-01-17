//import liraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ModalLoading from '../modal/modalLoading';

// create a component
export default function Initial({ navigation }) {

   const [loading, setLoading] = useState(false)

   function handleLoading() {

      setTimeout(() => {
         setLoading(true)
         setTimeout(() => {
            navigation.navigate('CreatePassword')
            setLoading(false)
         }, 1000);
      }, 2000);

   }

   useEffect(() => {

      handleLoading()

   }, [])

   return (

      <View style={styles.container}>

         <Image source={require('../assets/adaptive-icon.png')} style={{ width: 300, height: 200, objectFit: 'contain' }} />
         <ModalLoading visible={loading} />
      </View>

   );
};

// define your styles
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EDBB00',
   },
});

