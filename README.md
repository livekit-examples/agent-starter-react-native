<img src="./.github/assets/icon.png" alt="Voice Assistant App Icon" width="100" height="100">

# React-Native Voice Assistant

This is a starter template for [LiveKit Agents](https://docs.livekit.io/agents/overview/) that provides a simple voice interface using the [LiveKit React-Native SDK](https://github.com/livekit/client-sdk-react-native) and [Expo Plugin](https://github.com/livekit/client-sdk-react-native-expo-plugin).

This template is free for you to use or modify as you see fit.

## Getting started

The easiest way to get this app running is with the [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup/).

Then, run the following command to automatically clone this template and connect it to LiveKit Cloud:

```bash
lk app create --template agent-starter-react-native
```

Afterwards, move to the newly created folder and run the following commands:

```bash
npm install

# Android
npx expo run:android

# iOS
npx expo run:ios
```

The app is configured to connect to the LiveKit homepage agent by default, which you can also try at [livekit.com](https://www.livekit.com). To point the app at your own agent, see [Connect to your agent](#connect-to-your-agent).

> [!NOTE]
> To setup without the LiveKit CLI, clone the repository via git.

## Connect to your agent

To switch from the default agent to your own, you first need a LiveKit agent to speak with. For a no-code setup, use the [Agent Builder](https://docs.livekit.io/agents/start/builder/). For more customization, try our starter agent for [Python](https://github.com/livekit-examples/agent-starter-python), [Node.js](https://github.com/livekit-examples/agent-starter-node), or [create your own from scratch](https://docs.livekit.io/agents/start/voice-ai/).

Second, you need a token server. For development, the easiest option is the [development token server](https://docs.livekit.io/frontends/build/authentication/development-token-server/): turn on the **Development token server** switch on the [Settings](https://cloud.livekit.io/projects/p_/settings/project) page in LiveKit Cloud and copy the **Token server ID**.

Then edit `tokenServerId` in `hooks/useConnection.tsx`:

```ts
const tokenServerId = '<your-token-server-id>';
```

> [!NOTE]
> The development token server is for prototyping only: any client can request a token with any permissions. See [Token generation](#token-generation) before you ship.
>
> This setting was previously called the *sandbox token server*.

## Token generation

In a production environment, you will be responsible for developing a solution to [generate tokens for your users](https://docs.livekit.io/home/server/generating-tokens/) that integrates with your authentication system.

You should turn off the development token server and replace `TokenSource.developmentTokenServer` in `hooks/useConnection.tsx` with `TokenSource.endpoint` pointing at your own token server, or a `TokenSource.custom` implementation.

## Contributing

This template is open source and we welcome contributions! Please open a PR or issue through GitHub, and don't forget to join us in the [LiveKit Community Slack](https://livekit.io/join-slack)!
