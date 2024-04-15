import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const handler = async (
    event: APIGatewayEvent,
    _context: Context,
): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        body: '{"result": "look it\'s not real but whatever"}',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers":
                "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        },
    };
};
