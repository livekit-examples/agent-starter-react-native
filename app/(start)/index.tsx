import { useConnection } from '@/hooks/useConnection';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function StartScreen() {
  const router = useRouter();
  const { isConnectionActive, connect } = useConnection();

  // Navigate to Assistant screen when we have the connection details.
  useEffect(() => {
    if (isConnectionActive) {
      router.navigate('../assistant');
    }
  }, [isConnectionActive, router]);

  let connectText: string;

  if (isConnectionActive) {
    connectText = 'Connecting';
  } else {
    connectText = 'Start Voice Assistant';
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/images/start-logo.png')}
      />
      <Text style={styles.text}>Chat live with your voice AI agent</Text>

      <TouchableOpacity
        onPress={() => {
          connect();
        }}
        style={styles.button}
        activeOpacity={0.7}
        disabled={isConnectionActive} // Disable button while loading
      >
        {isConnectionActive ? (
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={styles.activityIndicator}
          />
        ) : undefined}

        <Text style={styles.buttonText}>{connectText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 59,
    height: 56,
    marginBottom: 16,
  },
  text: {
    color: '#ffffff',
    marginBottom: 24,
  },
  activityIndicator: {
    marginEnd: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#002CF2',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200, // Ensure button has a minimum width when loading
  },
  buttonText: {
    color: '#ffffff',
  },
});
