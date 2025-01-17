//import liraries
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView, Alert, Modal, Pressable, BackHandler } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import SelectItem from '../Select/SelectItem';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import LoadingModal from '../LoadingModal/LoadingModal';
import { Feather } from '@expo/vector-icons';


// create a component
const CreatePassword = () => {
   const navigation = useNavigation()
   const [password, setPassword] = useState('')
   const [reason, setReason] = useState('')
   //const [permissionPassword, setPermissionPassword] = useState('')
   const [data, setData] = useState([])
   const [nameSpace, setNameSpace] = useState('')
   const [emailSpace, setEmailSpace] = useState('')
   const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
   const [selectValue, setSelectedValue] = useState('')
   const [inputDelete, setInputDelete] = useState('')

   const [loadingVisible, setLoadingVisible] = useState(true)

   const createItem = new Date().toLocaleString('pt-br', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
   })

   //console.log(createItem)
   const [modalUser, setModalUser] = useState(false)
   //console.log('dados de data: ', data)
   const optionsMotive = [
      { label: 'Cartão de Crédito', value: 'cartão de crédito' },
      { label: 'Aplicativo', value: 'aplicativo' },
      { label: 'Redes Sociais', value: 'redes sociais' },
      { label: 'Outros', value: 'outros' },
   ]

   async function handleSave() {
      try {
         if (password !== '' && selectValue !== '' && (selectValue === 'outros' ? reason !== '' : true)) {

            // Criar um novo objeto com os dados
            const newEntry = {
               password: password,
               reason: reason,
               selectValue: selectValue,
               createItem: createItem
            };

            // Recuperar dados existentes no AsyncStorage
            const existingData = await AsyncStorage.getItem('dados');
            let updatedData = [];


            // Se já houver dados salvos, adicioná-los ao array
            if (existingData !== null) {
               updatedData = JSON.parse(existingData);
            }

            // Adicionar a nova entrada ao array existente
            updatedData.push(newEntry);
            // Salvar o array atualizado no AsyncStorage
            await AsyncStorage.setItem('dados', JSON.stringify(updatedData));
            //console.log('Dados salvos: ', updatedData);

            // Navegar para a próxima tela após salvar
            setTimeout(() => {
               setData(updatedData);
               setPassword('')
               setReason('')
               setSelectedValue('')
               navigation.navigate('SavesKey');
            }, 500);
         } else {
            Alert.alert('Atenção:', 'Por favor, preencha todos os campos.');
         }
      } catch (error) {
         console.log('Erro ao salvar dados', error);
      }
   }

   const userName = async () => {
      try {
         const nameData = await AsyncStorage.getItem('authData')
         const name = nameData ? JSON.parse(nameData) : null
         console.log(name)
         if (name.name && name.email) {
            setNameSpace(name)
            setEmailSpace(name)
         }
      } catch (error) {
         console.log('Não foi posivel recuperar nome de usuario')
      }
   }

   useEffect(() => {
      const checkUserAuthentication = async () => {
         const authData = await AsyncStorage.getItem('authData');
         const auth = authData ? JSON.parse(authData) : null;

         if (!auth || !auth.name || !auth.email) {
            Alert.alert('Atenção', 'Você precisa estar autenticado para continuar.');
            navigation.navigate('Login'); // Redireciona para a tela de login
         } else {
            userName();
         }
      };

      checkUserAuthentication();

   }, []);




   const ModalDelete = ({ visible, onClosed }) => {
      const [localInputDelete, setLocalInputDelete] = useState();

      const handleDeleteCredentialLogin = async () => {
         try {
            const auth = await AsyncStorage.getItem('authData');
            const authParse = auth ? JSON.parse(auth) : null;

            // Verifica se a senha mestra é a mesma digitada
            if (authParse && authParse.password === localInputDelete) {
               // Remove credenciais do AsyncStorage
               await AsyncStorage.removeItem('authData');
               await AsyncStorage.removeItem('dados');

               // Exibe uma mensagem de sucesso
               Alert.alert('Sucesso', 'Usuário e credenciais deletados com sucesso.');
               navigation.navigate('Pager')
               // Fecha o modal
               setIsModalDeleteVisible(false);
               // Redireciona o usuário para a tela 'OptionKey'
               /* setTimeout(() => {
                  navigation.goBack('Paper');
               }, 500); */
            } else {
               // Caso a senha mestra esteja incorreta
               Alert.alert('Atenção', 'Senha mestra incorreta!');
            }
         } catch (error) {
            console.log('Erro ao tentar apagar credencial:', error);
         }
      };



      return (
         <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={() => onClosed()}
         >
            <View

               style={{ width: '100%', flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}
            >
               <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '90%', padding: 20, backgroundColor: '#fff', gap: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                     <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' }}>Atenção</Text>
                        <View style={{ fledDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                           <Text style={{ fontSize: 17 }}>Apagando sua credencial, será </Text>
                           <Text style={{ fontSize: 17, fontWeight: 'bold' }}> impossível <Text style={{ fontSize: 17, fontWeight: 'normal' }}>recuperar novamente seus dados!</Text></Text>

                        </View>

                     </View>
                     <View style={{
                        width: '104%', backgroundColor: '#fff', minHeight: 45, borderRadius: 5, justifyContent: 'center', shadowColor: '#000',
                        shadowOffset: { width: 1, height: 3 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 5,
                     }}>
                        <TextInput
                           placeholder='digite sua senha mestra'
                           value={localInputDelete}
                           onChangeText={text => setLocalInputDelete(text)}
                           style={{ fontSize: 18, color: '#000', padding: 15 }}
                           secureTextEntry={true}
                        />
                     </View>
                     <View style={{
                        width: '95%', flexDirection: 'row',
                        justifyContent: 'center', alignItems: 'center', gap: 30,
                     }}>
                        <TouchableOpacity onPress={handleDeleteCredentialLogin} style={{ width: '50%' }}>

                           <LinearGradient
                              colors={['#000', '#2C3E50', '#000']}
                              start={[1, 0]}
                              end={[0, 1]}
                              style={{ width: '100%', backgroundColor: '#2C3E50', padding: 15, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                           >
                              <Text style={{ color: '#fff', fontSize: 18 }}>Apagar</Text>
                           </LinearGradient>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={onClosed} style={{ width: '50%' }}>
                           <LinearGradient
                              colors={['#000', '#2C3E50', '#000']}
                              start={[1, 0]}
                              end={[0, 1]}
                              style={{ width: '100%', backgroundColor: '#2C3E50', padding: 15, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                           >
                              <Text style={{ color: '#fff', fontSize: 18 }}>Abortar</Text>
                           </LinearGradient>
                        </TouchableOpacity>


                     </View>
                  </View>

               </View>
            </View>
         </Modal>
      )
   }

   const ModalUser = ({ visible, onClosed }) => {
      const [person, setPerson] = useState('')

      const user = async () => {
         try {
            const userPerson = await AsyncStorage.getItem('authData')
            const personParse = userPerson ? JSON.parse(userPerson) : null
            if (personParse && personParse.name) {
               setPerson(personParse)
            }
         } catch (error) {
            console.log('Erro ao buscar usuário!')
         }
      }

      user()


      return (
         <Modal
            animationType='slide'
            visible={visible}
            transparent={true}
            onRequestClose={() => { onClosed() }}

         >
            <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 }}
               onPress={() => setModalUser(false)}
            >


               <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 }}>
                  <View style={{ fledDirection: 'column', width: '80%', minHeight: 100, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', padding: 10, gap: 10 }}>

                     <Text style={{ fontSize: 25, fontWeight: 'bold', textTransform: 'capitalize' }}>Dados Cadastras</Text>

                     <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f1f1f1', shadowColor: '#000', shadowOffset: { width: 1, height: 0 }, shadowOpacity: 5, shadowRadius: 5, elevation: 2, padding: 15, borderRadius: 5 }}>
                        <Text style={{ fontSize: 16 }}>Nome: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{person.name}</Text>
                     </View>

                     <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f1f1f1', shadowColor: '#000', shadowOffset: { width: 1, height: 0 }, shadowOpacity: 5, shadowRadius: 5, elevation: 2, padding: 15, borderRadius: 5 }}>
                        <Text style={{ fontSize: 16 }}>E-mail: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{person.email}</Text>
                     </View>

                     <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f1f1f1', shadowColor: '#000', shadowOffset: { width: 1, height: 0 }, shadowOpacity: 5, shadowRadius: 5, elevation: 2, padding: 15, borderRadius: 5 }}>
                        <Text style={{ fontSize: 16 }}>Criado em: </Text>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>{person.createUser}</Text>
                     </View>

                  </View>


               </View>

            </Pressable>
         </Modal>
      )
   }
   const [passwordOculte, setPasswordOculte] = useState(false)

   const togglePassword = () => {
      setPasswordOculte(!passwordOculte)
   }

   return (
      <SafeAreaView style={styles.container} >
         <LinearGradient style={styles.header} colors={['#000', '#00ccff', '#000']} start={[0, 0]} end={[1, 3]}>

            <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
               <View style={{ flexDirection: 'column', justifyContent: 'center' }}>

                  <View style={{ flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center' }}>
                     <TouchableOpacity onPress={() => setModalUser(true)} style={{ backgroundColor: '#2C3E50', width: 50, height: 50, borderRadius: 120, justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', fontWeight: 'bold' }}>{nameSpace.name[0]}</Text>
                        {nameSpace.plan === 'premium' && <Ionicons name='star' color={'#ff5'} size={15} style={{ position: 'absolute', right: 0, top: -2 }} />}
                     </TouchableOpacity>

                     <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '400', letterSpacing: 1 }}>Olá, <Text style={{ fontSize: 18, fontWeight: '500' }}>{nameSpace.name}</Text></Text>
                        <Text style={{ color: '#fff', fontSize: 14 }}>{emailSpace.email}</Text>
                     </View>

                  </View>

               </View>

            </View>



            <View>

               <TouchableOpacity onPress={() => navigation.navigate('SavesKey')}>
                  <MaterialCommunityIcons name="content-save-move-outline" size={30} color="#fff" />
                  {data.length > 0 ? <View style={{ width: 13, height: 13, borderRadius: 100, backgroundColor: '#f00', position: 'absolute', right: 1, bottom: 0 }}></View> : null}
               </TouchableOpacity>


            </View>

         </LinearGradient>

         <View style={{ flex: 1, width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: 20, paddingBottom: 20 }}>
            <View style={styles.content}>

               <View style={{
                  width: '95%', backgroundColor: '#fff', height: 45, borderRadius: 5, justifyContent: 'center', shadowColor: '#000',
                  shadowOffset: { width: 1, height: 3 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 5,
               }}>
                  <SelectItem
                     options={optionsMotive}
                     placehoder='selecione a categoria para'
                     value={selectValue}
                     label={selectValue}
                     onChange={setSelectedValue}

                  />
               </View>
               {selectValue ? (
                  <View style={{
                     width: '95%', backgroundColor: '#fff', height: 45, borderRadius: 5, justifyContent: 'center', paddingLeft: 20, shadowColor: '#000',
                     shadowOffset: { width: 1, height: 3 },
                     shadowOpacity: 0.5,
                     shadowRadius: 10,
                     elevation: 5,
                  }}>
                     <TextInput
                        placeholder={`digite o nome do(a) ${selectValue}`}
                        value={reason}
                        onChangeText={text => setReason(text)}
                        keyboardType={'default'}
                        style={{ fontSize: selectValue ? 18 : 22, fontWeight: selectValue ? '400' : '500', textTransform: 'capitalize' }}
                     />
                  </View>
               ) : null}

               {
                  <View style={{
                     flexDirection: 'row',
                     width: '95%', backgroundColor: '#fff', height: 45, borderRadius: 5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 18, shadowColor: '#000',
                     shadowOffset: { width: 1, height: 3 },
                     shadowOpacity: 0.5,
                     shadowRadius: 10,
                     elevation: 5,
                  }}>
                     <TextInput
                        placeholder={selectValue ? `digite a senha ${selectValue}` : 'digite a senha'}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        keyboardType={'default'}
                        style={{ fontSize: 18, width: '85%', color: '#2C3E50', }}
                        secureTextEntry={passwordOculte ? true : false}
                     />
                     <TouchableOpacity onPress={togglePassword}>
                        <Feather name={passwordOculte ? 'eye' : 'eye-off'} size={20} color='#000' style={{ paddingRight: 25, color: '#888' }} />
                     </TouchableOpacity>

                  </View>
               }

            </View>


            <View style={{ width: '95%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20, gap: 20 }}>
               <TouchableOpacity
                  style={{ width: '100%', justifyContent: 'center', alignItems: 'center', }}
                  onPress={handleSave}
               >
                  <LinearGradient
                     colors={['#000', '#2C3E50', '#000']}
                     start={[1, 0]}
                     end={[0, 1]}
                     style={{ width: '100%', padding: 15, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                  >
                     <Text style={{ fontSize: 20, color: '#fff' }}>Salvar Senha</Text>
                  </LinearGradient>

               </TouchableOpacity>
               <TouchableOpacity onPress={() => setIsModalDeleteVisible(true)}>
                  <Text style={{ fontSize: 18, color: '#000' }}>Desejo apagar sua credencial?</Text>
               </TouchableOpacity>

               <ModalDelete
                  visible={isModalDeleteVisible}
                  onClosed={() => setIsModalDeleteVisible(false)}

               />
            </View>
            <ModalUser
               visible={modalUser}
               onClosed={() => setModalUser(false)}
            />
            <LoadingModal visible={loadingVisible} onClosed={() => setLoadingVisible(false)} />
         </View>



      </SafeAreaView>
   );
};

// define your styles
const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 0 : 0,
      backgroundColor: '#fff',
      gap: 10
   },
   header: {
      height: 100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,

   },
   btnVoltar: {
      flexDirection: 'row',
      justifyContent: 'flex-left',
      alignItems: 'center',
      gap: 10
   },
   content: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      gap: 10
   },
   btnSalvar: {
      width: '95%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4878b8',
      borderRadius: 5
   }
});

//make this component available to the app
export default CreatePassword;
