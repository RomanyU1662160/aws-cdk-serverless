# AWS CDK Serverless Project

This project includes serverless infrastructure provisioned using AWS CDK, including authentication, API Gateway, Lambda functions, DynamoDB, and Git repository management.

## New Feature: Python Udemy Repository

### Overview

A new `RepositoryStack` has been added that creates a public-private AWS CodeCommit repository named "python-udemy" with the description "learn python with AI".

### Features

- **Repository Name**: `python-udemy`
- **Description**: `learn python with AI`
- **Public-Private Access**: Configured with IAM roles for different access levels:
  - **PublicReadRole**: Allows public read access to the repository
  - **PrivateWriteRole**: Allows private write access to the repository

### Outputs

When deployed, the stack provides the following outputs:

- `RepositoryCloneUrlHttp`: HTTP clone URL for the repository
- `RepositoryCloneUrlSsh`: SSH clone URL for the repository  
- `RepositoryArn`: ARN of the repository
- `PublicReadRoleArn`: ARN of the role for public read access
- `PrivateWriteRoleArn`: ARN of the role for private write access

### Deployment

The repository stack is automatically included when deploying the CDK application:

```bash
cdk deploy RepositoryStack
```

Or deploy all stacks:

```bash
cdk deploy --all
```

### Usage

After deployment, you can:

1. Clone the repository using the provided URLs
2. Use the IAM roles to control access:
   - Assign users to the PublicReadRole for read-only access
   - Assign users to the PrivateWriteRole for full repository access

### File Structure

```
src/infra/stacks/RepositoryStack.ts - Repository infrastructure definition
src/infra/Launcher.ts - Updated to include RepositoryStack
```