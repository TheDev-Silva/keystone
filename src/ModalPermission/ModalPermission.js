import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const YourComponent = ({ item }) => {
  const [inputPermissionPassword, setInputPermissionPassword] = useState(''); // Armazena a senha digitada
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Controla se a senha principal será exibida ou não

  const handlePermissionCheck = () => {
    if (inputPermissionPassword === item.permissionPassword) {
      setIsPasswordVisible(true); // Se a senha de permissão estiver correta, exibe a senha
    } else {
      alert('Senha de permissão incorreta!');
      setIsPasswordVisible(false); // Se estiver errada, esconde a senha
    }
  };

  return (
    <View style={styles.container}>
      {isPasswordVisible ? (
        <Text style={[styles.itemText, { fontWeight: '600', fontSize: 18 }]}>{item.password}</Text>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha de permissão"
            secureTextEntry={true}
            value={inputPermissionPassword}
            onChangeText={setInputPermissionPassword}
          />
          <TouchableOpacity onPress={handlePermissionCheck}>
            <Text style={styles.checkButton}>Verificar</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isPasswordVisible && (
        <MaterialIcons name="key-off" size={24} color="black" />
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 200,
    marginRight: 10,
  },
  checkButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default YourComponent;
