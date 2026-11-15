import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';



export default function NewTarefaModal() {
  const [className, setClassName] = useState('');


  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Nova Tarefa</Text>
      </View>
      <TextInput placeholder="Título da Tarefa" style={styles.input} />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={className}
          onValueChange={(itemValue, itemIndex) =>
            setClassName(itemValue)
          } style={styles.picker} itemStyle={styles.pickerItem} >
          <Picker.Item label="Selecione uma categoria" value="" />
          <Picker.Item label="Matemática" value="Matemática" />
          <Picker.Item label="Português" value="Português" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  //Alignment
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
  },

  //Styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '80%',
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    color: '#000000',
  },
});