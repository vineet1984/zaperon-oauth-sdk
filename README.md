# Zaperon OAuth2 SDK

This library implements Zaperon OAuth Authorization Code grant ([RFC 6749 § 4.1](https://tools.ietf.org/html/rfc6749#section-4.1)) with PKCE ([RFC 7636](https://tools.ietf.org/html/rfc7636))

# Login With Zaperon
Firstly, we need to install the zaperon package from npm using the below command:

    npm install zaperon-oauth-sdk
To import the package, we can use the below code: 

    import zaperon from "zaperon-oauth-sdk";

To Login using Zaperon, we need to add the below function to our **Login** button:

   
    zaperon.requestAuthorizationCode({
	    client_id: your_client_id,
	    redirect_uri: your_redirect_uri
    })

## Get Token & User Details
After successful redirecting to your redirect uri, the following function need to be called to get the value of access_token, id_token, token_type, expires_in and scope.

       await zaperon.getAccessToken({
        client_id: clientId
       });

**There are two ways to get user details:**

 - To get User Details directly, you can get send "type" key with value "USER_DATA" in the getAccessToken function.

Example:  -

        await zaperon.getAccessToken({
        client_id: clientId,
        type: "USER_DATA"
        });

 - To get User Details, you can also use getUserDetails function which require access token in its argument:

Example
 

    await  zaperon.getUserDetails(access_token);
## Storage
**zaperon-oauth-sdk** holds some state like code verifier in local storage. It needs to be persisted in a way that survives reloads because of the redirects during authentication

```
