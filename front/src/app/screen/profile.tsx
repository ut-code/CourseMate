import {
  View, Text, KeyboardAvoidingView, StyleSheet, Image
} from 'react-native'

import { router } from 'expo-router'

const handlePress = (): void => {
  router.back()
}

const Create = (): JSX.Element => {
  return (
            <KeyboardAvoidingView behavior='height' style={styles.container}>
              <View style={styles.imageContainer}>
                <Image source={require('../../../assets/icon.png')} style={styles.image} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.input}>
                  test
                </Text>
              </View>
            </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inputContainer: {
    paddingHorizontal: 27,
    paddingVertical: 32,
    flex: 1
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  image: {
    marginBottom: 24,
    width: 300,
    height: 300
  }

})

export default Create
