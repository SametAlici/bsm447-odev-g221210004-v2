import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const API_URL = 'https://pokeapi.co/api/v2/type/water';

export default function ListScreen() {
  const [pokemonlar, setPokemonlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Sunucu hatası');
        }
        return response.json();
      })
      .then((data) => {
        const liste = data.pokemon.map((item) => item.pokemon);
        setPokemonlar(liste);
      })
      .catch(() => setHata('Veri alınamadı. İnternet bağlantını kontrol et.'))
      .finally(() => setYukleniyor(false));
  }, []);

  if (yukleniyor) {
    return (
      <View style={styles.merkez}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (hata) {
    return (
      <View style={styles.merkez}>
        <Text>{hata}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemonlar}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={styles.satir}>
          <Text style={styles.isim}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  satir: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  isim: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});