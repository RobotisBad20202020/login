import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  Platform, 
  StatusBar,
  TextInput,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';

// --- UNIQUE "EARTHY LUXURY" THEME ---
const THEME = {
  dark: '#1C1917',      // Warm Black
  medium: '#44403C',    // Dark Stone
  light: '#A8A29E',     // Muted Gray
  accent: '#D97706',    // Bronze/Gold
  background: '#FAFAF9', // Warm Off-White
  surface: '#FFFFFF',   
  pillActive: '#292524',
  pillInactive: '#E7E5E4',
};

// --- Mock Data ---
const CATEGORIES = ['All', 'Hair', 'Spa', 'Nails', 'Makeup', 'Massage'];

const SALONS = [
  { 
    id: '1', 
    name: 'Luxe Hair Studio', 
    location: 'Indiranagar, Bangalore', 
    rating: 4.8, 
    tags: ['Hair', 'Color'],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800' 
  },
  { 
    id: '2', 
    name: 'Urban Glow Spa', 
    location: 'Bandra West, Mumbai', 
    rating: 4.5, 
    tags: ['Spa', 'Massage'],
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1469&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    name: 'The Barber Collective', 
    location: 'Hauz Khas, New Delhi', 
    rating: 4.9, 
    tags: ['Men', 'Hair'],
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800' 
  },
];

// --- Components ---

const UniqueSalonCard = ({ item }) => (
  <TouchableOpacity style={styles.cardContainer} activeOpacity={0.95}>
    <View style={styles.cardInner}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.gradientOverlay} />
      
      <View style={styles.glassBadge}>
        <Text style={styles.starText}>★ {item.rating}</Text>
      </View>

      <View style={styles.cardOverlayContent}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardLocation}>📍 {item.location}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
           <Text style={styles.bookText}>Reserve</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const CategoryPill = ({ name, isActive, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
  >
    <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
      {name}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [currentUser, setCurrentUser] = useState(auth().currentUser);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const refreshUser = async () => {
      try { await auth().currentUser?.reload(); setCurrentUser(auth().currentUser); } catch (e) {}
    };
    refreshUser();
  }, []);

  const handleProfilePress = () => {
    const name = currentUser?.displayName || 'Guest';
    const email = currentUser?.email || 'No Email';
    Alert.alert("My Account", `${name}\n${email}`, [
      { text: "Cancel", style: 'cancel' },
      { text: "Log Out", style: 'destructive', onPress: () => auth().signOut() }
    ]);
  };

  const getFirstName = () => {
    if (currentUser?.displayName) return currentUser.displayName.split(' ')[0];
    return 'Guest';
  };

  const filteredSalons = SALONS.filter(salon => 
    (activeCategory === 'All' || salon.tags.includes(activeCategory)) &&
    (salon.name.toLowerCase().includes(searchText.toLowerCase()) || 
     salon.location.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      
      {/* --- Compact Unique Header --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeLabel}>Good Morning,</Text>
          <Text style={styles.welcomeName}>{getFirstName()}</Text>
        </View>
        <TouchableOpacity onPress={handleProfilePress} style={styles.profileRing}>
           <Image 
             source={{ uri: 'https://ui-avatars.com/api/?name=' + getFirstName() + '&background=1C1917&color=fff' }} 
             style={styles.profileImage} 
           />
        </TouchableOpacity>
      </View>

      {/* --- Search --- */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Find your glow..."
            placeholderTextColor={THEME.light}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* --- Categories --- */}
      <View style={styles.categorySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
          {CATEGORIES.map((cat) => (
            <CategoryPill 
              key={cat} 
              name={cat} 
              isActive={activeCategory === cat} 
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* --- List --- */}
      <FlatList
        data={filteredSalons}
        renderItem={({ item }) => <UniqueSalonCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
  },
  
  // --- Compact Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Centered vertically
    paddingHorizontal: 24,
    marginTop: 6,        // Reduced from 10
    marginBottom: 16,    // Reduced from 24
  },
  welcomeLabel: {
    fontSize: 12,       // Reduced from 14
    color: THEME.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  welcomeName: {
    fontSize: 22,       // Reduced from 32
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '700',
    color: THEME.dark,
    lineHeight: 26,     // Tighter line height
  },
  profileRing: {
    padding: 2,
    borderWidth: 1,
    borderColor: THEME.medium,
    borderRadius: 50,
  },
  profileImage: {
    width: 38,          // Slightly smaller
    height: 38,
    borderRadius: 19,
  },

  // Search
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20, // Reduced spacing
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    height: 52, // Slightly shorter
    borderRadius: 26,
    paddingHorizontal: 20,
    shadowColor: "#D97706",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: { fontSize: 18, marginRight: 12, opacity: 0.4 },
  input: { flex: 1, fontSize: 15, color: THEME.dark, fontWeight: '500' },

  // Categories
  categorySection: { marginBottom: 20, height: 36 }, // Compact
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: THEME.pillActive },
  pillInactive: { backgroundColor: THEME.pillInactive },
  pillText: { fontWeight: '600', fontSize: 13 },
  pillTextActive: { color: '#FFF' },
  pillTextInactive: { color: THEME.medium },

  // Cards
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  cardContainer: {
    height: 260, 
    borderRadius: 32,
    backgroundColor: THEME.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  cardInner: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  glassBadge: {
    position: 'absolute',
    top: 20, right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12,
  },
  starText: { fontWeight: 'bold', fontSize: 12, color: THEME.dark },
  cardOverlayContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    backgroundColor: 'rgba(28, 25, 23, 0.5)', 
  },
  cardTitle: {
    fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 4, letterSpacing: 0.5,
  },
  cardLocation: {
    fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14,
  },
  bookText: {
    color: THEME.dark, fontWeight: '700', fontSize: 11, textTransform: 'uppercase',
  },
});
