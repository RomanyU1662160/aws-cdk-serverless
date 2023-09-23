import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpace } from "./Post";
import { getSpaces } from "./Get";
import { putSpace } from "./Put";
import { deleteSpace } from "./Delete";

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let message: string;
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpace(event, ddbClient);
        return postResponse;
      case "PUT":
        const putResponse = await putSpace(event, ddbClient);
        console.log("putResponse :::>>>", putResponse);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        console.log("deleteResponse :::>>>", deleteResponse);
        return deleteResponse;
      default:
        return {
          statusCode: 401,
          body: "Forbidden HTTP Request",
        };
    }
  } catch (error: any) {
    return {
      statusCode: error.statusCode ?? 500,
      body: JSON.stringify(error, null, 2),
    };
  }
};
