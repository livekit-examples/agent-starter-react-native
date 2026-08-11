import { useAgent, useRemoteParticipants } from '@livekit/components-react';
import { BarVisualizer, VideoTrack } from '@livekit/react-native';
import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type AgentVisualizationProps = {
  style: StyleProp<ViewStyle>;
};

const barSize = 0.2;

export default function AgentVisualization({ style }: AgentVisualizationProps) {
  const { state, microphoneTrack, cameraTrack } = useAgent();
  const remoteParticipants = useRemoteParticipants();
  const hasAgent = remoteParticipants.some(
    (participant) => participant.isAgent
  );
  const [barWidth, setBarWidth] = useState(0);
  const [barBorderRadius, setBarBorderRadius] = useState(0);

  const layoutCallback = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log(x, y, width, height);
    setBarWidth(barSize * height);
    setBarBorderRadius(barSize * height);
  }, []);

  let videoView = cameraTrack ? (
    <VideoTrack trackRef={cameraTrack} style={styles.videoTrack} />
  ) : null;
  return (
    <View style={[style, styles.container]}>
      <View style={styles.barVisualizerContainer} onLayout={layoutCallback}>
        <BarVisualizer
          state={state}
          barCount={5}
          options={{
            minHeight: barSize,
            barWidth: barWidth,
            barColor: '#FFFFFF',
            barBorderRadius: barBorderRadius,
          }}
          trackRef={microphoneTrack}
          style={styles.barVisualizer}
        />
      </View>
      {!hasAgent && <Text style={styles.waitingText}>Waiting for agent</Text>}
      {videoView}
    </View>
  );
}

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
  barVisualizerContainer: {
    width: '100%',
    height: '30%',
    zIndex: 0,
  },
  barVisualizer: {
    width: '100%',
    height: '100%',
  },
  waitingText: {
    position: 'absolute',
    top: '68%',
    color: '#FFFFFF',
    fontSize: 16,
  },
});
