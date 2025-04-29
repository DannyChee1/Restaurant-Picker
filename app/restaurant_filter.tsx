import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function RestaurantFilter() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>
            <Text style={styles.text}>Restaurant Filter Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 60,
        padding: 10,
    },
    backButtonText: {
        fontSize: 18,
        color: '#000',
    },
    text: {
        fontSize: 24,
        color: '#000',
        marginTop: 20,
    },
});