import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type ChatBarProps = {
  style: StyleProp<ViewStyle>;
  value: string;
  onChangeText: (text: string) => void;
  onChatSend: (text: string) => void;
};

export default function ChatBar({
  style,
  value,
  onChangeText,
  onChatSend,
}: ChatBarProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[style]}
      keyboardVerticalOffset={24}
    >
      <View style={styles.container}>
        <TextInput
          style={[styles.input]}
          value={value}
          placeholder={'Message'}
          placeholderTextColor={'#666666'}
          onChangeText={onChangeText}
          multiline={true}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => onChatSend(value)}
        >
          <View>
            <Image source={require('@/assets/images/arrow_upward_24dp.png')} />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#131313',
    borderRadius: 24,
    padding: 8,
  },
  input: {
    outlineStyle: undefined,
    flexGrow: 1,
    marginStart: 8,
    marginEnd: 16,
    color: '#FFFFFF',
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#666666',
  },
});
