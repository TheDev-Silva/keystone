//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const Header = ({ label, placeholder }) => {
    return (
        <View style={styles.container}>
            <Text>{label ? label.value : placeholder}</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
});

//make this component available to the app
export default Header;
