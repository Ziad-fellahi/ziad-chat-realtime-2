import { Dimensions } from 'react-native';

// Dimensions de l'écran
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints
export const BREAKPOINTS = {
  small: 375,
  medium: 768,
  large: 1024,
};

// Fonction pour obtenir une taille responsive
export const responsiveSize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Basé sur iPhone SE (375px)
  return Math.round(size * scale);
};

// Fonction pour obtenir une hauteur responsive
export const responsiveHeight = (percentage) => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Fonction pour obtenir une largeur responsive
export const responsiveWidth = (percentage) => {
  return (SCREEN_WIDTH * percentage) / 100;
};

// Espacements globaux
export const SPACING = {
  xs: responsiveSize(4),
  sm: responsiveSize(8),
  md: responsiveSize(16),
  lg: responsiveSize(24),
  xl: responsiveSize(32),
  xxl: responsiveSize(48),
};

// Tailles de police
export const FONT_SIZES = {
  xs: responsiveSize(10),
  sm: responsiveSize(12),
  md: responsiveSize(14),
  lg: responsiveSize(16),
  xl: responsiveSize(20),
  xxl: responsiveSize(24),
  xxxl: responsiveSize(32),
};

// Border radius
export const BORDER_RADIUS = {
  sm: responsiveSize(4),
  md: responsiveSize(8),
  lg: responsiveSize(12),
  xl: responsiveSize(16),
};

// Couleurs globales
export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1e40af',
  secondary: '#64748b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#f0f9ff',
  backgroundSecondary: '#e0f2fe',
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  border: '#cbd5e1',
  borderLight: 'rgba(148,163,184,0.25)',
  shadow: '#0f172a',
};

// Ombres
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BREAKPOINTS,
  responsiveSize,
  responsiveHeight,
  responsiveWidth,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
};
