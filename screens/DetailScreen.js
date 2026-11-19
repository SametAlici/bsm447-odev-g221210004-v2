import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DetailScreen({ route }) {
  const { pokemon } = route.params;

  const [detay, setDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Sunucu hatası');
        }
        return response.json();
      })
      .then((data) => setDetay(data))
      .catch(() => setHata('Detay alınamadı. İnternet bağlantını kontrol et.'))
      .finally(() => setYukleniyor(false));
  }, [pokemon.name]);

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
    <ScrollView contentContainerStyle={styles.icerik}>
      {detay.sprites.front_default ? (
        <Image source={{ uri: detay.sprites.front_default }} style={styles.resim} />
      ) : (
        <Text>Resim yok</Text>
      )}

      <Text style={styles.isim}>{pokemon.name}</Text>

      <View style={styles.bilgiSatiri}>
        <Text style={styles.bilgi}>Boy: {detay.height / 10} m</Text>
        <Text style={styles.bilgi}>Kilo: {detay.weight / 10} kg</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icerik: {
    alignItems: 'center',
    padding: 16,
  },
  resim: {
    width: 200,
    height: 200,
  },
  isim: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  bilgiSatiri: {
    flexDirection: 'row',
    gap: 24,
  },
  bilgi: {
    fontSize: 16,
  },
});