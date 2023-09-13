import { APIGatewayProxyEvent } from "aws-lambda";

export const isAdmin = (event: APIGatewayProxyEvent): Boolean => {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  console.log("groups :::>>>", groups);
  if (!groups.includes("Admins")) {
    return false;
  }
  return true;
};
