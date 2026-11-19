import { StyleSheet, Text, View } from 'react-native';

export default function DetailScreen({ route }) {
  const { pokemon } = route.params;

  return (
    <View style={styles.merkez}>
      <Text style={styles.isim}>{pokemon.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  merkez: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isim: {
    fontSize: 24,
    textTransform: 'capitalize',
  },
});