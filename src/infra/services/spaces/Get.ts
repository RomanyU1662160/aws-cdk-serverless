import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
/*
getSpaces function will return a space if id is present in the queryStringParameters
else it will return all the spaces
*/

export const getSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  // if id is present, return the item with that id using getItem command
  if (event.queryStringParameters) {
    const { id } = event.queryStringParameters;

    // if id is not present in the queryStringParameters, we return 400
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify("BadRequest: no id found", null, 2),
      };
    }

    const command = new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      // key to query item
      Key: marshall({
        id,
      }),
    });

    const result = await ddbClient.send(command);
    if (result.Item) {
      const unMarshalledItem = unmarshall(result.Item); // unmarshall the item look at  file ./notes.md
      return {
        statusCode: 200,
        body: JSON.stringify(unMarshalledItem, null, 2),
      };
    }
    return {
      statusCode: 404,
      body: `Cannot find a space with id: ${id}`,
    };
  }

  // if id is not present, return all items using scan command
  const command = new ScanCommand({
    TableName: process.env.TABLE_NAME,
  });

  const result = await ddbClient.send(command);
  if (result.Items) {
    const unMarshalledItems = result.Items.map((item) => unmarshall(item)); // unmarshall the item look at  file ./notes.md

    return {
      statusCode: 200,
      body: JSON.stringify(
        [...unMarshalledItems, { count: result.Count }],
        null,
        2
      ),
    };
  }
  return {
    statusCode: 404,
    body: `Cannot find any space`,
  };
};
