//import liraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Pressable, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
// create a component
const AccessLogin = ({ navigation }) => {

    const [accessPassword, setAccessPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState('')


    const User = async () => {

        try {
            const userPerson = await AsyncStorage.getItem('authData')
            const personParse = userPerson ? JSON.parse(userPerson) : null
            if (personParse && personParse.name) {
                setUser(personParse)
            }
        } catch (error) {
            console.log('Erro ao buscar usuário!')
        }

    }
    User()


    async function AccessAuth() {
        setLoading(true)
        try {
            const authUser = await AsyncStorage.getItem('authData')
            const authParse = authUser ? JSON.parse(authUser) : null;
            setUser(authParse)
            if (authParse && authParse.password === accessPassword) {
                navigation.navigate('CreatePassword')
                setAccessPassword('')
                setLoading(false)
            } else {

                Alert.alert('Atenção', 'Senha Mestra Invalida')
            }

        } catch (error) {
            console.log('Erro ao digitar Senha Mestra!');

        }

        setLoading(false)

    }


    async function handleShare() {
        try {
            const remember = await AsyncStorage.getItem('authData')
            const rememberParse = remember ? JSON.parse(remember) : null;

            if (rememberParse && Object.keys(rememberParse).length === 0) return;


            const passwordRemember = `Olá ${rememberParse.name}\n\n Sua senha mestra é: ${rememberParse.password}`

            await Share.share({
                message: passwordRemember
            })
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <LinearGradient style={styles.container} colors={['#000', '#00ccff', '#000']} start={[0, 0]} end={[1, 1]}>

            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                <Image source={require('../../assets/splash-logo.png')} style={styles.logo} />
                <View style={{ width: '80%', flexDirection: 'column', gap: 10, justifyContent: 'center', alignItems: 'center' }}>


                    <Text style={{ fontSize: 18, color: '#fff' }}>Olá, <Text style={{ fontWeight: '500', fontSize: 24 }}>{user.name}</Text></Text>
                    <View style={[styles.input, {
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', width: '100%',
                        elevation: 2
                    }]}>
                        <TextInput

                            placeholder="Digite sua senha de Acesso!"
                            secureTextEntry={!showPassword}
                            value={accessPassword}
                            onChangeText={text => setAccessPassword(text)}
                            style={{ width: '100%', padding: 10, alignItems: 'center' }}
                        />

                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} >
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={'#000'} />
                        </TouchableOpacity>
                    </View>
                </View>

                <LinearGradient
                    colors={['#000', '#2C3E50', '#000']}
                    start={[0, 1]}
                    end={[1, 0]}
                    style={styles.optionButton}
                >
                    <Pressable style={{ width: '85%', flexDirection: 'row', justifyContent: 'center', gap: 10, alignItems: 'center' }} onPress={() => AccessAuth()}>
                        <Text style={styles.optionText}>{loading ? 'aguarde...' : 'Logar'}</Text>
                        <Ionicons name='arrow-forward' size={24} color={'#fff'} />
                    </Pressable>
                </LinearGradient>
                <TouchableOpacity onPress={handleShare}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Esqueci senha</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    input: {
        width: '80%',
        paddingLeft: 20,
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: '#fff',

    },

    optionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,

        alignItems: 'center',
        shadowColor: '#fff',
        elevation: 2
    },
    optionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '500',

    },
});

//make this component available to the app
export default AccessLogin;
