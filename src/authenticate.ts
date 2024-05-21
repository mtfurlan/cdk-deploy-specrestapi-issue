import {
    APIGatewayRequestAuthorizerEvent,
    APIGatewayAuthorizerResult,
    APIGatewayAuthorizerWithContextResult,
    APIGatewayAuthorizerResultContext,
APIGatewayRequestAuthorizerEventHeaders,
} from "aws-lambda";

export interface AuthorizationContext extends APIGatewayAuthorizerResultContext {
    read: boolean;
    write: boolean;
};


// decode base64
// https://stackoverflow.com/a/61155795/2423187
const decodeb64 = (str: string): string =>
    Buffer.from(str, "base64").toString("binary");

export const basicAuth = (authHeader: string): AuthorizationContext => {
    const matches = authHeader.match(/Basic (.*)$/i);
    if (!matches) {
        throw new Error("Authorization header wasn't Basic or something");
    }

    const userPass = decodeb64(matches[1]!);
    if (userPass == "foo:bar") {
        return {
            read: true,
            write: true,
        };
    } else {
        throw new Error("invalid username/pass");
    }
    throw new Error("shouldn't be here");
};

const getParameterCaseInsensitive = (o: APIGatewayRequestAuthorizerEventHeaders | null, key: string): string | undefined => {
    if(!o) {
        return undefined;
    }
    const asLowercase = key.toLowerCase();
    const k = Object.keys(o).find(k => k.toLowerCase() === asLowercase)
    return k ? o[k] : undefined;
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/trigger/api-gateway-authorizer.d.ts
export const handler = async (
    event: APIGatewayRequestAuthorizerEvent,
): Promise<
    | APIGatewayAuthorizerResult
    | APIGatewayAuthorizerWithContextResult<AuthorizationContext>
> => {
    const ret: APIGatewayAuthorizerResult | APIGatewayAuthorizerWithContextResult<AuthorizationContext>
        = {
        "principalId": "I dunno",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                "Action": "execute-api:Invoke",
                "Effect": "Deny",
                "Resource": event.methodArn
            }
            ]
        }
    }

    try {
        const authHeader = getParameterCaseInsensitive(event.headers, "authorization");
        if (authHeader) {
            const context = basicAuth(authHeader);
            ret.policyDocument.Statement[0].Effect = "Allow";
            ret.context = {
                read: true,
                write: true,
            };
        }
    } catch (e) {
        if (!e || !(e instanceof Error)) {
            throw e;
        }
        console.error(`auth failed: ${e.message}`);
    }
    // TODO: if we return false, can we have a sane error message?
    return ret;
};
