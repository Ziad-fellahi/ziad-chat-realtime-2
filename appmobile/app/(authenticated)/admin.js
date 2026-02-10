import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, SafeAreaView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { io } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/api';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/styles';

export default function Admin() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [messages, setMessages] = useState([]);
  const [onlineUsernames, setOnlineUsernames] = useState([]);
  const [msgPerSec, setMsgPerSec] = useState(0);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const counterRef = useRef(0);
  const flatListRef = useRef(null);

  const handleLogout = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    await logout();
    router.replace('/login');
  };

  useEffect(() => {
    if (!token || !user) return;

    // Socket.io pour le temps réel
    socketRef.current = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      query: { username: user.username, token: token },
      secure: true,
      rejectUnauthorized: false
    });

    // Écouter l'historique des messages
    socketRef.current.on('message_history', (history) => {
      console.log('📜 Historique reçu:', history);
      if (Array.isArray(history)) {
        setMessages(history.slice(-100));
      }
    });

    // Écouter les nouveaux messages
    socketRef.current.on('msg_to_client', (newMsg) => {
      console.log('💬 Nouveau message:', newMsg);
      counterRef.current += 1;
      setMessages(prev => [...prev, newMsg].slice(-100));
    });

    // Écouter la liste des utilisateurs connectés
    socketRef.current.on('update_user_list', (usernames) => {
      const raw = Array.isArray(usernames) ? usernames : [];
      const filtered = raw.filter(u => typeof u === 'string' && !u.startsWith('Guest-'));
      console.log('👥 Utilisateurs en ligne (filtrés):', filtered);
      setOnlineUsernames(raw);
      setLoading(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.io:', error);
    });

    socketRef.current.on('disconnect', () => {
      console.log('⚠️ Déconnecté du serveur');
    });

    const metricsInterval = setInterval(() => {
      setMsgPerSec(counterRef.current);
      counterRef.current = 0;
    }, 1000);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      clearInterval(metricsInterval);
    };
  }, [token, user]);

  // Auto-scroll aux nouveaux messages
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const visibleOnlineUsernames = onlineUsernames.filter(u => typeof u === 'string' && !u.startsWith('Guest-'));
  const onlineCount = visibleOnlineUsernames.length;

  const renderMessage = ({ item }) => (
    <View style={styles.logLine}>
      <Text style={styles.logTime}>
        [{new Date(item.createdAt).toLocaleTimeString()}]
      </Text>
      <Text style={styles.logUser}> @{item.user}: </Text>
      <Text style={styles.logMsg}>{item.text}</Text>
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.statusIndicator} />
      <Text style={styles.username}>{item}</Text>
      <View style={styles.liveBadge}>
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header Admin */}
        <View style={styles.adminHeader}>
          <Text style={styles.adminTitle}>🔐 Administration</Text>
          <Text style={styles.adminSubtitle}>Gestion Globale</Text>
          <Text style={styles.username}>👤 {user?.username}</Text>
        </View>

        {/* Navigation rapide */}
        <View style={styles.navGrid}>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => router.push('/moniteur')}
          >
            <Text style={styles.navCardTitle}>👨‍🏫 Moniteurs</Text>
            <Text style={styles.navCardDesc}>Gérer les comptes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => router.push('/eleve')}
          >
            <Text style={styles.navCardTitle}>🎓 Élèves</Text>
            <Text style={styles.navCardDesc}>Gérer les comptes</Text>
          </TouchableOpacity>
        </View>

        {/* Métriques */}
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>📊 Métriques Temps Réel</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{onlineCount}</Text>
              <Text style={styles.metricLabel}>En ligne</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{msgPerSec}</Text>
              <Text style={styles.metricLabel}>msg/sec</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{messages.length}</Text>
              <Text style={styles.metricLabel}>Messages</Text>
            </View>
          </View>
        </View>

        {/* Utilisateurs en ligne */}
        <View style={styles.usersCard}>
          <Text style={styles.sectionTitle}>👥 Utilisateurs en ligne ({onlineCount})</Text>
          {loading ? (
            <Text style={styles.loadingText}>⏳ Connexion en cours...</Text>
          ) : visibleOnlineUsernames.length > 0 ? (
            <FlatList
              data={visibleOnlineUsernames}
              renderItem={renderUser}
              keyExtractor={(item, index) => index.toString()}
              style={styles.usersList}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>Aucun utilisateur en ligne</Text>
          )}
        </View>

        {/* Terminal des messages */}
        <View style={styles.terminalCard}>
          <View style={styles.terminalHeader}>
            <View style={styles.terminalDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.terminalTitle}>monitor.log</Text>
          </View>
          <View style={styles.terminalBody}>
            {messages.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            ) : (
              <Text style={styles.emptyLogs}>⏸️ En attente de messages...</Text>
            )}
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
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  adminHeader: {
    marginBottom: SPACING.lg,
  },
  adminTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: SPACING.xs,
  },
  adminSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: SPACING.sm,
  },
  username: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  navGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  navCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  navCardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: SPACING.xs,
  },
  navCardDesc: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  metricsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  metricsTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: SPACING.md,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.success,
  },
  metricLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  usersCard: {
    backgroundColor: '#1e293b',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: SPACING.sm,
  },
  usersList: {
    maxHeight: 200,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
  },
  liveBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  liveText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  terminalCard: {
    backgroundColor: '#1e293b',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: SPACING.sm,
  },
  terminalDots: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginRight: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  terminalTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  terminalBody: {
    padding: SPACING.sm,
    minHeight: 250,
  },
  messagesList: {
    flex: 1,
  },
  logLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: SPACING.xs,
  },
  logTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  logUser: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logMsg: {
    fontSize: FONT_SIZES.sm,
    color: '#e2e8f0',
    flex: 1,
  },
  emptyLogs: {
    fontSize: FONT_SIZES.md,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: SPACING.xxl,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    minHeight: 50,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
});
