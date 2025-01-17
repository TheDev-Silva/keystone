import { View, Text, ActivityIndicator, Modal } from 'react-native'
import React from 'react'

export default function ModalLoading({ visible }) {
   return (
      <Modal
         animationType='fade'
         transparent={true}
         visible={visible}
         onRequestClose={() => { }}
      >
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
            <ActivityIndicator size={'large'} color={'#fff'}/>
         </View>

      </Modal>
   )
}