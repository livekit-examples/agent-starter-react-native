import { useVoiceAssistant } from "@livekit/components-react";
import { BarVisualizer } from "@livekit/react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type AgentVisualizationProps = {
  style: StyleProp<ViewStyle>,
}

export default function AgentVisualization({
  style
}: AgentVisualizationProps) {
  const { state, audioTrack, videoTrack } = useVoiceAssistant();
  return (
    <View style={style} >
      
      <BarVisualizer
        state={state}
        barCount={7}
        options={{
          minHeight: 0.5,
        }}
        trackRef={audioTrack}
        style={styles.voiceAssistant}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  voiceAssistant: {
    width: '100%',
    height: '100%',
  },
});
