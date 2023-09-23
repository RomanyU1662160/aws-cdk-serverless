# Marshalling

Marshalling in AWS Dynamo DB means converting javaScript object to a Dynamodb document.

when we send the request and receive the response as the example below, to specify the type of the attribute in the object.

example:

```javascript
 Item: {
id: {
S: item.id, // S means types of string
},
location: {
S: item.location, // location will be in the payload body
},
}
```

**
We have two solution to fix that:**

## soultion_1 use @aws-sdk/util-dynamodb

use the marshall and unmarshall function form the library

`*marshall will convert javScript object into DynamoDb document. `

`*unmarshall will convert a DynamoDb document into a javascript object*`
look the spaces get file

```javascript
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
const unMarshalledItem = unmarshall(result.Item);
```

## soultion_2 use @aws-sdk/lib-dynamodb

use the DynamboDocumentDB client
