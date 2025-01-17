//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient'

// create a component
const Pager = ({ navigation }) => {

   const [currentPage, setCurrentPage] = useState(0)
   const [loading, setLoading] = useState(false)
   const [authUser, setAuthUser] = useState('')
   const pagerViewRef = useRef(null);
   const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)

   const numPages = 3; // Número total de páginas
   const intervalTime = 3000; // Tempo em milissegundos para cada slide (3 segundos)



   useEffect(() => {
      const interval = setInterval(() => {
         // Avançar para a próxima página
         setCurrentPage((prevPage) => {
            const nextPage = prevPage + 1 < numPages ? prevPage + 1 : 0;
            pagerViewRef.current.setPage(nextPage);
            return nextPage;
         });
      }, intervalTime);
      // Limpar o intervalo ao desmontar o componente
      return () => clearInterval(interval);

   }, []);

   
   useEffect(()=> {
      
      handleCredentialLogin()

   },[])

   const handlelogin = async () => {

      try {

         const auth = await AsyncStorage.getItem('authData')
         if (auth !== null && auth !== undefined && auth !== '') {
            setAuthUser(authUser)
            navigation.navigate('AccessLogin')
         } else {
            navigation.navigate('OptionKey')
         }
         console.log(auth)

      } catch (error) {

         console.log('Usuário não autenticado, redimencionando para: ', error)

      }
   }

   const handleCredentialLogin = async () => {

      try {
         const auth = await AsyncStorage.getItem('authData')

         const authParse = auth ? JSON.parse(auth) : null;

         if (authParse && authParse.password === authParse.password ) {

            navigation.navigate('AccessLogin')
         } else {
            console.log('sem dados...', auth)
            navigation.navigate('OptionKey')
         }
      } catch (error) {
         
         console.log('sem dados salvos, sendo redimencionado...')
      }
   }

   


   return (
      <LinearGradient style={styles.container} colors={['#000', '#00ccff', '#000']} start={[0, 0]} end={[1, 1]}>
         <PagerView
            style={styles.pager}
            initialPage={0}
         >
            <View style={styles.page} key="1">
               <Text style={styles.title}>Já imaginou?</Text>
               <Image source={require('../image/Thinking-face-cuate-(1).png')} style={{ objectFit: 'cover', width: 300, height: 300 }} />
               <Text style={[styles.subtitle, {fontWeight: 'bold', marginBottom: 10}]}>Isso Mesmo!?</Text>
               <Text style={styles.subtitle}>Guardar todas as suas senhas com confiança, sem complicação?</Text>
               <View style={{ position: 'absolute', bottom: 40, marginTop: 30, color: '#fff', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 8, height: 8, backgroundColor: '#1a1a1a', borderRadius: 100 }}></View>
                  <View style={{ width: 7, height: 7, backgroundColor: '#fff', borderRadius: 100 }}></View>
                  <View style={{ width: 7, height: 7, backgroundColor: '#fff', borderRadius: 100 }}></View>
               </View>
            </View>


            <View style={[styles.page, { gap: 20 }]} key="2">
               <View style={{ gap: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.title}>Mas é totalmente seguro?</Text>
                  <Image source={require('../image/Good-team-cuate-(4).png')} style={{ objectFit: 'cover', width: 350, height: 350 }} />

                  <Text style={{textAlign: 'center', fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 10}}>Sim!</Text>

                  <Text style={styles.subtitle}>A <Text style={{ fontStyle: 'italic', fontWeight: '800', fontSize: 20 }}>Secutiry Key</Text> é um aplicativo que vai te salvar daquele momento em que você esqueceu aquela senha importante e o melhor, totalmente seguro, pois só você terá acesso!</Text>

               </View>
               <View style={{ position: 'absolute', bottom: 40, marginTop: 30, color: '#fff', flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 7, height: 7, backgroundColor: '#fff', borderRadius: 100 }}></View>
                  <View style={{ width: 8, height: 8, backgroundColor: '#2C3E50', borderRadius: 100 }}></View>
                  <View style={{ width: 7, height: 7, backgroundColor: '#fff', borderRadius: 100 }}></View>
               </View>


            </View>
            <View style={styles.page} key="3">
               <View style={{ flex: 1, width: '100%', flexDirection: 'column', justifyContent: 'space-between', marginVertical: 70 }}>
                  <Text style={styles.title}>Quais senhas posso salvar?</Text>
                  <PagerView
                     initialPage={0}
                     ref={pagerViewRef}
                     onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                     style={{ flex: 1, width: 'auto', justifyContent: 'center', alignItems: 'center' }}
                  >
                     <Image source={require('../image/page2/Mobile-cuate-(1).png')} style={{ objectFit: 'cover', width: 350, height: 350 }} />

                     <Image source={require('../image/page2/Credit-Card-Payment-cuate-(1).png')} style={{ objectFit: 'cover', width: 350, height: 350 }} />

                     <Image source={require('../image/page2/Mobile-Marketing-cuate-(1).png')} style={{ objectFit: 'cover', width: 350, height: 350 }} />
                  </PagerView>

                  {/* 046166 */}
                  <Text style={{textAlign: 'center', fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 10}}>Todas!</Text>
                  <Text style={styles.subtitle}> No security Key você consegue salvar todas as chaves de aplicativos, de banco, de redes sociais e o que mais for importtante ou necessário!</Text>
               </View>
               <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                 
                     <LinearGradient
                        colors={['#000', '#2C3E50', '#000']}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, shadowColor: '#000', elevation: 5 }}
                     >
                         <TouchableOpacity onPress={handlelogin} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 20 }}>
                        <Text style={[styles.subtitle, { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }]}>{loading ? 'carregando...':'já possuo credencial!'}</Text>
                         </TouchableOpacity>
                        
                     </LinearGradient>


                  

                  
                  <LinearGradient
                        colors={['#000', '#2C3E50', '#000']}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, shadowColor: '#000', elevation: 10, shadowRadius: 5}}
                     >
                        <TouchableOpacity onPress={handleCredentialLogin} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 5, padding: 20 }}>
                           <Text style={[styles.subtitle, { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }]}>{loading ? 'carregando...': 'Criar credencial'}</Text>
                        </TouchableOpacity>
                         
                     </LinearGradient>
               </View>

            </View>
         </PagerView>
      </LinearGradient>
   );
};

// define your styles
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
   },
   pager: {
      flex: 1,
      width: '100%',
   },
   page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 10,
      textAlign: 'center',
   },
   subtitle: {
      fontSize: 18,
      fontWeight: '400',
      color: '#fff',
      textAlign: 'center',
   },
});

//make this component available to the app
export default Pager;
