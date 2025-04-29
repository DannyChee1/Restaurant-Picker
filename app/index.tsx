import { Text, View, StyleSheet, Platform } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.wheelName}>Restaurant Picker</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  wheelName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
  text: {
    color: '#000',
  },
});
