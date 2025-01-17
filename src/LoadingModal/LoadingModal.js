// Import necessary libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Alert } from 'react-native';

// Create LoadingModal component
const LoadingModal = ({ visible, onClosed }) => {
   const [dataPlan, setDataPlan] = useState('');
   const [user, setUser] = useState('')
   const [showModal, setShowModal] = useState(visible);

   // Fetch user plan data from AsyncStorage
   const handlePlanUser = async () => {
      try {
         const plan = await AsyncStorage.getItem('authData');
         const planParse = plan ? JSON.parse(plan) : null;
         if (planParse) {
            setUser(planParse)
         }
         if (planParse && planParse.plan) {
            setDataPlan(planParse.plan);

            if (planParse.plan === 'premium') {
               const firstAccess = await AsyncStorage.getItem('premiumFirstAccess');
               if (!firstAccess) {
                  // First access for premium, so set the flag and show modal
                  await AsyncStorage.setItem('premiumFirstAccess', 'true');
                  setShowModal(true);
               } else {
                  // Not the first access, don't show the modal
                  setShowModal(false);
               }
            } else {
               // Free plan, keep showing the modal until upgrade
               setShowModal(true);
            }
         } else {
            console.log('No plan data found');
         }

      } catch (error) {
         console.log('Error fetching plan data', error);
      }
   };
   const handlePlanPremium = async () => {
      try {
         if (user) {
            const updatePlan = { ...user, plan: 'premium' }
            await AsyncStorage.setItem('authData', JSON.stringify(updatePlan))
            setDataPlan('premium')
            setShowModal(false)
            Alert.alert('Sucesso!', 'Agora você é um usuário PREMIUM!')
            console.log('veja os dados:', dataPlan);
         }
      } catch (error) {
         console.log('Erro ao fazer assinatura');
      }
      handlePlanUser()
   }

   useEffect(() => {
      handlePlanUser();
   }, [dataPlan]);

   return (
      <Modal
         animationType='fade'
         transparent={true}
         visible={showModal}
         onRequestClose={() => { onClosed() }}
      >
         <Pressable onPress={() => setShowModal(false)} style={styles.container}>
            {dataPlan === 'free' ? (
               <View style={styles.contentContainer}>
                  <Text style={{ fontSize: 18}}>Boas-Vindas, <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{user.name}</Text></Text>
                  
                  <Text style={{}}>Você esta no Plano <Text style={{ fontWeight: 'bold' }} >{dataPlan}</Text></Text>
                  <Text>Seu Acesso e permissões são limitados!</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                     <Pressable onPress={() => setShowModal(false)} style={{ width: '50%', borderRadius: 5, backgroundColor: '#000', padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Não Assinar Agora</Text>
                     </Pressable>
                     <Pressable onPress={() => handlePlanPremium()} style={{ width: '50%', borderRadius: 5, backgroundColor: '#000', padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Assinar Premium</Text>
                     </Pressable>
                  </View>

               </View>
            ) : (
               <View style={styles.contentContainer}>
                  <Text>Boas-Vind(a)os {dataPlan.name}</Text>
                  <Text>You are on the {dataPlan} plan</Text>
                  <Text>You have full access to the app content</Text>
                  <Pressable onPress={() => setShowModal(false)} style={{ width: '90%' }}>
                     <Text>Exit</Text>
                  </Pressable>
               </View>
            )}
         </Pressable>
      </Modal>
   );
};

// Define component styles
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000599',
   },
   contentContainer: {
      width: '90%',
      padding: 15,
      backgroundColor: 'white',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
   },
});

export default LoadingModal;
