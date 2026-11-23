import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'https://pokeapi.co/api/v2/type/water';
const SAYFA_BOYUTU = 10;

export default function ListScreen({ navigation }) {
  const [pokemonlar, setPokemonlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [arama, setArama] = useState('');
  const [gosterilenSayi, setGosterilenSayi] = useState(SAYFA_BOYUTU);

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

  const filtrelenmis = pokemonlar.filter((p) =>
    p.name.toLowerCase().includes(arama.trim().toLowerCase())
  );
  const gorunen = filtrelenmis.slice(0, gosterilenSayi);
  const dahaVar = gosterilenSayi < filtrelenmis.length;

  function aramaDegisti(metin) {
    setArama(metin);
    setGosterilenSayi(SAYFA_BOYUTU);
  }

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
        onChangeText={aramaDegisti}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FlatList
        data={gorunen}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Pressable
            style={styles.satir}
            onPress={() => navigation.navigate('Detay', { pokemon: item })}
          >
            <Text style={styles.isim}>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.bos}>Sonuç bulunamadı.</Text>}
        ListFooterComponent={
          dahaVar ? (
            <Pressable
              style={styles.dahaButon}
              onPress={() => setGosterilenSayi(gosterilenSayi + SAYFA_BOYUTU)}
            >
              <Text style={styles.dahaYazi}>
                Daha fazla ({gorunen.length} / {filtrelenmis.length})
              </Text>
            </Pressable>
          ) : null
        }
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
  dahaButon: {
    margin: 16,
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  dahaYazi: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});