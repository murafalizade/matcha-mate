// inside (chats)/index.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function ChatsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chat List</Text>
            <Pressable
                style={{ padding: 10, backgroundColor: 'lightblue', marginTop: 20 }}
                onPress={() => router.push('/(authorized)/(chats)/message')}
            >
                <Text>Go to Message</Text>
            </Pressable>
        </View>
    );
}
