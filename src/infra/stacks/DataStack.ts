import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GenericTable } from "../generics/genericTable";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class DataStack extends Stack {
  public table: Table;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = this.initTable();
    this.table = dynamoTable;
  }

  initTable = () => {
    const table = new cdk.aws_dynamodb.Table(this, "spacesTable", {
      tableName: "spaces",
      partitionKey: {
        name: "id",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    return table;
  };
}
