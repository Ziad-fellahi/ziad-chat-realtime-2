import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../config/api';
import Input from '../components/Input';
import BackButton from '../components/BackButton';

const BRAND_PRIMARY = '#1d2bab';
const BRAND_SECONDARY = '#1729a0';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();

  const handleSubmit = async () => {
    // Validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Nettoyage strict des données
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    setLoading(true);
    console.log('📝 Tentative d\'inscription...');
    console.log('📍 URL API:', `${API_BASE_URL}/auth/register`);
    console.log('👤 Username (nettoyé):', cleanUsername);
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: cleanUsername,
          password: cleanPassword,
          role: 'eleve', // Inscription mobile = élève uniquement
        }),
      });

      console.log('📡 Statut réponse:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('❌ Erreur serveur:', errorData);
        
        // Gestion spécifique des erreurs
        if (res.status === 401 || res.status === 400) {
          if (errorData?.message?.includes('already exists')) {
            Alert.alert('Erreur', 'Cet identifiant existe déjà. Veuillez en choisir un autre.');
          } else if (errorData?.message?.includes('required')) {
            Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
          } else {
            Alert.alert('Erreur', errorData?.message || 'Cet identifiant est déjà utilisé.');
          }
          return;
        }
        
        throw new Error(errorData?.message || 'Erreur lors de l\'inscription');
      }
      
      console.log('✅ Inscription réussie!');
      Alert.alert(
        'Succès', 
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          }
        ]
      );
    } catch (err) {
      console.error('❌ Erreur Inscription:', err);
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#f0f2ff', '#e1e5ff']}
      locations={[0, 0.6, 0.85, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.registerBox, { width: Math.min(width * 0.9, 400) }]}>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>Créez votre compte GoVo</Text>
              
              <View style={styles.form}>
                <Input
                  label="Identifiant"
                  placeholder="Choisissez votre identifiant"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <Input
                  label="Mot de passe"
                  placeholder="Créez un mot de passe (min. 6 caractères)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Inscription...' : 'S\'inscrire'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => router.push('/login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLinkText}>
                    Vous avez déjà un compte ? <Text style={styles.loginLinkBold}>Connectez-vous</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  registerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: BRAND_SECONDARY,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  form: {
    width: '100%',
  },
  button: {
    backgroundColor: BRAND_PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.3,
  },
  loginLinkBold: {
    fontWeight: '700',
    color: BRAND_PRIMARY,
  },
});
