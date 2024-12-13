import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar"; // Import the StatusBar component
import "../../global.css";

export default function RootLayout() {
    return (
        <>
            {/* StatusBar customization */}
            <StatusBar
                style="dark" // Change to "dark" for dark text/icons
                backgroundColor="white"
                translucent={false}
            />
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen
                    name="meditation/[id]"
                    options={{
                        headerShown: false,
                        animation: "slide_from_bottom",
                    }}
                />
            </Stack>
        </>
    );
}
