import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import UserAvatar from 'react-native-user-avatar';
import { useEffect, useState, useCallback } from 'react';
import { FlatList, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => { //thecallback should be the fetch function or useeffect?
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []); //don't need settimeout here, the spinner should display until the new data is fetched
  //on refresh, set state to 'refreshing' fetch 10 new users, then set state to refreshing = false

  //what is the timeout doing, what is the dependency array doing?
  //needs to refresh the page, should fetch new data automatically


  //create funcs for fetching 
  //vars for 1 or 10 users


  useEffect(() => {
    axios
      .get('https://random-data-api.com/api/v2/users?size=10')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('error fetching users: ', error);
      });
  }, []); //should depend on refreshing state

//Platform used here to specify layout for android and ios
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
