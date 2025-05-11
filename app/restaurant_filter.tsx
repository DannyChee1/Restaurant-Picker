import 'react-native-get-random-values';
import { Text, View, StyleSheet, Pressable, ScrollView, Switch, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import Constants from 'expo-constants';


export default function RestaurantFilter() {
    const router = useRouter();
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [distance, setDistance] = useState(5); // in km (float)
    const [selectedBudget, setSelectedBudget] = useState(1);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
    const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
    const [showError, setShowError] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const sessionToken = useRef<string | null>(null);

    const cuisines = ['All', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indian', 'Turkish', 'Lebanese', 'Israeli', 'Greek', 'Italian', 'Spanish', 'Portuguese', 'French', 'Mexican', 'Peruvian', 'Brazilian', 'Argentinian', 'Caribbean', 'German', 'Russian', 'African'];

    const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher', 'Pescatarian'];

    const toggleCuisine = (cuisine: string) => {
        if (cuisine === 'All') {
            if (selectedCuisines.includes('All')) {
                // If "All" is selected and we're deselecting it, clear all selections
                setSelectedCuisines([]);
            } else {
                // If "All" is not selected, select all cuisines
                setSelectedCuisines(cuisines);
            }
        } else {
            if (selectedCuisines.includes('All')) {
                // If "All" was selected, remove it and add this cuisine
                setSelectedCuisines([cuisine]);
            } else {
                // Normal toggle behavior
                if (selectedCuisines.includes(cuisine)) {
                    setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
                } else {
                    setSelectedCuisines([...selectedCuisines, cuisine]);
                }
            }
        }
    };

    const toggleRestriction = (restriction: string) => {
        if (selectedRestrictions.includes(restriction)) {
            setSelectedRestrictions(selectedRestrictions.filter(r => r !== restriction));
        } else {
            setSelectedRestrictions([...selectedRestrictions, restriction]);
        }
    };

    const handleGoToWheel = () => {
        if (selectedCuisines.length === 0) {
            setShowError(true);
            return;
        }
        setShowError(false);
        router.push('/wheel');
    };

    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.address) {
                setAddress(data.display_name);
                return;
            }

        } catch (error) {
            console.warn("Error fetching address");
        }
    };

    const handleLocationToggle = async () => {
        if (!useCurrentLocation) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'Please enable location access to use your current location.',
                    [{ text: 'OK' }]
                );
                setUseCurrentLocation(false);
                return;
            }
            try {
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
                await reverseGeocode(currentLocation.coords.latitude, currentLocation.coords.longitude);
                setUseCurrentLocation(true);
                setSearchQuery('');
                setPredictions([]);
            } catch (error) {
                setLocationError('Could not get location');
                setUseCurrentLocation(false);
            }
        } else {
            setUseCurrentLocation(false);
            setLocation(null);
            setLocationError(null);
            setAddress(null);
        }
    };

    const handleSearchPress = () => {
        setSearchQuery('');
        setUseCurrentLocation(false);
        setLocation(null);
        setLocationError(null);
    };

    // Generate a new session token
    const generateSessionToken = () => {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionToken.current = token;
        return token;
    };

    // Initialize session token
    useEffect(() => {
        generateSessionToken();
    }, []);

    const searchPlaces = async (text: string) => {
        if (!text.trim()) {
            setPredictions([]);
            return;
        }

        try {
            // Add a small delay to prevent too many requests
            await new Promise(resolve => setTimeout(resolve, 300));

            const apiKey = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;
            console.log('API Key available:', !!apiKey);
            console.log('API Key length:', apiKey?.length);

            // Use Places API for address autocomplete with session token
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}&sessiontoken=${sessionToken.current}&types=address&components=country:us`;
            console.log('Making request to Places API...');

            try {
                const response = await fetch(url);
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                const data = await response.json();
                console.log('Places API Response Status:', data.status);
                console.log('Full API Response:', JSON.stringify(data, null, 2));
                
                if (data.error_message) {
                    console.error('Places API Error:', data.error_message);
                }

                if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
                    throw new Error(data.error_message || 'Places API error');
                }

                if (data.status === 'ZERO_RESULTS' || !data.predictions) {
                    setPredictions([]);
                    return;
                }

                setPredictions(data.predictions);
            } catch (fetchError: any) {
                console.error('Fetch error details:', {
                    name: fetchError?.name,
                    message: fetchError?.message,
                    stack: fetchError?.stack
                });
                throw fetchError;
            }
        } catch (error: any) {
            console.error('Error fetching predictions:', {
                name: error?.name,
                message: error?.message,
                stack: error?.stack
            });
            setPredictions([]);
            if (text.trim()) {
                Alert.alert(
                    'Search Error',
                    `Error: ${error?.message || 'Unknown error occurred'}`,
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const handlePlaceSelect = async (place: any) => {
        try {
            const apiKey = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;
            
            // Get place details using the place_id with session token
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}&sessiontoken=${sessionToken.current}&fields=formatted_address,geometry,name`;
            console.log('Making request to Places Details API...');

            const response = await fetch(detailsUrl);
            const data = await response.json();
            
            console.log('Places Details API Response Status:', data.status);
            if (data.error_message) {
                console.error('Places Details API Error:', data.error_message);
            }

            if (data.status !== 'OK' || !data.result) {
                throw new Error('Failed to get place details');
            }

            const result = data.result;
            setAddress(result.formatted_address);
            setLocation({
                coords: {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                    altitude: null,
                    accuracy: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
                timestamp: Date.now()
            });
            setSearchQuery('');
            setPredictions([]);
            setIsSearching(false);

            // Generate a new session token after successful place selection
            generateSessionToken();
        } catch (error) {
            console.error('Error setting location:', error);
            Alert.alert(
                'Error',
                'Failed to set location. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Add a function to handle search input changes with debounce
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        if (text.trim()) {
            searchPlaces(text);
        } else {
            setPredictions([]);
        }
    };

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

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={true}
                indicatorStyle="black"
            >
                <Text style={styles.title}>Filters</Text>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    {address ? <Text style={styles.locationText}>Address: {address}</Text> : <Text style={styles.locationText}>Address: None Selected</Text>}
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationText}>Use Current Location</Text>
                        <Switch
                            value={useCurrentLocation}
                            onValueChange={handleLocationToggle}
                            trackColor={{ false: '#767577', true: '#34C759' }}
                            thumbColor="#fefefe"
                        />
                    </View>
                    {!useCurrentLocation && (
                        <View style={styles.searchBarContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for a location"
                                value={searchQuery}
                                onChangeText={handleSearchChange}
                                onFocus={() => setIsSearching(true)}
                                onBlur={() => {
                                    setTimeout(() => setIsSearching(false), 200);
                                }}
                            />
                            {isSearching && predictions.length > 0 && (
                                <View style={styles.predictionsContainer}>
                                    {predictions.map((prediction) => (
                                        <Pressable
                                            key={prediction.place_id}
                                            style={styles.predictionItem}
                                            onPress={() => handlePlaceSelect(prediction)}
                                        >
                                            <Text style={styles.predictionText}>{prediction.description}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Distance Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Distance</Text>
                    <View style={styles.distanceContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={distance}
                            onValueChange={setDistance}
                            minimumTrackTintColor="#000000"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#000000"
                            step={0.5}
                        />
                        <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
                    </View>
                </View>

                {/* Budget Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget</Text>
                    <View style={styles.budgetContainer}>
                        <Pressable
                            style={[
                                styles.budgetButton,
                                selectedBudget === 1 && styles.selectedBudget
                            ]}
                            onPress={() => setSelectedBudget(1)}
                        >
                            <Text style={[
                                styles.budgetText,
                                selectedBudget === 1 && styles.selectedBudgetText
                            ]}>$</Text>
                            <Text style={[
                                styles.budgetSubtext,
                                selectedBudget === 1 && styles.selectedBudgetSubtext
                            ]}>Under $10</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.budgetButton,
                                selectedBudget === 2 && styles.selectedBudget
                            ]}
                            onPress={() => setSelectedBudget(2)}
                        >
                            <Text style={[
                                styles.budgetText,
                                selectedBudget === 2 && styles.selectedBudgetText
                            ]}>$$</Text>
                            <Text style={[
                                styles.budgetSubtext,
                                selectedBudget === 2 && styles.selectedBudgetSubtext
                            ]}>$10-$30</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.budgetButton,
                                selectedBudget === 3 && styles.selectedBudget
                            ]}
                            onPress={() => setSelectedBudget(3)}
                        >
                            <Text style={[
                                styles.budgetText,
                                selectedBudget === 3 && styles.selectedBudgetText
                            ]}>$$$</Text>
                            <Text style={[
                                styles.budgetSubtext,
                                selectedBudget === 3 && styles.selectedBudgetSubtext
                            ]}>$30+</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Cuisine Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuisine</Text>
                    <View style={styles.cuisineGrid}>
                        {cuisines.map((cuisine) => (
                            <Pressable
                                key={cuisine}
                                style={[
                                    styles.cuisineButton,
                                    selectedCuisines.includes(cuisine) && styles.selectedCuisine
                                ]}
                                onPress={() => toggleCuisine(cuisine)}
                            >
                                <Text style={[
                                    styles.cuisineText,
                                    selectedCuisines.includes(cuisine) && styles.selectedCuisineText
                                ]}>{cuisine}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Dietary Restrictions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
                    <View style={styles.cuisineGrid}>
                        {dietaryRestrictions.map((restriction) => (
                            <Pressable
                                key={restriction}
                                style={[
                                    styles.cuisineButton,
                                    selectedRestrictions.includes(restriction) && styles.selectedCuisine
                                ]}
                                onPress={() => toggleRestriction(restriction)}
                            >
                                <Text style={[
                                    styles.cuisineText,
                                    selectedRestrictions.includes(restriction) && styles.selectedCuisineText
                                ]}>{restriction}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Results Count */}
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsText}>Number of locations found: 0</Text>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomContainer}>
                {showError && (
                    <Text style={styles.errorText}>Please select at least one cuisine</Text>
                )}
                <Pressable 
                    style={styles.goToWheelButton}
                    onPress={handleGoToWheel}
                >
                    <Text style={styles.goToWheelText}>Go to Wheel</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fefefe',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: '#ffffff',
        //borderBottomWidth: 1,
        //borderBottomColor: '#e0e0e0',
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
    scrollView: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 30,
        color: '#000',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#000',
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    locationText: {
        fontSize: 16,
        color: '#000',
    },
    searchBarContainer: {
        marginTop: 10,
        zIndex: 1,
    },
    searchInput: {
        height: 44,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    distanceContainer: {
        paddingHorizontal: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    distanceText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    budgetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    budgetButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedBudget: {
        backgroundColor: '#000',
        borderColor: '#34C759',
    },
    budgetText: {
        fontSize: 20,
        color: '#000',
        fontWeight: 'bold',
    },
    selectedBudgetText: {
        color: '#fff',
    },
    budgetSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    selectedBudgetSubtext: {
        color: '#fff',
    },
    cuisineGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    cuisineButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minWidth: '30%',
        alignItems: 'center',
    },
    selectedCuisine: {
        backgroundColor: '#000',
        borderColor: '#34C759',
    },
    cuisineText: {
        fontSize: 16,
        color: '#000',
    },
    selectedCuisineText: {
        color: '#fff',
    },
    resultsContainer: {
        marginTop: 20,
        marginBottom: 30,
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    resultsText: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        fontWeight: '600',
    },
    bottomContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    goToWheelButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    goToWheelText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 8,
    },
    predictionsContainer: {
        position: 'absolute',
        top: 44,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginTop: 5,
        maxHeight: 200,
        zIndex: 2,
    },
    predictionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    predictionText: {
        fontSize: 14,
        color: '#000',
    },
});