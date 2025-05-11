import { Text, View, StyleSheet, Platform, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.brand}>Restaurant Picker</Text>
      <Text style={styles.subtitle}>Find your next meal in a fun way!</Text>
      <Pressable style={styles.iconButton} onPress={() => router.push('/restaurant_filter')}>
        <Image
          source={require('@/assets/images/restaurant_icon.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>Start Picking</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#05C167',
    fontWeight: '600',
    marginBottom: 0,
    letterSpacing: 1,
  },
  brand: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  iconButton: {
    backgroundColor: '#05C167',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: 220,
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic',
  },
});
