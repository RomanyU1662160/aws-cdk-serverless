import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EntityNotFoundError } from "../shared/handleErrors";
import { isAdmin } from "../../../utils/checkIsAdmin";

export const deleteSpace = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (!isAdmin(event)) {
    return {
      statusCode: 403,
      body: JSON.stringify("Forbidden:: user is not admin"),
    };
  }

  if (!event.queryStringParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify("BadRequest: no queryStringParameters found"),
    };
  }
  const { id } = event.queryStringParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        { badRequest: " No id found in the query" },
        null,
        2
      ),
    };
  }

  const command = new DeleteItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({ id }),
    ReturnValues: "ALL_OLD",
    ConditionExpression: "attribute_exists(id)", // check if entity with id is exists
  });
  try {
    const deleteRes = await ddbClient.send(command);
    return {
      statusCode: 204,
      body: `item with id: ${id} deleted. ${deleteRes.Attributes}`,
    };
  } catch (error) {
    console.log("error :::>>>", error);
    throw new EntityNotFoundError(id);
  }
};
