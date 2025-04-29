import { Text, View, StyleSheet, Platform, Button } from 'react-native';
import WheelSelector from '@/app/components/WheelSelector';
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.wheelName}>Restaurant Picker</Text>
      
      <View style={styles.wheelContainer}>
        <WheelSelector></WheelSelector>
      </View>
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
  wheelContainer: {
    flex: 3/4,
    alignItems: 'center',
    //backgroundColor: '#25292e',
    borderColor: '#25292e',
    borderWidth: 5,
  }
});
