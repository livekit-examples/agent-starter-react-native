import { useVoiceAssistant } from "@livekit/components-react";
import { BarVisualizer, VideoTrack } from "@livekit/react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type AgentVisualizationProps = {
  style: StyleProp<ViewStyle>,
}

export default function AgentVisualization({
  style
}: AgentVisualizationProps) {
  const { state, audioTrack, videoTrack } = useVoiceAssistant();

  let videoView = ( videoTrack 
    ? <VideoTrack 
        trackRef={videoTrack} 
        style={styles.videoTrack}
      />
    : null
  )
  return (
    <View style={[style, styles.container]} >
      
      <BarVisualizer
        state={state}
        barCount={5}
        options={{
          minHeight: 0.1,
          barWidth: 12,
        }}
        trackRef={audioTrack}
        style={styles.voiceAssistant}
      />
      {videoView}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  voiceAssistant: {
    width: '100%',
    height: '30%',
    zIndex: 0,
  },
});
