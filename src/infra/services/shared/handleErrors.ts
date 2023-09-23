import { APIGatewayProxyResult } from "aws-lambda";
import { Space } from "../../../types/common";

export class MissingAttributeError extends Error {
  public statusCode: number;
  constructor(attribute: keyof Space) {
    super();
    this.message = `BadRequest: Missing attribute ${attribute}`;
    this.statusCode = 400;
  }
}

export class MissingQueryParameterError extends Error {
  public statusCode: number = 400;
  public serializedError: APIGatewayProxyResult;
  constructor(missedParam: string) {
    super();
    this.message = `BadRequest: Missing query parameter ${missedParam}`;
    this.serializedError = {
      statusCode: this.statusCode,
      body: this.message,
    };
  }
}
export class EntityNotFoundError extends Error {
  public statusCode: number = 404;
  public serializedError: APIGatewayProxyResult;
  constructor(attr: string) {
    super();
    this.message = `Not Found: Entity with id: ${attr} cannot found`;
    this.serializedError = {
      statusCode: this.statusCode,
      body: this.message,
    };
  }
}

export class MissingPayloadError extends Error {
  public statusCode: number = 400;
  public serializedError: APIGatewayProxyResult;
  constructor() {
    super();
    this.message = `BadRequest: no body founded`;
    this.serializedError = {
      statusCode: this.statusCode,
      body: this.message,
    };
  }
}

export class JsonError extends Error {
  public statusCode: number = 400;
}
