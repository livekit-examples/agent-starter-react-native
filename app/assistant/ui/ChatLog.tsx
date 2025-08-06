import { Transcription } from '@/hooks/useDataStreamTranscriptions';
import { useLocalParticipant } from '@livekit/components-react';
import { useCallback } from 'react';
import {
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

export type ChatLogProps = {
  style: StyleProp<ViewStyle>;
  transcriptions: Transcription[];
};
export default function ChatLog({ style, transcriptions }: ChatLogProps) {
  const { localParticipant } = useLocalParticipant();
  const localParticipantIdentity = localParticipant.identity;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Transcription>) => {
      const isLocalUser = item.identity === localParticipantIdentity;
      if (isLocalUser) {
        return <UserTranscriptionText text={item.segment.text} />;
      } else {
        return <AgentTranscriptionText text={item.segment.text} />;
      }
    },
    [localParticipantIdentity]
  );

  return (
    <Animated.FlatList
      renderItem={renderItem}
      data={transcriptions}
      style={style}
      inverted={true}
      itemLayoutAnimation={LinearTransition}
    />
  );
}

const UserTranscriptionText = (props: { text: string }) => {
  let { text } = props;
  const colorScheme = useColorScheme();
  const themeStyle =
    colorScheme === 'light'
      ? styles.userTranscriptionLight
      : styles.userTranscriptionDark;
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  return (
    text && (
      <View style={styles.userTranscriptionContainer}>
        <Text style={[styles.userTranscription, themeStyle, themeTextStyle]}>
          {text}
        </Text>
      </View>
    )
  );
};

const AgentTranscriptionText = (props: { text: string }) => {
  let { text } = props;
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  return (
    text && (
      <Text style={[styles.agentTranscription, themeTextStyle]}>{text}</Text>
    )
  );
};

const styles = StyleSheet.create({
  userTranscriptionContainer: {
    width: '100%',
    alignContent: 'flex-end',
  },
  userTranscription: {
    width: 'auto',
    fontSize: 17,
    alignSelf: 'flex-end',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 16,
  },
  userTranscriptionLight: {
    backgroundColor: '#B0B0B0',
  },
  userTranscriptionDark: {
    backgroundColor: '#131313',
  },

  agentTranscription: {
    fontSize: 17,
    textAlign: 'left',
    margin: 16,
  },
  lightThemeText: {
    color: '#000000',
  },
  darkThemeText: {
    color: '#FFFFFF',
  },
});
