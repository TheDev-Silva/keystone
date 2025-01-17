import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SelectItem = ({ placehoder, value, label, onChange, options }) => {
   const [isVisible, setIsVisible] = useState(false);

   return (
      <View style={styles.container}>
         <Pressable
            style={{
               width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, shadowColor: '#000',
               shadowOffset: { width: 1, height: 3 },
               shadowOpacity: 0.5,
               shadowRadius: 10,
               elevation: 5,
            }}
            onPress={() => setIsVisible(true)}
         >
            <Text style={{ fontSize: 18, color: '#000' }}>{value ? options.find(option => option.value === value)?.label : placehoder}</Text>
            <Feather name={isVisible ? 'arrow-up' : 'arrow-down'} size={24} color='#000' style={{ fontWeight: '600' }} />
         </Pressable>

         <Modal
            visible={isVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setIsVisible(false)}
         >
            <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
               <View style={styles.modalContent}>
                  <FlatList
                     contentContainerStyle={{ gap: 10 }}
                     data={options} // Use the passed "options"
                     keyExtractor={(item) => item.value}
                     renderItem={({ item, index }) => (
                        <TouchableOpacity
                           style={styles.option}
                           onPress={() => {
                              if (onChange) {
                                 onChange(item.value); // Pass the selected value back
                              }
                              setIsVisible(false);
                           }}
                           key={index}
                        >
                           <LinearGradient
                              colors={['#000', '#2C3E50', '#000']}
                              start={[1, 0]}
                              end={[0, 1]}
                              style={{ width: '100%', padding: 20, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                           >
                              <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>{item.label}</Text>
                           </LinearGradient>
                        </TouchableOpacity>
                     )}
                  />
               </View>
            </Pressable>
         </Modal>
      </View>
   );
};

// define your styles
const styles = StyleSheet.create({
   container: {
      width: '100%',

   },
   overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(25, 25, 25, 0.5)',

   },
   modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
   },
   option: {
      width: '100%',
      alignItems: 'center',
      borderRadius: 5
   },
});

export default SelectItem;
