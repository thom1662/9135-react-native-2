import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import UserAvatar from 'react-native-user-avatar';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, View, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from '@rneui/themed';
import fab from './components/fab';

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = (size) => {
    axios
      .get(`https://random-data-api.com/api/v2/users?size=${size}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('error fetching users: ', error);
      });
  };

  const addOne = () => {
      axios
        .get('https://random-data-api.com/api/v2/users?size=1')
        .then((response) => {
          const newUser = response.data;
          setUsers((prevUsers) => [newUser, ...prevUsers]); // Add the new user to the top of the list
        })
        .catch((error) => {
          console.error('error fetching user: ', error);
        });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers(10);
    setRefreshing(false);
  }, []);
  //don't need settimeout here, the spinner should display until the new data is fetched
  //on refresh, set state to 'refreshing' fetch 10 new users, then set state to refreshing = false
  

  useEffect(() => {
    fetchUsers(10);
  }, []); //should depend on refreshing state?



//platform specific rendering
let os = Platform.OS
  const listItem = ({ item }) => {
    if (os === 'ios') {
      return (
      <View style={styles.list}>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.name}>{item.first_name}</Text>
          <Text style={styles.name}>{item.last_name}</Text>
        </View>
  
        <UserAvatar
          size={85}
          src={item.avatar}
          name={`${item.first_name} ${item.last_name}`}
          bgColor="#85c1e9"
          borderRadius={50}
        />
      </View>);
    } else { //android
      return (
        <View style={styles.list}>
          <UserAvatar
            size={85}
            src={item.avatar}
            name={`${item.first_name} ${item.last_name}`}
            bgColor='#ADD0EB'
            borderRadius={50}
          />
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.name}>{item.first_name}</Text>
            <Text style={styles.name}>{item.last_name}</Text>
          </View>
        </View>
      );
    }

  };



  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{ width: '100%' }}
          data={users}
          renderItem={listItem}
          keyExtractor={(item) => item.uid.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ></FlatList>
        <FAB
          onPress={addOne}
          style={styles.fab}
          size='large'
          overlayColor='#454545'
          color='#007991'
          icon={{ name: 'add', color: '#fff' }}
        />
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
    fontSize: 18,
    fontStyle: 'bold',
    textAlign: Platform.OS === 'android' ? 'right' : 'left',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 48,
    // right: scrnWidth / 2,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
});


//TODO: FAB to fetch more users, add to list, not replace. users.unshift(response.data) or something

//move components to separate files

//may need to refactor the fetch and onrefresh:
// Current Implementation: Works fine but does not allow the use of finally for consistent state management.
// Refactored Implementation: Returns a promise, allowing the use of finally to ensure setRefreshing(false) is called after the fetch operation completes.
// This change improves the robustness and readability of your code, ensuring that the spinner is correctly managed during the pull-to-refresh operation.

