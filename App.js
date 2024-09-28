import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import UserAvatar from 'react-native-user-avatar';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
            bgColor='#85c1e9'
            borderRadius={50}
          />
          <View style={{ alignSelf: 'center' }}>
            <Text style={[styles.name, styles.nameAndroid]}>{item.first_name}</Text>
            <Text style={[styles.name, styles.nameAndroid]}>{item.last_name}</Text>
          </View>
        </View>
      );
    }

  };



  return (
    <SafeAreaProvider>
      <SafeAreaView>

          <FlatList
            data={users}
            renderItem={listItem}
            keyExtractor={(item) => item.uid.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    fontSize: 18,
    fontStyle: 'bold',
  },
  nameAndroid: {
    textAlign: 'right',
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  // listAndroid: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#ccc',
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  // },
});
