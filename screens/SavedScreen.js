import { StyleSheet, Text, View } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.merkez}>
      <Text>Henüz kaydedilen Pokémon yok.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});