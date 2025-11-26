import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  // Fetch the current user when the component mounts
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const salons = [
    {
      id: 1,
      name: 'Luxe Hair Studio',
      location: 'Fashion Ave, NY',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop', 
    },
    {
      id: 2,
      name: 'Urban Glow Spa',
      location: 'Sunset Blvd, LA',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1629397685944-7073f5589754?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      name: 'Blade & Razor',
      location: 'Downtown, Chicago',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  const filteredSalons = salons.filter(salon => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    salon.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut().catch(() => {});
              await GoogleSignin.signOut().catch(() => {});
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              navigation.replace('Login');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Get display name or fallback
  const displayName = user?.displayName || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello, <Text style={styles.userName}>{displayName}</Text></Text>
            <Text style={styles.subHeader}>Find your style</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
             <Text style={styles.profileInitial}>{displayInitial}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text> 
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Salon List */}
        <View style={styles.listContainer}>
          {filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <TouchableOpacity key={salon.id} style={styles.card} activeOpacity={0.9}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: salon.image }} style={styles.cardImage} />
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ {salon.rating}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.salonName}>{salon.name}</Text>
                    <Text style={styles.salonLocation}>{salon.location}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
               <Text style={styles.noResultsText}>No salons found matching "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
    color: '#000',
  },
  subHeader: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
    color: '#A0A0A0'
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salonName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  salonLocation: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#CCCCCC',
    fontWeight: '300',
  },
  noResultsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
  }
});
