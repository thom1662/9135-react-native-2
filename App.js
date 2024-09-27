import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import UserAvatar from 'react-native-user-avatar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

const [users, setUsers] = useState([])

useEffect( () => {
  axios.get('https://random-data-api.com/api/v2/users?size=10')
  .then( response => {
    setUsers(response.data)
  })
  .catch( error => {
    console.error('error fetching users: ', error);
  });
}, []);


const listItem = ({item}) => (
  <View style={styles.name}>
    <Text>{item.first_name}</Text>
    <Text>{item.last_name}</Text>
  </View>
);

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <FlatList
        data={users}
        renderItem={listItem}
        keyExtractor={item => item.id.toString()}

        >
        </FlatList>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    padding: 10,
  }
});
