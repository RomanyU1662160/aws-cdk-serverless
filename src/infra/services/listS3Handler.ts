import {
  Handler,
  Context,
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const S3_Client = new S3Client({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const command = new ListBucketsCommand({});
  try {
    const listBucketsResult = (await S3_Client.send(command)).Buckets;

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: `list of buckets ${JSON.stringify(listBucketsResult)}, null , 2`,
    };

    return response;
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error, null, 2) };
  }
};
