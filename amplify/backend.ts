
import { defineBackend } from "@aws-amplify/backend";
import { HttpApi, HttpMethod, CorsHttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

// If you already create functions elsewhere, reuse them; this is just a minimal example.
const backend = defineBackend({});

backend.addStack("api", (stack) => {
  const helloFn = new NodejsFunction(stack, "HelloFn", {
    entry: "amplify/functions/hello/handler.ts", // <-- point to your handler
  });

  const api = new HttpApi(stack, "HttpApi", {
    corsPreflight: {
      allowMethods: [CorsHttpMethod.ANY],
      allowOrigins: ["*"],
      allowHeaders: ["*"],
    },
  });

  api.addRoutes({
    path: "/hello",
    methods: [HttpMethod.GET],
    integration: new HttpLambdaIntegration("HelloIntegration", helloFn),
  });
});

export default backend;
