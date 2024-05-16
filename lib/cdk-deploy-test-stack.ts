import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_apigateway as apigateway } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as fs from "fs";

export class CdkDeployTestStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const openapiText = fs.readFileSync("openapi.json", "utf-8");
        const openapiConfig = JSON.parse(openapiText);


        // create lambda
        const l = new NodejsFunction(this, `lambda`,
            {
                runtime: Runtime.NODEJS_20_X,
                entry: "src/lambda.ts",
                timeout: cdk.Duration.seconds(10),
            },
        );

        // tell apigateway with openapi what lambda to call
        openapiConfig.paths["/endpoint"].get["x-amazon-apigateway-integration"].uri =
            `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${l.functionArn}/invocations`


        // create authorizer
        const auth = new NodejsFunction(this, `authorizer`,
            {
                runtime: Runtime.NODEJS_20_X,
                entry: "src/authenticate.ts",
                timeout: cdk.Duration.seconds(10),
            },
        );

        openapiConfig.components.securitySchemes
                .BasicAuth["x-amazon-apigateway-authorizer"].authorizerUri =
            `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${auth.functionArn}/invocations`


        const restAPI = new apigateway.SpecRestApi( this, `api`, {
            apiDefinition: apigateway.AssetApiDefinition.fromInline(openapiConfig)
        });

        l.addPermission("PermitAPIGInvocation", {
            principal: new cdk.aws_iam.ServicePrincipal(
                "apigateway.amazonaws.com",
            ),
            sourceArn: restAPI.arnForExecuteApi("*"),
        });

        new cdk.CfnOutput(this, "endpoint", {
            value: `${restAPI.url}/endpoint`,
        });
    }
}
