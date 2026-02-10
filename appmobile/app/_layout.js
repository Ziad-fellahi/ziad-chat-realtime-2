import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          presentation: 'transparentModal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(authenticated)" />
      </Stack>
    </AuthProvider>
  );
}
