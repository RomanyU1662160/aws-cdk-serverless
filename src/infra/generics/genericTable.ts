import {
  Stack,
  StackProps,
  aws_dynamodb as Dynamodb,
  RemovalPolicy,
} from "aws-cdk-lib";

/*
class is not used in this project, but it is a good example of how to create a generic table
*/

type TableProps = StackProps & {
  name: string;
  partitionKey: {
    name: string;
    type: Dynamodb.AttributeType.STRING;
  };
};

export class GenericTable extends Dynamodb.Table {
  constructor(scope: Stack, id: string, props: TableProps) {
    super(scope, id, props);
    this.createTable(scope, props);
  }

  private createTable = (stack: Stack, props: TableProps) => {
    new Dynamodb.Table(stack, props.name, {
      tableName: props.name,
      partitionKey: props.partitionKey,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  };
}
