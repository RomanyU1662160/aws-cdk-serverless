import { Stack } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import path = require("path");
import { generateUniqueStackName } from "../../utils/uniqueName";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Table } from "aws-cdk-lib/aws-dynamodb";

type LambdaStackProps = cdk.StackProps & {
  table: Table;
};

export class LambdaStack extends Stack {
  readonly SpacesLambdaIntegration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const spacesLambda = new NodejsFunction(this, "SpacesLambda", {
      functionName: generateUniqueStackName(this),
      entry: path.resolve(__dirname, "../services/spaces/handler.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    const dynamoDBPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
      ],
      resources: [props.table.tableArn],
    });

    spacesLambda.addToRolePolicy(dynamoDBPolicy);

    this.SpacesLambdaIntegration = new LambdaIntegration(spacesLambda);

    new cdk.CfnOutput(this, "lambda-name", {
      value: spacesLambda.functionName,
    });
  }
}
