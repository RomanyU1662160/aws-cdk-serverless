import * as cdk from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { APIStack } from "./stacks/APIStack";
import { AuthStack } from "./stacks/Authstack";

const app = new cdk.App();

const authStack = new AuthStack(app, "AuthStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const dataStack = new DataStack(app, "DataStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const lambdaStack = new LambdaStack(app, "LambdaStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  table: dataStack.table,
});

const apiGatewayStack = new APIStack(app, "ApiGatewayLambda", {
  spacesLambdaIntegration: lambdaStack.SpacesLambdaIntegration,
  userCognitoPool: authStack.UserPool,
  description: "API gateway to call lambda function",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
