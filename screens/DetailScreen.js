import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_STAT = 150;
const STORAGE_KEY = 'kaydedilenler';

export default function DetailScreen({ route }) {
  const { pokemon } = route.params;

  const [detay, setDetay] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);
  const [kayitli, setKayitli] = useState(false);

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

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((deger) => {
      const liste = deger ? JSON.parse(deger) : [];
      setKayitli(liste.some((p) => p.name === pokemon.name));
    });
  }, [pokemon.name]);

  async function kaydetVeyaCikar() {
    const deger = await AsyncStorage.getItem(STORAGE_KEY);
    const liste = deger ? JSON.parse(deger) : [];

    let yeniListe;
    if (kayitli) {
      yeniListe = liste.filter((p) => p.name !== pokemon.name);
    } else {
      yeniListe = [...liste, pokemon];
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(yeniListe));
    setKayitli(!kayitli);
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
    <ScrollView contentContainerStyle={styles.icerik}>
      {detay.sprites.front_default ? (
        <Image source={{ uri: detay.sprites.front_default }} style={styles.resim} />
      ) : (
        <Text>Resim yok</Text>
      )}

      <Text style={styles.isim}>{pokemon.name}</Text>

      <Pressable
        style={[styles.buton, kayitli && styles.butonCikar]}
        onPress={kaydetVeyaCikar}
      >
        <Text style={styles.butonYazi}>
          {kayitli ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
        </Text>
      </Pressable>

      <View style={styles.bilgiSatiri}>
        <Text style={styles.bilgi}>Boy: {detay.height / 10} m</Text>
        <Text style={styles.bilgi}>Kilo: {detay.weight / 10} kg</Text>
      </View>

      <Text style={styles.baslik}>İstatistikler</Text>

      {detay.stats.map((s) => {
        const oran = Math.min(s.base_stat, MAX_STAT) / MAX_STAT;

        return (
          <View key={s.stat.name} style={styles.statSatiri}>
            <Text style={styles.statAdi}>{s.stat.name}</Text>
            <View style={styles.cubukZemin}>
              <View style={[styles.cubuk, { width: `${oran * 100}%` }]} />
            </View>
            <Text style={styles.statDeger}>{s.base_stat}</Text>
          </View>
        );
      })}
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
  buton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  butonCikar: {
    backgroundColor: '#ef4444',
  },
  butonYazi: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bilgiSatiri: {
    flexDirection: 'row',
    gap: 24,
  },
  bilgi: {
    fontSize: 16,
  },
  baslik: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  statSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  statAdi: {
    width: 120,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  cubukZemin: {
    flex: 1,
    height: 12,
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cubuk: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  statDeger: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
  },
});