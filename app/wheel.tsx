import { View, Text, StyleSheet, Pressable, Image, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function WheelPage() {
  const router = useRouter();
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={[
            styles.backButton,
            isBackButtonPressed && styles.backButtonPressed
          ]}
          onPressIn={() => setIsBackButtonPressed(true)}
          onPressOut={() => setIsBackButtonPressed(false)}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>

      <Image
        source={require('../assets/images/gols.jpg')}
        style={styles.restaurantImage}
        resizeMode="contain"
      />

      <View style={styles.bottomContainer}>
        <Pressable style={styles.resultsButton} onPress={() => alert('Retry!')}>
          <Text style={styles.resultsButtonText}>Retry</Text>
        </Pressable>
        <Pressable style={styles.resultsButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.resultsButtonText}>More Info</Text>
        </Pressable>
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* Unique UberEats-style menu, inspired by the screenshot but unique */}
              <View style={styles.menuHeader}>
                <Image source={require('../assets/images/gols.jpg')} style={styles.menuImage} resizeMode="cover" />
                <Text style={styles.menuTitle}>Gol's Lanzhou Noodle</Text>
                <Text style={styles.menuSubtitle}>Chinese • Noodles • $$</Text>
                <Text style={styles.menuRating}>⭐ 4.6 (1,529 reviews)</Text>
                <Text style={styles.menuAddress}>150 University Ave W Unit 6B, Waterloo, ON</Text>
              </View>
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Popular Items</Text>
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemName}>Lanzhou Beef Noodle Soup</Text>
                  <Text style={styles.menuItemDesc}>Hand-pulled noodles in rich beef broth, topped with tender beef slices, cilantro, and chili oil.</Text>
                  <Text style={styles.menuItemPrice}>$14.99</Text>
                </View>
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemName}>Spicy Chicken Noodles</Text>
                  <Text style={styles.menuItemDesc}>Spicy chicken with vegetables and hand-pulled noodles.</Text>
                  <Text style={styles.menuItemPrice}>$13.99</Text>
                </View>
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemName}>Vegetarian Noodle Soup</Text>
                  <Text style={styles.menuItemDesc}>A vegetarian broth with fresh vegetables and hand-pulled noodles.</Text>
                  <Text style={styles.menuItemPrice}>$12.99</Text>
                </View>
              </View>
              <View style={styles.menuSection}>
                <Text style={styles.menuSectionTitle}>Sides</Text>
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemName}>Steamed Dumplings (6 pcs)</Text>
                  <Text style={styles.menuItemDesc}>Juicy pork and chive dumplings, served with dipping sauce.</Text>
                  <Text style={styles.menuItemPrice}>$7.99</Text>
                </View>
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemName}>Cucumber Salad</Text>
                  <Text style={styles.menuItemDesc}>Refreshing cucumber salad with garlic and vinegar dressing.</Text>
                  <Text style={styles.menuItemPrice}>$5.99</Text>
                </View>
              </View>
            </ScrollView>
            <Pressable style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    padding: 20,
    paddingVertical: 10,
    zIndex: 1,
    borderColor: '#000',
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: '#fefefe',
  },
  backButtonPressed: {
    backgroundColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  resultsButton: {
    width: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  menuImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  menuRating: {
    fontSize: 15,
    color: '#05C167',
    marginBottom: 2,
  },
  menuAddress: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 18,
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  menuItem: {
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  menuItemName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  menuItemDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  menuItemPrice: {
    fontSize: 15,
    color: '#05C167',
    fontWeight: '600',
    marginTop: 2,
  },
  closeModalButton: {
    backgroundColor: '#05C167',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 