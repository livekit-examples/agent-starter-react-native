import { useRoomContext, useVoiceAssistant } from "@livekit/components-react"
import { TextStreamReader, TranscriptionSegment } from "livekit-client"
import { useCallback, useEffect, useState } from "react"

export type Transcription = {
  identity: string,
  segment: TranscriptionSegment,
}

export type TranscriptionsState = {
  transcriptions: Transcription[],
  addTranscription: (identity: string, message: string) => void,
}

export default function useDataStreamTranscriptions(): TranscriptionsState {
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();
  const agentIdentity = agent?.identity;

  const [transcriptionMap] = useState<Map<string, Transcription>>(new Map());
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  const mergeTranscriptions = useCallback((merge: Transcription[]) => {
    for (const transcription of merge) {
      const existing = transcriptionMap.get(transcription.segment.id);
      transcriptionMap.set(transcription.segment.id, {
        identity: transcription.identity,
        segment: mergeTranscriptionSegment(existing?.segment, transcription.segment)
      });
    }

    const sortedTranscriptions = Array.from(transcriptionMap.values())
      .sort((a, b) => b.segment.firstReceivedTime - a.segment.firstReceivedTime);

    setTranscriptions(sortedTranscriptions);
  }, [transcriptionMap, setTranscriptions]);

  const addTranscription = useCallback((identity: string, message: string) => {
    const now = Date.now()
    const newTranscription: Transcription = {
      identity,
      segment: {
        id: crypto.randomUUID(),
        text: message,
        language: '',
        startTime: now,
        endTime: now,
        final: true,
        firstReceivedTime: now,
        lastReceivedTime: now,
      }
    }
    mergeTranscriptions([newTranscription]);
    
    // Send message to agent
    if (agentIdentity) {
      room.localParticipant.sendText(message, {
        topic: 'lk.chat',
        destinationIdentities: [agentIdentity],
      });
    }
  }, [mergeTranscriptions, agentIdentity]);

  useEffect(() => {
    room.registerTextStreamHandler("lk.transcription", (
      reader: TextStreamReader,
      participantInfo: { identity: string },
    ) => {

      const segment = createTranscriptionSegment(reader.info.attributes);
      
      let text = '';

      const readFunc = async () => {
        for await (const chunk of reader) {
          text += chunk;
          const updatedSegment = {
            ...segment,
            text,
            lastReceivedTime: Date.now(),
          };
          mergeTranscriptions([{
            identity: participantInfo.identity,
            segment: updatedSegment,
          }]);
        }

        const finalSegment = {
          ...segment,
          text,
          final: true,
        }

        mergeTranscriptions([{
          identity: participantInfo.identity,
          segment: finalSegment,
        }]);
      };

      readFunc();
    });

    return () => {
      room.unregisterTextStreamHandler("lk.transcription");
    }
  }, [room]);

  return {
    transcriptions,
    addTranscription
  }
}

const createTranscriptionSegment = (attributes?: Record<string, string>): TranscriptionSegment => {
  const now = Date.now()
  return {
    id: attributes?.['lk.segment_id'] ?? '',
    text: '',
    language: '',
    startTime: now,
    endTime: now,
    final: (attributes?.['lk.transcription.final'] ?? false) === 'true',
    firstReceivedTime: now,
    lastReceivedTime: now,
  }
}

const mergeTranscriptionSegment = (existing: TranscriptionSegment | undefined, newSegment: TranscriptionSegment): TranscriptionSegment => {
  if (!existing) {
    return newSegment;
  }

  if (existing.id != newSegment.id) {
    return existing;
  }

  return {
    ...existing,
    text: newSegment.text,
    language: newSegment.language,
    final: newSegment.final,
    endTime: newSegment.endTime,
    lastReceivedTime: newSegment.lastReceivedTime,
  }
}