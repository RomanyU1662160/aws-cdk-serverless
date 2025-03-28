import { Context } from "aws-lambda";
import { handler } from "../src/infra/services/spaces/handler";

let result: any;
/*
This file  is to test the AWS resources locally by using the debug option in VS code.
*/

/* 
uncomment when test with npx ts-node in the terminal
*/
// process.env.TABLE_NAME = "spaces";
// process.env.AWS_REGION = "eu-west-2";

// get  space by id
const runGetById = async () => {
  result = await handler(
    {
      httpMethod: "GET",
      queryStringParameters: {
        id: "5afc4d20-5516-4f7d-ba71-d0247cd1a92b",
      },
    } as any,
    {} as any
  );
};


// post a space item
const runPost = async () => {
  result = await handler(
    {
      httpMethod: "POST",
      body: JSON.stringify({
        location: "test location2",
      }),
    } as any,
    {} as Context
  );
  console.log("Result::>>", result);
};
//update a space item
const runUpdate = async () => {
  result = await handler(
    {
      httpMethod: "PUT",
      queryStringParameters: {
        id: "b963a7a5-4f83-4b1a-a83a-f78ef8365b18",
      },
      body: JSON.stringify({
        location: "test location2",
      }),
    } as any,
    {} as Context
  );
};

// delete a space item
const runDelete = async () => {
  result = await handler(
    {
      httpMethod: "DELETE",
      queryStringParameters: {
        id: "4e6b34fb-2da6-4931-a29e-e4b4d360413b",
      },
    } as any,
    {} as Context
  );
};

//runPost();
// runUpdate();
runDelete();
// runGetById();
