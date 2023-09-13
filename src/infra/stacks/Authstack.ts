import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
  aws_cognito,
} from "aws-cdk-lib";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
/*
In this file we create an Auth stack that will create a user pool and a user pool client on AWS Cognito
 we will use this user pool to authenticate users on the API gateway.
Then, we create an Authorizer in the Api stack with this pool to authenticate users (look APIStack.ts)
*/
/*
User pools allow creating and managing a directory of users that can sign up and sign in. 
They enable easy integration with social identity providers 
such as Facebook, Google, Amazon, and Apple,
*/
/*
Amazon Cognito is an aws service 
that handles user registration, authentication, account recovery & other operations
*/

// this class creates a user pool and a user pool client on AWS Cognito
// Docs : https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cognito-readme.html
// Example: http://buraktas.com/create-cognito-user-pool-aws-cdk/

/*
Difference between user pools and identity pools
AWS User pools:  is for Authentication (sign in, signup)
AWSUser identity: is for Authorization (grant access to resources), AWS will provide temporary credentials to identify users and authorise them to access resources such s s3 buckets


*/

type Roles = {
  AuthenticatedRole: Role;
  UnAuthenticatedRole: Role;
  AdminRole: Role;
};

export class AuthStack extends Stack {
  public UserPool: UserPool;
  private UserPoolClient: UserPoolClient;
  private IdentityPool: CfnIdentityPool;
  private Roles: Roles;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminGroup();
    this.createIdentityPool();
    this.createRoles();
    this.attachRoles();
  }

  // create a user pool on AWS Cognito for Authorization
  private createUserPool() {
    const pool = new UserPool(this, "SpacesUserPool", {
      userPoolName: "SpacesUserPool",
      selfSignUpEnabled: true, // allow users to sign up
      signInAliases: {
        username: true,
        email: true, // users can login with their email
      },
      signInCaseSensitive: false,
      deviceTracking: {
        challengeRequiredOnNewDevice: false,
        deviceOnlyRememberedOnUserPrompt: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.UserPool = pool;

    new CfnOutput(this, "userPoolId", {
      value: this.UserPool.userPoolId,
    });
  }

  // add a user pool client to the user pool created above
  private createUserPoolClient() {
    const client = this.UserPool.addClient("SpacesUserPoolClient", {
      authFlows: {
        userPassword: true, // this is for users to create passwords
        adminUserPassword: true, // this is for admin to create users
        userSrp: true, // SRP stands for Secure Remote Password protocol
        custom: true, // this is for custom authentication
      },
      authSessionValidity: Duration.minutes(15),
    });

    this.UserPoolClient = client;

    new CfnOutput(this, "SpacesUserPoolClientId", {
      value: this.UserPoolClient.userPoolClientId,
    });
  }

  private createAdminGroup() {
    const adminGroup = new CfnUserPoolGroup(this, "spacesAdmin", {
      userPoolId: this.UserPool.userPoolId,
      groupName: "Admins",
    });
  }

  // identity pool to create temporarily AWS token for Authentication
  /// (When a service needs an aws token to be authenticated to communicate with AWS resource, eg Api gateway upload file to S3 bucket)
  private createIdentityPool() {
    this.IdentityPool = new CfnIdentityPool(this, "SpacesIdentityPool", {
      identityPoolName: "SpacesIdentityPool",
      allowUnauthenticatedIdentities: true,
      allowClassicFlow: true,
      cognitoIdentityProviders: [
        {
          clientId: this.UserPoolClient.userPoolClientId,
          providerName: this.UserPool.userPoolProviderName,
          //serverSideTokenCheck: true, //https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html
        },
      ],
    });
    new CfnOutput(this, "SpacesIdentityPoolId", {
      value: this.IdentityPool.ref,
    });
  }

  // We need  authenticated and unauthenticated roles to be attached to the pool identity.
  private createRoles() {
    const AuthenticatedRole = new Role(
      this,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    const UnAuthenticatedRole = new Role(
      this,
      "CognitoDefaultUnAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    const AdminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.IdentityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.Roles = { AuthenticatedRole, UnAuthenticatedRole, AdminRole };
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "rolesAttachment", {
      identityPoolId: this.IdentityPool.ref,
      roles: {
        authenticated: this.Roles.AuthenticatedRole.roleArn,
        unauthenticated: this.Roles.UnAuthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.UserPool.userPoolProviderName}:${this.UserPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}
