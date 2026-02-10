import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/styles';

export default function Eleve() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const userRole = user?.role || 'eleve';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Vue pour Admin/Secrétaire : Gestion des élèves
  if (userRole === 'admin' || userRole === 'secretaire') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#f0f9ff', '#e0f2fe']} style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Espace Élève</Text>
              <Text style={styles.headerSubtitle}>
                {userRole === 'admin' ? 'Vue administrateur' : 'Gestion des élèves'}
              </Text>
            </View>

            {/* Cards Grid */}
            <View style={styles.grid}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Liste des élèves</Text>
                <Text style={styles.cardValue}>—</Text>
                <Text style={styles.cardHint}>Base de données en cours de connexion</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Élèves actifs</Text>
                <Text style={styles.cardValue}>—</Text>
                <Text style={styles.cardHint}>Statistiques à venir</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Recherche d'élève</Text>
                <Text style={styles.cardValue}>—</Text>
                <Text style={styles.cardHint}>Fonction bientôt disponible</Text>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Vue pour Élève : Espace personnel
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#f0f9ff', '#e0f2fe']} style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mon Espace Élève</Text>
            <Text style={styles.headerSubtitle}>Suivi de ma formation</Text>
            <Text style={styles.username}>👤 {user?.username}</Text>
          </View>

          {/* Cards Grid */}
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mes prochaines séances</Text>
              <Text style={styles.cardValue}>—</Text>
              <Text style={styles.cardHint}>Planning bientôt disponible</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Heures effectuées</Text>
              <Text style={styles.cardValue}>—</Text>
              <Text style={styles.cardHint}>Suivi en cours</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Compétences validées</Text>
              <Text style={styles.cardValue}>—</Text>
              <Text style={styles.cardHint}>Évaluation à venir</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  username: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  grid: {
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cardValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  cardHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    minHeight: 50,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
});
