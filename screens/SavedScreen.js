import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'kaydedilenler';

export default function SavedScreen({ navigation }) {
  const [kayitlar, setKayitlar] = useState([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEY).then((deger) => {
        setKayitlar(deger ? JSON.parse(deger) : []);
      });
    }, [])
  );

  return (
    <FlatList
      data={kayitlar}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <Pressable
          style={styles.satir}
          onPress={() => navigation.navigate('Detay', { pokemon: item })}
        >
          <Text style={styles.isim}>{item.name}</Text>
        </Pressable>
      )}
      ListEmptyComponent={<Text style={styles.bos}>Henüz kaydedilen Pokémon yok.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  satir: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  isim: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  bos: {
    textAlign: 'center',
    marginTop: 24,
    color: '#888',
  },
});