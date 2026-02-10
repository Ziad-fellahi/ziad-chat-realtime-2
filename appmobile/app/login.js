import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api';
import Input from '../components/Input';
import BackButton from '../components/BackButton';

const BRAND_PRIMARY = '#1d2bab';
const BRAND_SECONDARY = '#1729a0';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Nettoyage strict des données
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    setLoading(true);
    console.log('🔐 Tentative de connexion...');
    console.log('📍 URL API:', `${API_BASE_URL}/auth/login`);
    console.log('👤 Username (nettoyé):', cleanUsername);
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: cleanUsername, 
          password: cleanPassword 
        }),
      });

      console.log('📡 Statut réponse:', res.status);

      if (!res.ok) {
        if (res.status === 401) {
          Alert.alert('Erreur', 'Identifiant ou mot de passe incorrect');
          console.error('❌ Erreur 401: Identifiants invalides');
          return;
        }
        
        const errorData = await res.json().catch(() => null);
        console.error('❌ Erreur serveur:', errorData);
        throw new Error(errorData?.message || 'Erreur de connexion au serveur');
      }
      
      const data = await res.json();
      console.log('✅ Connexion réussie:', { username: data.username, role: data.role });
      
      // Utiliser la fonction login du contexte
      await login(data.access_token, {
        username: data.username,
        role: data.role,
      });
      
      // Redirection automatique selon le rôle
      const rolePages = {
        admin: '/admin',
        moniteur: '/moniteur',
        secretaire: '/admin',
        eleve: '/eleve',
        user: '/eleve',
      };
      
      const targetPage = rolePages[data.role] || '/eleve';
      console.log('🔄 Redirection vers:', targetPage);
      router.replace(targetPage);
    } catch (err) {
      console.error('❌ Erreur Connexion:', err);
      Alert.alert('Erreur', err.message || 'Une erreur est survenue lors de la connexion');
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
            <View style={[styles.loginBox, { width: Math.min(width * 0.9, 400) }]}>
              <Text style={styles.title}>Connexion</Text>
              <Text style={styles.subtitle}>Bienvenue sur GoVo</Text>
              
              <View style={styles.form}>
                <Input
                  label="Nom d'utilisateur"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <Input
                  label="Mot de passe"
                  placeholder="Entrez votre mot de passe"
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
                    {loading ? 'Connexion...' : 'Se connecter'}
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
    minHeight: '100%',
  },
  loginBox: {
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
});
