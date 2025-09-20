import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import * as iam from "aws-cdk-lib/aws-iam";

export class RepositoryStack extends Stack {
  public repository: codecommit.Repository;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createRepository();
    this.setupRepositoryAccess();
  }

  private createRepository() {
    this.repository = new codecommit.Repository(this, "PythonUdemyRepository", {
      repositoryName: "python-udemy",
      description: "learn python with AI",
    });

    // Output the repository clone URL for easy access
    new CfnOutput(this, "RepositoryCloneUrlHttp", {
      value: this.repository.repositoryCloneUrlHttp,
      description: "HTTP clone URL for the python-udemy repository",
    });

    new CfnOutput(this, "RepositoryCloneUrlSsh", {
      value: this.repository.repositoryCloneUrlSsh, 
      description: "SSH clone URL for the python-udemy repository",
    });

    new CfnOutput(this, "RepositoryArn", {
      value: this.repository.repositoryArn,
      description: "ARN of the python-udemy repository",
    });
  }

  private setupRepositoryAccess() {
    // Create a role that allows public read access but private write access
    const publicReadRole = new iam.Role(this, "PublicReadRole", {
      assumedBy: new iam.AnyPrincipal(),
      description: "Role that allows public read access to python-udemy repository",
    });

    // Grant read permissions to the public role
    this.repository.grantPull(publicReadRole);

    // Create a role for private write access
    const privateWriteRole = new iam.Role(this, "PrivateWriteRole", {
      assumedBy: new iam.AccountRootPrincipal(),
      description: "Role that allows private write access to python-udemy repository",
    });

    // Grant full access to the private role
    this.repository.grant(privateWriteRole, "codecommit:*");

    new CfnOutput(this, "PublicReadRoleArn", {
      value: publicReadRole.roleArn,
      description: "ARN of the role for public read access",
    });

    new CfnOutput(this, "PrivateWriteRoleArn", {
      value: privateWriteRole.roleArn,
      description: "ARN of the role for private write access",
    });
  }
}