import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'; // YENİ: TextInput

const API_URL = 'https://pokeapi.co/api/v2/type/water';

export default function ListScreen() {
  const [pokemonlar, setPokemonlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [arama, setArama] = useState(''); 

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

  // YENİ: arama metnine göre filtrelenmiş liste
  const filtrelenmis = pokemonlar.filter((p) =>
    p.name.toLowerCase().includes(arama.trim().toLowerCase())
  );

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
    <View style={styles.kapsayici}>
      <TextInput
        style={styles.arama}
        placeholder="Pokémon ara..."
        value={arama}
        onChangeText={setArama}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FlatList
        data={filtrelenmis}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.satir}>
            <Text style={styles.isim}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.bos}>Sonuç bulunamadı.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  kapsayici: { 
    flex: 1,
  },
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arama: { 
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
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
  bos: { 
    textAlign: 'center',
    marginTop: 24,
    color: '#888',
  },
});