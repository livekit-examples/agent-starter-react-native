import { ConnectionDetails, fetchToken } from '@/hooks/useConnectionDetails';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

  let [isConnecting, setConnecting] = useState(false);
  let [connectionDetails, setConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);

  // Fetch token when we're connecting.
  useEffect(() => {
    if (isConnecting) {
      fetchToken().then((details) => {
        console.log(details);
        setConnectionDetails(details);
        if (!details) {
          setConnecting(false);
        }
      });
    }
  }, [isConnecting]);

  // Navigate to Assistant screen when we have the connection details.
  useEffect(() => {
    if (isConnecting && connectionDetails) {
      setConnecting(false);
      setConnectionDetails(undefined);
      router.navigate('../assistant');
    }
  }, [isConnecting, router, connectionDetails]);

  let connectText: string;

  if (isConnecting) {
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
          setConnecting(true);
        }}
        style={styles.button}
        activeOpacity={0.7}
        disabled={isConnecting} // Disable button while loading
      >
        {isConnecting ? (
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
