import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Space } from "../../../types/common";
import {
  parseJsonBodyValidator,
  validateSpaceSchema,
} from "../shared/DataValidator/spacesSchemaValidator";
import { generateRandomId } from "../../../utils/randomId";
import { MissingPayloadError } from "../shared/handleErrors";

export const postSpace = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return new MissingPayloadError().serializedError;
  }

  const item: Space = parseJsonBodyValidator(event.body);

  item.id = generateRandomId();

  validateSpaceSchema(item);

  const marshalledItem = marshall(item);
  // We need to define the command to put an item in the table
  const command = new PutItemCommand({
    TableName: process.env.TABLE_NAME, // from the env variable defined in the lambda stack
    Item: marshalledItem, // use marshall to convert the JavaScript object to a DynamoDB Document object
  });

  // send the command to the DynamoDB client

  const result = await ddbClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(marshalledItem), null, 2), //use unmarshall to convert the dynamoDb Document object to a regular JavaScript object
  };
};
