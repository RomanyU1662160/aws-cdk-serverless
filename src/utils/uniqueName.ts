import * as cdk from "aws-cdk-lib";

const generateUniqueStackName = (stack: cdk.Stack): string => {
  const stackId = cdk.Fn.split("/", stack.stackId);
  const splittedId = cdk.Fn.select(2, stackId);
  const shortStackId = cdk.Fn.select(4, cdk.Fn.split("-", splittedId));
  return `${stack.stackName}-${shortStackId}`;
};

export { generateUniqueStackName };
