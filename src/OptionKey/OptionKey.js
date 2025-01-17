import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Modal, Pressable, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY_GOOGLE = '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'; // Insira sua chave API do Google Cloud Vision
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY_GOOGLE}`;

const AuthModal = ({ visible, onClose, authMethod, onAuthenticate, navigation }) => {
   const [inputPassword, setInputPassword] = useState('');
   const [inputEmail, setInputEmail] = useState('');
   const [permissionName, setPermissionName] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [plan, setPlan] = useState('free')
   const createUser = new Date().toLocaleString('pt-br', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
   })

   const handleAuthentication = async () => {
      try {
         if (authMethod === 'password') {

            if (inputPassword === '' || inputEmail === '' || permissionName === '') {
               Alert.alert('Erro', 'Existe campos vazios')
               return;
            }

            const savedData = await AsyncStorage.getItem('authData');
            const parsedData = savedData ? JSON.parse(savedData) : null;

            if (!parsedData) {
               const newData = {
                  password: inputPassword,
                  name: permissionName,
                  email: inputEmail,
                  createUser: createUser,
                  plan: plan
               };
               await AsyncStorage.setItem('authData', JSON.stringify(newData));
               //Alert.alert('Sucesso', 'Senha mestre criada com sucesso!');
               console.log('Navegando para a página CreatePassword...');
               onAuthenticate();
               navigation.navigate('CreatePassword');
            } else {
               if (inputPassword === parsedData.password) {

                  setTimeout(() => {

                  }, 500);
                  Alert.alert('Sucesso', `Autenticação bem-sucedida! Nome: ${parsedData.name}`);
                  console.log('Navegando para a página após autenticação bem-sucedida...');
                  setInputEmail('')
                  setInputPassword('')
                  setPermissionName('')
                  onAuthenticate();
                  navigation.navigate('CreatePassword');
               } else {
                  Alert.alert('Erro', 'Senha incorreta!');
               }
            }
         } else if (authMethod === 'face') {
            console.log('nada a declarar')
         }
      } catch (error) {
         console.log('Erro na autenticação do usuário!')
      }

   };


   return (
      <Modal visible={visible} transparent={true} animationType="slide" onRequest={() => onClose()}>
         <View style={styles.modalContainer} >
            <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>
                  {authMethod === 'password' ? 'Autenticação por Senha' : 'Autenticação Facial'}
               </Text>

               {authMethod === 'password' ? (
                  <>
                     <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        value={permissionName}
                        onChangeText={text => setPermissionName(text)}
                     />
                     <TextInput
                        style={styles.input}
                        placeholder="Digite e-mail"

                        value={inputEmail}
                        onChangeText={text => setInputEmail(text)}
                     />
                     <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', width: '90%', paddingLeft: 8, padding: 7, borderRadius: 5, marginBottom: 20 }]}>
                        <TextInput

                           placeholder="Digite sua senha"
                           secureTextEntry={!showPassword}
                           value={inputPassword}
                           onChangeText={text => setInputPassword(text)}
                        />


                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                           <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={'#000'} />
                        </TouchableOpacity>
                     </View>
                     <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

                        <TouchableOpacity onPress={() => setPlan('free')} style={plan === 'free' ? styles.selectedButton : styles.buttonOption}>
                           <Text style={plan === 'free' ? { color: '#fff' } : { color: '#000' }}>Gratuito</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPlan('premium')} style={plan === 'premium' ? styles.selectedButton : styles.buttonOption}>
                           <Text style={plan === 'premium' ? { color: '#fff' } : { color: '#000' }}>Premium</Text>
                        </TouchableOpacity>
                     </View>

                  </>
               ) : (
                  <Text>Nada</Text>
               )}
               <View style={{ width: '90%', flexDirection: 'column', gap: 10 }}>

                  <LinearGradient
                     colors={['#000', '#2C3E50', '#000']}
                     start={[0, 1]}
                     end={[1, 0]}
                     style={styles.button}
                  >
                     <TouchableOpacity onPress={handleAuthentication}>
                        <Text style={styles.buttonText}>Autenticar</Text>
                     </TouchableOpacity>
                  </LinearGradient>


                  <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                     <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
               </View>


            </View>
         </View>
      </Modal >
   );
};



const OptionKey = ({ navigation }) => {
   const [authMethod, setAuthMethod] = useState(null);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      const checkAuthStatus = async () => {
         const authenticated = await AsyncStorage.getItem('dados');
         if (authenticated) {
            setIsAuthenticated(true);
            navigation.navigate('CreatePassword');
         }
      };
      checkAuthStatus();
   }, []);

   const openModal = (method) => {
      setAuthMethod(method);
      setIsModalVisible(true);
   };

   const handleAuthenticationSuccess = async () => {


      setIsAuthenticated(true);
      navigation.navigate('CreatePassword');
   };

   return (
      <SafeAreaView style={{ flex: 1 }}>
         {/* <Image source={require('../assets/fundo.png')} style={styles.backgroundImage} /> */}
         <LinearGradient style={{ flex: 1 }} colors={['#1a1a1a', '#00ccff', '#1a1a1a']} start={[0, 0]} end={[1, 1]}>
            <View style={styles.container}>
               <Image source={require('../../assets/splash-logo.png')} style={styles.logo} />
               <View style={styles.header}>
               </View>

               <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, }} onPress={() => openModal('password')}>
                  <LinearGradient
                     colors={['#000', '#2C3E50', '#000']}
                     start={[0, 1]}
                     end={[1, 0]}
                     style={styles.optionButton}
                     
                  >
                     
                        <Text style={styles.optionText}>Criar Senha Mestra</Text>
                        <Ionicons name='arrow-forward' size={24} color={'#fff'} />
                     
                  </LinearGradient>
               </TouchableOpacity>
               

               <AuthModal
                  visible={isModalVisible}
                  onClose={() => setIsModalVisible(false)}
                  authMethod={authMethod}
                  onAuthenticate={handleAuthenticationSuccess}

               />
            </View>
         </LinearGradient>
      </SafeAreaView>
   );
};

// Estilos
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      //backgroundColor: '#00ccff'
   },
   backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
   },
   logo: {
      width: 400,
      height: 350,
      resizeMode: 'contain',
   },
   header: {
      alignItems: 'center',

   },
   headerText: {
      fontSize: 30,
      fontWeight: '600',
      color: '#fff',
   },
   subHeaderText: {
      fontSize: 18,
      fontWeight: '400',
      color: '#fff',
      width: '90%',
      textAlign: 'center',
   },
   optionsContainer: {

      alignItems: 'center',
      width: '100%',
   },
   optionButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      padding: 20,
      borderRadius: 8,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      elevation: 5
   },
   optionText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '500'
   },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '90%',
      alignItems: 'center',
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 15,
   },
   modalText: {

      fontSize: 16,
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
   },
   input: {
      width: '90%',
      padding: 18,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
   },
   button: {
      backgroundColor: '#4878b8',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
   },
   cancelButton: {
      width: '100%',
      padding: 10,
      alignItems: 'center',
   },
   cancelButtonText: {
      fontWeight: '500',
      fontSize: 16
   },
   toggleButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#4878b8',
      borderRadius: 5,
      color: '#fff',
      textAlign: 'center',
   },
   selectedButton: {
      backgroundColor: '#000',
      width: 130,
      padding: 18,
      alignItems: 'center',
      borderRadius: 5
   },
   buttonOption: {

      width: 130,
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#000'
   }

})

export default OptionKey 