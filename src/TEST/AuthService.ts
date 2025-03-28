import { Amplify, Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CfnIdentityPool } from "aws-cdk-lib/aws-cognito";

/*
This file will create a service using AWS Amplify. 
we use the Auth from Amplify to sign in a user,
so we can generate an auth token and use it to authenticate the user.
To run this service, use the debug mode in VSCode,
 this will run the service and log the token in the console.
 Then we use it when we call the API.
*/


/*
AWS Amplify is an AWS service to create  full stack applications, 
it has an auth service that use AWS cognito for authentication 
*/

// docs: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-up

type SignInParameters = {
  username: string;
  password: string;
};

type SignUpParameters = {
  username: string;
  email: string;
  password: string;
};

const userPoolId = "eu-west-2_1V26ec4RG";
const userPoolClientId = "12gm5t0f3u4p25tjlldbhobah1";
const identityPoolId = "eu-west-2:32855ff6-23d3-4e85-ab18-31b6fb806d8b";

Amplify.configure({
  Auth: {
    region: process.env.CDK_DEFAULT_REGION,
    userPoolId: userPoolId, // look AuthStack
    userPoolWebClientId: userPoolClientId,
    identityPoolId: identityPoolId,
    mandatorySignIn: true,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public static async signInUser({
    username,
    password,
  }: SignInParameters): Promise<CognitoUser | unknown> {
    try {
      const user = await Auth.signIn(username, password);
      return user;
    } catch (error) {
      console.log("error Signing in  :::>>>", error);
      return error;
    }
  }

  public static async signUpUser({
    username,
    email,
    password,
  }: SignUpParameters): Promise<CognitoUser | unknown> {
    const newUser = {
      username,
      email,
      password,
      attributes: {
        email,
      },
    };
    try {
      const { user } = await Auth.signUp(newUser);
      return user;
    } catch (error) {
      console.log("error :::>>>", error);
      return error;
    }
  }

  public static async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error :::>>>", error);
    }
  }

  public static async retrieveCurrentAuthenticatedUser(): Promise<
    CognitoUser | unknown
  > {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.log("error :::>>>", error);
      return error;
    }
  }

  public static async generateTemporaryIdentityCredentials(
    user: CognitoUser
  ): Promise<unknown> {
    const region = process.env.CDK_DEFAULT_REGION;
    const token = user.getSignInUserSession()?.getIdToken().getJwtToken();
    console.log("JWT token :::>>>", token);
    const cognitoIdentityPool = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: identityPoolId,
        logins: {
          [cognitoIdentityPool]: token ?? "",
        },
      }),
    });
    const creds = await cognitoIdentity.config.credentials();
    console.log("cognitoIdentity creds :::>>>", creds);
    return creds;
  }
}
