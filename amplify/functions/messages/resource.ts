import { defineFunction } from "@aws-amplify/backend";

export const messages = defineFunction({
  name: "messages",
  // memorySize: 256, timeoutSeconds: 10, runtime: "nodejs20.x" // optional
});
