import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'


const Category = () => {
   const [categories, setCategories] = useState({
      cartaoCredito: [],
      aplicativo: [],
      redesSociais: [],
      outros: [],
   });

   const useCategory = async () => {
      try {
         const categoryItem = await AsyncStorage.getItem('dados');
         const categoryParse = JSON.parse(categoryItem);

         if (categoryParse && categoryParse.length) {
            // Filtrar os itens de acordo com o selectValue
            const cartaoCredito = categoryParse.filter(item => item.selectValue === 'cartão de crédito');
            const aplicativo = categoryParse.filter(item => item.selectValue === 'aplicativo');
            const redesSociais = categoryParse.filter(item => item.selectValue === 'redes sociais');
            const outros = categoryParse.filter(item => item.selectValue === 'outros');

            // Atualizar o estado
            setCategories({
               cartaoCredito,
               aplicativo,
               redesSociais,
               outros,
            });
         }
      } catch (error) {
         console.error("Error loading categories", error);
      }
   };

   useEffect(() => {
      useCategory();
   }, []);

   const handleBackup = async () => {

      try {
         const user = await AsyncStorage.getItem('authData')
         const userParse = user ? JSON.parse(user) : null
         if (userParse?.plan === 'premium') {
            //setUser(userParse)
            console.log('dados de :', userParse);
            Alert.alert('Usuário Premium', 'Backup permitido!')

         } else if (userParse?.plan === 'free') {
            Alert.alert(`Atenção`, `É preciso uma Assinatura Premium para fazer backup`);
         }
      } catch (error) {
         console.log('Erro ao fazer backup!');
      }

   }


   return (
      <View style={styles.container}>
         <LinearGradient style={styles.header} colors={['#000', '#00ccff', '#000']} start={[0, 0]} end={[1, 3]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
               <MaterialIcons name='category' size={25} color={'#fff'} />
               <View>
                  <Text style={{ color: '#fff', fontSize: 30, fontWeight: '600', letterSpacing: 1, textTransform: 'capitalize' }}>Relatório</Text>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Resumo de senhas salvas por categoria!</Text>
               </View>

            </View>
            <Pressable onPress={() => handleBackup()}>
               <MaterialIcons name="backup" size={30} color="#fff" />
            </Pressable>


         </LinearGradient>
         {/* Exibir itens da categoria "Cartão de Crédito" */}

         {categories ? (
            <View style={{ flexDirection: 'column', width: '100%', paddingHorizontal: 10, paddingVertical: 10 }}>

               <LinearGradient style={styles.CategoryContainer}
                  colors={['#fff', '#ccc', '#fff']}
                  start={[0, 1]}
                  end={[1, 0]}
               >

                  <ScrollView >
                     <Text style={styles.categoryTitle}>Cartão de Crédito</Text>
                     <Text style={styles.borderWidth}></Text>
                     {categories.cartaoCredito.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                           <Text style={styles.text}>{item.reason}</Text>
                        </View>
                     ))}
                  </ScrollView>
                  <View style={styles.viewCount}>

                     <Text style={styles.textCount}>{categories.cartaoCredito.length}</Text>


                  </View>

               </LinearGradient>


               {/* Exibir itens da categoria "Aplicativo" */}
               <LinearGradient style={styles.CategoryContainer}
                  colors={['#fff', '#ccc', '#fff']}
                  start={[0, 1]}
                  end={[1, 0]}
               >
                  <ScrollView >
                     <Text style={styles.categoryTitle}>Aplicativo</Text>
                     <Text style={styles.borderWidth}></Text>
                     {categories.aplicativo.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                           <Text style={styles.text}>{item.reason}</Text>
                        </View>
                     ))}
                  </ScrollView>

                  <View style={styles.viewCount}>

                     <Text style={styles.textCount}>{categories.aplicativo.length} </Text>


                  </View>

               </LinearGradient>


               {/* Exibir itens da categoria "Redes Sociais" */}
               <LinearGradient style={styles.CategoryContainer}
                  colors={['#fff', '#ccc', '#fff']}
                  start={[0, 1]}
                  end={[1, 0]}
               >

                  <ScrollView >
                     <Text style={styles.categoryTitle}>Redes Sociais</Text>
                     <Text style={styles.borderWidth}></Text>
                     {categories.redesSociais.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                           <Text style={styles.text}>{item.reason}</Text>
                        </View>
                     ))}
                  </ScrollView>
                  <View style={styles.viewCount}>

                     <Text style={styles.textCount}>{categories.redesSociais.length}</Text>


                  </View>

               </LinearGradient>


               {/* Exibir itens da categoria "Outros" */}
               <LinearGradient style={styles.CategoryContainer}
                  colors={['#fff', '#ccc', '#fff']}
                  start={[0, 1]}
                  end={[1, 0]}
               >

                  <ScrollView >
                     <Text style={styles.categoryTitle}>Outros</Text>
                     <Text style={styles.borderWidth}></Text>
                     {categories.outros.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', width: 250 }}>
                           <Text style={styles.text}>{item.reason}</Text>
                        </View>

                     ))}
                  </ScrollView>
                  <View style={styles.viewCount}>

                     <Text style={styles.textCount}>{categories.outros.length}</Text>


                  </View>


               </LinearGradient>

            </View>
         ) : (
            <View style={styles.container}>
               <Text>Sem dados.</Text>
            </View>
         )}

      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 0 : 0,
      backgroundColor: '#fff',
   },
   header: {
      backgroundColor: '#27AE60',
      height: 130,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      gap: 10,
   },
   CategoryContainer: {

      height: 148,
      overflow: 'hidden',
      flexDirection: 'row',
      padding: 15,
      justifyContent: 'space-between',
      marginVertical: 5,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: .5,
      shadowRadius: 10,
      elevation: 5,
      borderBottomRightRadius: 100,
      borderTopRightRadius: 100
   },

   categoryTitle: {
      justifyContent: 'space-between',
      textTransform: 'uppercase',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
   },
   borderWidth: {
      width: '100%',
      marginTop: -8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#000',
   },
   text: {
      color: '#000',
      fontSize: 16,


   },
   viewCount: {
      paddingVertical: 30,
      paddingHorizontal: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderLeftColor: '#000',
   },

   textCount: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#000'
   }
});

export default Category;
