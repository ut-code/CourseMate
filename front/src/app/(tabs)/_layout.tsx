import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

export default function TabLayout (): JSX.Element {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />
        }}
      />
      <Tabs.Screen
        name="followerList"
        options={{
          title: 'followerList'
        }}
      />
      <Tabs.Screen
        name="followRequestList"
        options={{
          title: 'followRequestList'
        }}
      />
    </Tabs>
  )
}
