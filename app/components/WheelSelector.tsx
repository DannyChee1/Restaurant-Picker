import { StyleSheet, View, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const restaurantWheelImage = null;

export default function wheelSelectBox() {
    const router = useRouter();
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => router.push('/restaurant_filter')}>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    buttonContainer: {
        width: 280,
        height: 560,
        marginHorizontal: 0,
        alignItems: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});

