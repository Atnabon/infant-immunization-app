import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import NfcManager, { NfcEvents, Ndef } from "react-native-nfc-manager"; // Import Ndef from react-native-nfc-manager

const App = () => {
  const [hasNfc, setHasNFC] = useState(null);

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.log("tag found");
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  const writeNFC = async () => {
    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef); // Import NfcTech from react-native-nfc-manager

      const bytes = Ndef.encodeMessage([
        Ndef.uriRecord("https://blog.logrocket.com/"),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={readTag}>
        <Text style={{ color: "blue" }}>Scan Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={writeNFC}>
        <Text style={{ color: "blue" }}>Write Tag</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
