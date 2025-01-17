// Import libraries
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Platform, StatusBar, Modal, TextInput, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, {
   useSharedValue,
   withTiming,
   useAnimatedStyle,
   Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient'

// Create a component
const SavesKey = ({ navigation }) => {
   const [savedData, setSavedData] = useState([]);
   const [passwordVisible, setPasswordVisible] = useState(null);
   const [permission, setPermission] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [inputPermissionPassword, setInputPermissionPassword] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [mestra, setMestra] = useState(false);

   const [isEditModalVisible, setIsEditModalVisible] = useState(false)
   const [newPassword, setNewPassword] = useState(false)

   console.log(savedData, 'os dados')
   // Função para buscar dados do AsyncStorage
   useEffect(() => {
      // Função para carregar os dados do AsyncStorage
      const loadData = async () => {
         try {
            const existingData = await AsyncStorage.getItem('dados');
            if (existingData !== null) {
               setSavedData(JSON.parse(existingData));
            } else {
               setSavedData([]);  // Definir como array vazio se não houver dados
            }
         } catch (error) {
            console.log('Erro ao carregar dados: ', error);
         }
      };

      // Chamar a função de carregar dados
      loadData();
      setSavedData([])
   }, []);  // Array de dependências vazio para rodar apenas na montagem do componente


   const randomHeight = useSharedValue(0);
   const config = {
      duration: 500,
      easing: Easing.bezier(0.5, 0.01, 0, 1)
   };

   const style = useAnimatedStyle(() => {
      return { width: withTiming(randomHeight.value, config) };
   });

   const togglePasswordVisible = (index) => {
      if (passwordVisible === index) {
         setPasswordVisible(null);
         randomHeight.value = Math.random() * 350;
      } else {
         setPasswordVisible(index);
         randomHeight.value = Math.random() * 350;
      }
   };
   const handlePasswordCheck = async () => {
      try {
         const storedData = await AsyncStorage.getItem('authData'); // Obtém a senha mestra armazenada
         const stored = storedData ? JSON.parse(storedData) : null;

         if (stored.password && inputPermissionPassword === stored.password) {
            setPermission(true); // Altera o estado permission para liberar a visualização das senhas
            setIsModalVisible(false); // Fecha o modal de senha
         } else {
            alert('Senha de permissão incorreta!'); // Exibe um alerta se a senha estiver errada
         }

         console.log(storedData); // Exibe os dados armazenados no console (para debug)
      } catch (error) {
         console.log('Erro ao verificar a senha de permissão', error); // Exibe erro no console
      }
   };


   const handleRemovePassword = async (item) => {
      try {
         const storedData = await AsyncStorage.getItem('dados');
         const parsedData = JSON.parse(storedData);

         const updatedData = parsedData.filter((data) => data.reason !== item.reason); // Removendo o item
         await AsyncStorage.setItem('dados', JSON.stringify(updatedData)); // Atualizando o AsyncStorage
         /// console.log(updatedData);
         setSavedData(updatedData); // Atualizando o estado

      } catch (error) {
         console.log('Erro ao deletar item', error);
      }
   };


   //compartinhar
   
   const handleAlterarPassword = async (item) => {
      setSelectedItem(item)
      setIsEditModalVisible(true)
   }

   const handleSaveNewPassword = async () => {
      try {
         const storedData = await AsyncStorage.getItem('dados');
         const parsedData = storedData ? JSON.parse(storedData) : [];

         // Atualiza a senha do item selecionado
         const updatedData = parsedData.map((data) => {
            if (data.reason === selectedItem.reason) {
               return { ...data, password: newPassword };  // Atualiza apenas a senha
            }
            return data;
         });

         // Salva os dados atualizados no AsyncStorage
         await AsyncStorage.setItem('dados', JSON.stringify(updatedData));

         // Atualiza o estado com os dados atualizados
         setSavedData(updatedData);
         setIsEditModalVisible(false);  // Fecha o modal de edição
         setNewPassword('');  // Limpa o campo de nova senha
      } catch (error) {
         console.log('Erro ao alterar a senha:', error);
      }
   };

   const toggleMestra = () => {
      setMestra(!mestra)
   }

   // Renderização dos dados salvos
   return (
      <View style={styles.container}>
         <LinearGradient style={styles.header} colors={['#000', '#00ccff', '#000']} start={[0, 0]} end={[1, 3]}>
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
               <Ionicons name='key-outline' size={25} color={'#fff'} />
               <View>
                  <Text style={{ color: '#fff', fontSize: 30, fontWeight: '600', letterSpacing: 1, textTransform: 'capitalize' }}>chaves guardadas!</Text>
                  <Text style={{ color: '#fff', fontSize: 16 }}>total de chaves criadas!</Text>
               </View>

            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Category')}>
               <MaterialIcons name="emoji-objects" size={30} color="#fff" />
            </TouchableOpacity>

         </LinearGradient>

         {savedData.length > 0 ? (
            <ScrollView >
               {savedData.map((item, index) => (
                  <View style={styles.itemContainer} key={index}>



                     <Pressable onPress={() => togglePasswordVisible(index)}>
                        <LinearGradient colors={['#000', '#00CCFF', '#000']} start={[0, 1]} end={[1, 0]}
                           style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#2C3E50', borderTopLeftRadius: 5, borderTopRightRadius: 5, alignItems: 'center', borderBottomLeftRadius: passwordVisible === index ? 0 : 5, borderBottomRightRadius: passwordVisible === index ? 0 : 5 }}
                        >
                           <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={{ color: '#fff', fontSize: 16, textTransform: 'uppercase' }}>{item.reason}</Text>
                              <Feather name={passwordVisible === index ? 'arrow-up' : 'arrow-down'} size={20} color='#fff' />
                           </View>
                        </LinearGradient>
                     </Pressable>
                     {passwordVisible === index && (
                        <View style={[styles.contentContainerStyle]}>
                           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={[styles.itemText, { fontSize: 18, color: '#000' }]}>Senha</Text>
                              <View style={{ flexDirection: 'row' }}>
                                 {
                                    permission ? (
                                       <Text style={[styles.itemText, { fontWeight: '600', fontSize: 18 }]}>{item.password}</Text>
                                    ) : (
                                       <Pressable onPress={() => { setIsModalVisible(true); setSelectedItem(item); }}>
                                          <Feather name={'eye-off'} size={20} color='#000' />
                                       </Pressable>
                                    )
                                 }

                              </View>
                           </View>
                           <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                 <Text style={[styles.itemText, { fontSize: 18, color: '#000' }]}>Categoria</Text>
                                 <Text style={[styles.itemText, { fontWeight: '600', textTransform: 'uppercase', fontSize: 18, color: '#000' }]}>{item.selectValue}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                 <Text style={[styles.itemText, { fontSize: 18, color: '#000' }]}>criado em </Text>
                                 <Text style={[styles.itemText, { fontWeight: '600', textTransform: 'uppercase', fontSize: 18, color: '#000' }]}>{item.createItem}</Text>
                              </View>

                              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                 <LinearGradient
                                    colors={['#000', '#000', '#000']} start={[0, 1]} end={[1, 0]}
                                    style={{ padding: 15, borderRadius: 5, marginTop: 10, alignItems: 'center', flex: 1 }}
                                 >
                                    <Pressable onPress={() => handleRemovePassword(item)}>

                                       <Text style={{ color: '#fff', fontSize: 18, textTransform: 'capilize' }}>Deletar</Text>
                                    </Pressable>
                                 </LinearGradient>
                                 
                                    <LinearGradient
                                       colors={['#000', '#000', '#000']} start={[0, 1]} end={[1, 0]}
                                       style={{ padding: 15, borderRadius: 5, marginTop: 10, alignItems: 'center', flex: 1 }}
                                    >
                                       <Pressable onPress={() => setIsEditModalVisible(true)} style={{flex: 1}}>
                                       <Text style={{ color: '#fff', fontSize: 18, textTransform: 'capitalize' }}>alterar senha</Text>
                                       </Pressable>
                                      
                                    </LinearGradient>
                                    
                                 
                              </View>

                           </View>
                        </View>
                     )}

                  </View>
               ))}
            </ScrollView>
         ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, }}>
               <Text style={styles.noDataText}>Nenhum dado salvo ainda.</Text>
               <Ionicons name='sad-outline' size={20} color={'#000'} />
            </View>
         )}

         <Modal
            visible={isEditModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsEditModalVisible(false)}
         >
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Alterar Senha</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="Digite a nova senha"
                     secureTextEntry={true}
                     value={newPassword}
                     onChangeText={setNewPassword}
                  />
                  <View style={styles.modalButtons}>
                     <TouchableOpacity style={styles.button} onPress={handleSaveNewPassword}>
                        <Text style={styles.buttonText}>Salvar</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.button} onPress={() => setIsEditModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>


         <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
         >
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Digite a senha de permissão</Text>
                  <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                     <View style={styles.input}>
                        <TextInput
                           style={{ width: 250 }}
                           placeholder="Senha de permissão"
                           secureTextEntry={mestra ? false : true}
                           value={inputPermissionPassword}
                           onChangeText={setInputPermissionPassword}

                        />
                        <TouchableOpacity onPress={() => toggleMestra(!mestra)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                           <Ionicons name={mestra ? 'eye-off' : 'eye'} size={24} color='#000' />
                        </TouchableOpacity>
                     </View>


                     
                  </View>

                  <View style={styles.modalButtons}>
                     <TouchableOpacity style={styles.button} onPress={handlePasswordCheck}>
                        <Text style={styles.buttonText}>Confirmar</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </View>
   );
};

// Define your styles
const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 0 : 0,
      justifyContent: 'center',
      backgroundColor: '#fff',
   },
   header: {
      backgroundColor: '#000',
      height: 130,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      gap: 10,
   },
   itemContainer: {
      paddingHorizontal: 10,
      padding: 5,
      marginTop: 5,


   },
   itemText: {
      fontSize: 16,
      marginBottom: 5,
      color: '#000'
   },
   contentContainerStyle: {
      minHeight: 130,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
      overflow: 'hidden',
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      marginTop: -.5,

   },
   noDataText: {
      fontSize: 20,
      color: '#000',
   },
   modalContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '90%',
   },
   modalTitle: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: 'center',

   },
   input: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
   },
   modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 20
   },
   button: {
      backgroundColor: '#2C3E50',
      padding: 15,
      borderRadius: 5,
      flex: 1,

      marginTop: 20
   },
   buttonText: {
      color: '#fff',
      textAlign: 'center',
   },
});

// Export the component
export default SavesKey;
