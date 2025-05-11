import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{title: 'Home'}} />
      <Stack.Screen name="restaurant_filter" options={{title: 'Restaurant Filter'}} />
      <Stack.Screen name="wheel" options={{title: 'Wheel'}} />
    </Stack>
  );
}
