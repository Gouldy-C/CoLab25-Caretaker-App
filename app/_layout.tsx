import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useLoading } from '@utils/stores/loadingStore';
import { userStore } from '@utils/stores/userStore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { useFonts } from 'expo-font';
import { Slot, SplashScreen} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { checkForNewUser } from '@utils/firestore/firestoreFunctions';
import firestore from '@react-native-firebase/firestore';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {loading, setLoading} = useLoading((state) => state);
  const { user, setUser, setUserDoc} = userStore((state) => state);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  const userId = auth().currentUser?.uid;
  
  async function userChange(user: FirebaseAuthTypes.User | null) {
    setLoading(true)
    setUser(user)
    if (user) {
      
    }
    if (loading) setLoading(false);
  }



  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userChange);
    return subscriber; // unsubscribe on unmount
  }, []);


  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserDoc({
            authProvider: documentSnapshot.get('authProvider'),
            createdTime: documentSnapshot.get('createdTime'),
            displayName: documentSnapshot.get('displayName'),
            email: documentSnapshot.get('email'),
            emailVerified: documentSnapshot.get('emailVerified'),
            lastSignInTime: documentSnapshot.get('lastSignInTime'),
            lastUpdatedTime: documentSnapshot.get('lastUpdatedTime'),
            phoneNumber: documentSnapshot.get('phoneNumber'),
            photoURL: documentSnapshot.get('photoURL'),
            providerId: documentSnapshot.get('providerId'),
            uid: documentSnapshot.get('uid'),
            bookmarkedStrategies: documentSnapshot.get('bookmarkedStrategies'),
          })
        }
      }, err => {console.log(err)});
    return subscriber;
  }, [userId]);


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);


  useEffect(() => {
    
  }, [user]);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);


  if (!loaded || loading) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
    <StatusBar style='dark' translucent={true} backgroundColor='transparent'/>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
          <Slot/>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
