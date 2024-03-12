import { Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
  label: string
  onPress?: () => void
}

const Button = (props: Props): JSX.Element => {
  const { label, onPress } = props
  return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonLabel}>{label}</Text>
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#467fd3',
    height: 48,
    width: 104,
    borderRadius: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 32,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 24
  }
})

export default Button
