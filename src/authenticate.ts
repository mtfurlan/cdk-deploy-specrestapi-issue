import {
    APIGatewayRequestAuthorizerEvent,
    APIGatewaySimpleAuthorizerResult,
    APIGatewaySimpleAuthorizerWithContextResult,
} from "aws-lambda";

export interface AuthorizationContext {
    read: boolean;
    write: boolean;
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/aws-lambda/trigger/api-gateway-authorizer.d.ts
export const handler = async (
    event: APIGatewayRequestAuthorizerEvent,
): Promise<
    | APIGatewaySimpleAuthorizerResult
    | APIGatewaySimpleAuthorizerWithContextResult<AuthorizationContext>
> => {
    try {
        const authHeader = event.headers?.["Authorization"];
        if (authHeader) {
            const matches = authHeader.match(/Basic (.*)$/);
            if (!matches) {
                throw new Error("Authorization header wasn't Basic or something");
            }

            // TODO: rewrite using buffer for less try/catch nonsense: https://stackoverflow.com/a/61155795/2423187
            try {
                const userPass = atob(matches[1]!);
                if (userPass == "foo:bar") {
                    return {
                        isAuthorized: true,
                        context: {
                            read: true,
                            write: true,
                        },
                    };
                } else {
                    throw new Error("invalid username/pass");
                }
            } catch (e) {
                throw new Error("Couldn't decoee basic auth base64");
            }
            throw new Error("shouldn't be here");
        }
    } catch (e) {
        if (!e || !(e instanceof Error)) {
            throw e;
        }
        console.error(`auth failed: ${e.message}`);
    }
    // TODO: if we return false, can we have a sane error message?
    return {
        isAuthorized: false,
    };
};
