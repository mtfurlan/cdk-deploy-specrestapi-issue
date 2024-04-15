# cdk deploy openapi lambda issue demonstrator

If the openapi spec refernces the [Work Zone Data Exchange json specification](https://github.com/usdot-jpo-ode/wzdx),
sometime between 2024-04-05 14:03:40 UTC-0400 and 2024-04-11 maybe 12:00 UTC-4
it stopped working and instead just throws errors about the spec

```
11.19.02 | CREATE_FAILED        | AWS::ApiGateway::RestApi    | api
Resource handler returned message: "Errors found during import:
        Unable to create model for 'WorkZoneFeed': Invalid model specified: Validation Result: warnings : [], errors : [Model reference must be in canonical form]
Additionally, these warnings were found:
        Reference to model 'WorkZoneFeed' not found. Ignoring.
        Reference to model 'WorkZoneFeed' not found. Ignoring.
        Invalid format for model application/json for method GET (Service: ApiGateway, Status Code: 400, Request ID: 18516a20-eac4-45ae-8534-da2db409ab84)" (RequestToken: ae9b29d0-ac37342-31822f0cb243, HandlerErrorCode: InvalidRequest)
```

You can demostrate those errors by deploying this, and they go away if you
change the WorkZoneFeed type to string or something.
