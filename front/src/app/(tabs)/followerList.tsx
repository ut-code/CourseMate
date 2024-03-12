import { View, ScrollView, StyleSheet } from 'react-native'

import FollowerListItem from '../../components/FollowerListItem'

const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
        <ScrollView>
            <FollowerListItem name = "John" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete' />
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
            <FollowerListItem name = "User Name" imageUri = "https://legacy.reactjs.org/logo-og.png" buttonType='delete'/>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
})

export default List
