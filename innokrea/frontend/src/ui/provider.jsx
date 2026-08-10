import React from "react";
import { ChakraProvider, createSystem, defaultSystem } from "@chakra-ui/react";

const chakraSystem = createSystem(defaultSystem);

export function Provider({ children }) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}
