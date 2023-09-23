import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// this solution will use the DynamoDBDocumentClient to solve the problem of converting the JavaScript object to a DynamoDB Document object

export const postSpaceWithDocClient = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return { statusCode: 500, body: "no body found" };
  }

  const item = JSON.parse(event.body);
  item.id = v4();

  // use solution2
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  const command = new PutItemCommand({
    TableName: process.env.TABLE_NAME, // from the env variable defined in the lambda stack
    Item: item,
  });

  // send the command to the DynamoDB client using docClient instead of ddbClient
  try {
    await docClient.send(command); // use docClient instead of ddbClient
    return {
      statusCode: 200,
      body: JSON.stringify({ id: item.id }, null, 2),
    };
  } catch (error) {
    console.log("error :::>>>", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error, null, 2),
    };
  }
};
