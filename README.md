# Su Pokédex — BSM447 Dönem Ödevi

| | |
|---|---|
| **Öğrenci No** | G221210004 |
| **Konu / Varyant** | K19 · Pokédex (PokeAPI) — varyant **b · Su** |
| **Ek kural** | **6 · 10'ar 10'ar gösterme** |
| **Kalıcı veri yöntemi** | **AsyncStorage** (`@react-native-async-storage/async-storage`) |
| **Expo SDK** | 58 |

## Uygulama hakkında

Su tipi Pokémon'ları PokeAPI'den **uygulama çalışırken** çeken üç ekranlı bir Expo (React Native) uygulaması. Uygulamanın içinde hazır JSON verisi yoktur.

### Ekranlar

1. **Liste** (alt sekme)
   - `https://pokeapi.co/api/v2/type/water` adresinden `fetch` + `useEffect` ile veri çekilir.
   - `pokemon[i].pokemon.name` değerleri `FlatList` ile listelenir, anahtar olarak `name` kullanılır (`keyExtractor`).
   - `TextInput` ile **büyük/küçük harfe duyarsız** arama yapılır (`toLowerCase()` + `includes`).
   - **Ek kural 6:** İlk açılışta 10 kayıt görünür, listenin sonundaki **"Daha fazla"** butonu her basışta 10 kayıt daha ekler. Arama değişince sayaç tekrar 10'a döner.
2. **Detay** (Stack)
   - Seçilen kayıt `route.params` ile gelir. Global değişken kullanılmaz.
   - İkinci istek: `https://pokeapi.co/api/v2/pokemon/{name}`
   - Gösterilenler: `sprites.front_default` (resim), `height` (m), `weight` (kg).
   - Her `stats[i].base_stat`, **genişliği değere bağlı yatay bir çubukla** gösterilir. Ölçeğin üst sınırı 150'dir: 150 ve üzeri çubuğu tamamen doldurur, 75 yarısını doldurur.
   - **Kaydet / Kaydedilenlerden çıkar** butonu.
3. **Kaydedilenler** (alt sekme)
   - AsyncStorage'daki kayıtlar `useFocusEffect` ile ekran her açıldığında yeniden okunur ve listelenir. Bir kayda dokununca Detay ekranı açılır.

### Navigasyon

React Navigation: **Bottom Tab** (Liste, Kaydedilenler) bir **Native Stack**'in içinde. Detay ekranı Stack'tedir, böylece iki sekmeden de açılabilir.

```
NavigationContainer
└── Stack
    ├── Ana → Bottom Tab
    │         ├── Liste
    │         └── Kaydedilenler
    └── Detay
```

### Kalıcı veri

Kaydedilen Pokémon'lar AsyncStorage'da `kaydedilenler` anahtarı altında, `JSON.stringify` ile metne çevrilmiş `{ name, url }` dizisi olarak tutulur. Okurken `JSON.parse` ile diziye geri çevrilir. Veri, uygulama kapatılıp açılsa da kaybolmaz.

## Ekran görüntüleri

| Liste | Detay | Kaydedilenler |
|---|---|---|
| ![Liste](docs/liste.png) | ![Detay](docs/detay.png) | ![Kaydedilenler](docs/kaydedilenler.png) |

## Bağlantılar

- **APK:** https://expo.dev/accounts/sametalici/projects/su-pokedex/builds/b179ae9a-a37d-45c8-b74d-b47c6a8c7b83
- **Ekran kaydı (≤ 1 dk):** EKRAN_KAYDI_BAGLANTISI

## Çalıştırma

```bash
npm install
npx expo start
```

Telefondaki Expo Go uygulamasıyla QR kodu okutun.

APK derlemek için:

```bash
eas build -p android --profile preview
```

## Proje yapısı

```
App.js                  Navigasyon (Stack + Bottom Tab)
screens/ListScreen.js   Liste, arama, 10'ar 10'ar gösterme
screens/DetailScreen.js Detay, istatistik çubukları, kaydet/çıkar
screens/SavedScreen.js  Kaydedilenler (AsyncStorage)
app.json                Uygulama adı, simge, Android paket adı
eas.json                EAS Build profilleri (preview → APK)
```
