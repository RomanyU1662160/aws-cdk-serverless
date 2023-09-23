import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseJsonBodyValidator } from "../shared/DataValidator/spacesSchemaValidator";
import {
  EntityNotFoundError,
  MissingQueryParameterError,
} from "../shared/handleErrors";

export const putSpace = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify("BadRequest: no body found", null, 2),
    };
  }

  if (!event.queryStringParameters || !event.queryStringParameters.id) {
    return new MissingQueryParameterError("id").serializedError;
  }

  const { id } = event.queryStringParameters;
  const payload = parseJsonBodyValidator(event.body);

  const requestBodyKey = Object.keys(payload)[0]; // location
  const requestBodyValue = Object.values(payload)[0] as string; //location value

  const command = new UpdateItemCommand({
    TableName: process.env.TABLE_NAME, // table to use
    Key: {
      // key to query the item
      id: { S: id }, //can use marshall({id, })
    },

    ExpressionAttributeNames: {
      "#L": requestBodyKey, // set any expression for location #L: location
    },
    ConditionExpression: "attribute_exists(id)", // check if entity with this id is exists
    ExpressionAttributeValues: {
      // set new values
      ":newLocation": {
        // attribute to update in the DB
        S: requestBodyValue, // new value of the  attribute
      },
    },
    UpdateExpression: "SET #L = :newLocation", // map expression #L to the new value

    ReturnValues: "ALL_NEW",
  });
  try {
    const updatedItem = await docClient.send(command);

    console.log("updatedItem :::>>>", updatedItem.Attributes);

    const res = {
      statusCode: 204,
      body: JSON.stringify(updatedItem.Attributes, null, 2),
    };
    console.log("res :::>>>", res);
    return res;
  } catch (error) {
    console.log("error :::>>>", error);
    throw new EntityNotFoundError(id);
  }
};
