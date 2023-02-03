import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView, Pressable} from 'react-native';
import AsnyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from '@expo/vector-icons'; 
import { theme } from './colors';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() =>{loadToDo();}, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async(toSave) => {
    await AsnyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
  };
  const loadToDo = async () => {
    const s = await AsnyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };
  const addToDo = async() => {
    if (text === "") {
      return;
    }
    const newTodo = {...toDos,[Date.now()]: {text, working},};
    setToDos(newTodo);
    await saveToDos(newTodo);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}> 
        <TouchableOpacity onPress={work}>
        <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.btnText, color: ! working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput returnKeyType="done" onSubmitEditing={addToDo} onChangeText={onChangeText} placeholder={working ? "Add a To Do" : "Where do you want to go?"} style={styles.input}/>
      <ScrollView>
      {Object.keys(toDos).map((key) =>
        (toDos[key].working === working ? <View style={styles.todo} key={key}>
        <Text style={styles.todoText}>{toDos[key].text}</Text>
        <TouchableOpacity onPress={() => deleteToDo(key)}>
          <Fontisto name="trash" size={24} color={theme.grey} />
        </TouchableOpacity>
      </View>: null))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
  },
  btnText:{
    fontSize: 44,
    fontWeight: "600",
    color: "white" 
  },
  input:{
    backgroundColor:"white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical : 20,
    fontSize: 18
  },
  todo:{
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingHorizontal:20,
    paddingVertical: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems:"center",
    justifyContent: "space-between"
  },
  todoText:{
    color:"white",
    fontSize: 18,
    fontWeight: "500"
  }
});
