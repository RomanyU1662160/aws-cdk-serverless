import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import {
  RestApi,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
  MethodOptions,
  AuthorizationType,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

type APIStackProps = cdk.StackProps & {
  spacesLambdaIntegration: LambdaIntegration;
  userCognitoPool: IUserPool;
};

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "spacesApigateway", {
      restApiName: "spaces-apigateway",
      description: "Spaces API gateway to integrate with a lambda function",
    });

    // create an authorizer form cognito user pool
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "spacesAPIAuthorizer",
      {
        cognitoUserPools: [props.userCognitoPool],
        identitySource: "method.request.header.x-auth", // name of the param in the header that has authentication
      }
    );

    authorizer._attachToApi(api); // attach cognito authorizer to the api

    //create auth options and attach it to each method to apply authorization
    const methodAuthOptions: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const spacesResources = api.root.addResource("spaces");
    spacesResources.addMethod(
      "GET",
      props.spacesLambdaIntegration,
      methodAuthOptions
    );
    spacesResources.addMethod(
      "POST",
      props.spacesLambdaIntegration,
      methodAuthOptions
    );
    spacesResources.addMethod(
      "PUT",
      props.spacesLambdaIntegration,
      methodAuthOptions
    );
    spacesResources.addMethod(
      "DELETE",
      props.spacesLambdaIntegration,
      methodAuthOptions
    );

    new cdk.CfnOutput(this, "spaces-apigateway", {
      value: api.restApiName,
    });
  }
}
