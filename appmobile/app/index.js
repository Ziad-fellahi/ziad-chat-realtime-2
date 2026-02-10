import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Dimensions,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Couleurs officielles du logo GOVO
const BRAND_PRIMARY = '#1d2bab';
const BRAND_SECONDARY = '#1729a0';

export default function Index() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  // Redirection automatique si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      const rolePages = {
        admin: '/admin',
        moniteur: '/moniteur',
        secretaire: '/admin',
        eleve: '/eleve',
        user: '/eleve',
      };
      
      const targetPage = rolePages[role] || '/eleve';
      router.replace(targetPage);
    }
  }, [isAuthenticated, role]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  // Landing Page - Page unique de destination
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#f0f2ff', '#e1e5ff']}
      locations={[0, 0.6, 0.85, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        
        {/* Logo Géant au Centre */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/GOVO-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Boutons d'Action en Bas */}
        <View style={styles.buttonsContainer}>
          
          {/* Bouton Connexion - Plein */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonFilled]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonFilledText}>Connexion</Text>
          </TouchableOpacity>

          {/* Bouton S'inscrire - Outline */}
          <TouchableOpacity 
            style={[styles.button, styles.buttonOutline]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonOutlineText}>S'inscrire</Text>
          </TouchableOpacity>

        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: '85%',
    height: undefined,
    aspectRatio: 1,
    maxWidth: 400,
  },
  buttonsContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonFilled: {
    backgroundColor: BRAND_PRIMARY,
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonFilledText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: BRAND_PRIMARY,
  },
  buttonOutlineText: {
    color: BRAND_PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
