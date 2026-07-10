import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { VenueProvider } from '@/hooks/useVenue';
import '../global.css'

SplashScreen.preventAutoHideAsync();

// "launch" and "qr-code" live under the (unauthorized) route group for
// historical reasons, but both require a logged-in user (post-login,
// pre-check-in screens) — hence the explicit auth requirement below rather
// than deriving it purely from the group name.
const PUBLIC_UNAUTH_SCREENS = new Set<string | undefined>([
  undefined,
  'index',
  'login',
  'create-profile',
]);

function useProtectedRoute() {
  const { isAuth, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const [group, screen] = segments as unknown as string[];
    const inUnauthGroup = group === '(unauthorized)';
    const isPublicScreen = inUnauthGroup && PUBLIC_UNAUTH_SCREENS.has(screen);
    const requiresAuth = group === '(authorized)' || (inUnauthGroup && !isPublicScreen);

    if (!isAuth && requiresAuth) {
      router.replace('/(unauthorized)');
    } else if (isAuth && isPublicScreen) {
      router.replace('/(unauthorized)/launch');
    }
  }, [isAuth, isLoading, segments]);
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    FontAwesome.loadFont();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <VenueProvider>
        <RootLayoutNav />
      </VenueProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();
  useProtectedRoute();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
  );
}
