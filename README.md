# Zaperon OAuth SDK

This library implements Zaperon OAuth Authorization Code grant ([RFC 6749 § 4.1](https://tools.ietf.org/html/rfc6749#section-4.1)) with PKCE ([RFC 7636](https://tools.ietf.org/html/rfc7636)) for single page client-side web applications.

# Login With Zaperon

Firstly, you need to install the zaperon package from npm using the below command:

    npm install zaperon-oauth-sdk

To import the package, you can use the below code:

    import zaperon from "zaperon-oauth-sdk";

To Login using Zaperon, you need to add the below function to your **Login** button:

    zaperon.requestAuthorizationCode({
        client_id: your_client_id,
        redirect_uri: your_redirect_uri
    })

## Get Token & User Details

After successful redirecting to your redirect uri, you can either call getAccessToken function or getUserDetails function depending on your requirement.

To get Access Token, you need to call getAccessToken function:

    await zaperon.getAccessToken({
         client_id: your_client_id,
         redirect_uri: your_redirect_uri
    });

Example Response by getAccessToken function on "200" Status Code is:

> {  
> access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",  
> scope: "openid",  
> id_token: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",  
> token_type: "Bearer",  
> expires_in: 3600  
> }

To get User Details, you need to call getUserDetails function:

    await zaperon.getUserDetails({
         client_id: your_client_id,
         redirect_uri: your_redirect_uri
    });

Example Response by getUserDetails function on "200" Status Code is:

> {  
> name: "John Doe",  
> given_name: "John",  
> family_name: "Doe",  
> phone_number: "1234567890",  
> email: "johndoe@example.com",  
> sub: "johndoe@example.com"  
> }

## Error Handling

In any case of failure, you will get the error key in response with error message.

    {
     error: 'error_message',
     status_code: 400
    }

Here is the list of possible error codes and their descriptions:-

| Error                        | Status | Description                                                                                                                                                                                                        |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client ID is not present     | 404    | The `client_id` parameter was not send to the function.                                                                                                                                                            |
| Redirect URI is not present  | 404    | The `redirect_uri` parameter was not send to the function.                                                                                                                                                         |
| Unable to get Code Verifier  | 404    | The code verifier which was used to generate code challenge is not present in browsers local storage.                                                                                                              |
| Authorization Code not found | 404    | No query parameter with the key name `code` is present in Browser's URL.                                                                                                                                           |
| invalid_client               | 400    | The specified `client_id` is invalid.                                                                                                                                                                              |
| invalid_grant                | 400    | The specified grant is invalid, expired, revoked, or does not match the redirect URI used in the authorization request                                                                                             |
| invalid_request              | 400    | The request is missing a necessary parameter, the parameter has an invalid value, or the request contains duplicate parameters.                                                                                    |
| invalid_scope                | 400    | The scopes list contains an invalid or unsupported value.                                                                                                                                                          |
| unsupported_response_mode    | 400    | The specified response mode is invalid or unsupported. This error is also thrown for disallowed response modes. For example, if the query response mode is specified for a response type that includes `id_token`. |
| access_denied                | 302    | The Authorization Server denied the request.                                                                                                                                                                       |
| consent_required             | 302    | The user denied your application access to their Constant Contact data.                                                                                                                                            |
| server_error                 | 302    | The server encountered an internal error.                                                                                                                                                                          |
| temporarily_unavailable      | 302    | The server is temporarily unavailable, but should be able to process the request at a later time.                                                                                                                  |
| invalid_token                | 302    | The provided access token is invalid.                                                                                                                                                                              |
| unsupported_response_type    | 302    | The specified response type is invalid or unsupported.                                                                                                                                                             |

## Storage

**zaperon-oauth-sdk** holds some state like code verifier in local storage. It needs to be persisted in a way that survives reloads because of the redirects during authentication
