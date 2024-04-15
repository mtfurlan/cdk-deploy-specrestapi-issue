# cdk deploy openapi lambda issue demonstrator

If the openapi spec refernces an external $ref to a URL, sometime between
2024-04-05 14:03:40 UTC-0400 and 2024-04-11 maybe 12:00 UTC-4 it stopped working
and instead just throws errors about the spec

```
12.37.01 | UPDATE_FAILED        | AWS::ApiGateway::RestApi    | apiC8550315
Resource handler returned message: "Errors found during import:
        Unable to create model for 'SomeType': Invalid model specified: Validation Result: warnings : [], errors : [Model reference must be in canonical form]
Additionally, these warnings were found:                                                                                                                                                 Reference to model 'SomeType' not found. Ignoring.
        Reference to model 'SomeType' not found. Ignoring.
        Invalid format for model application/json for method GET (Service: ApiGateway, Status Code: 400, Request ID: ddcf7a31-4c12-46ee-a61b-93b3cd615301)" (RequestToken: bf86d1
1b-79597bd-9974a42a79d5, HandlerErrorCode: InvalidRequest)
```

You can demostrate those errors by deploying this, and they go away if you
change the SomeType type to string or something.

