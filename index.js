import { generateRandomString, generateCodeChallenge } from "./utils.js";
import { baseUrl } from "./baseUrl.js";

const requestAuthorizationCode = async (obj) => {
  let { client_id, redirect_uri } = obj;
  if (!client_id) return { error: "Client Id is not present!" };
  if (!redirect_uri) return { error: "Redirect URI is not present!" };
  const authEndpoint = baseUrl + "oauth2/authorize";
  const { codeVerifier, codeChallenge } = generateCodeChallenge();
  const state = generateRandomString();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    redirect_uri: redirect_uri,
    scope: "openid",
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  localStorage.setItem("codeVerifier", codeVerifier);
  window.location.href = `${authEndpoint}?${params.toString()}`;
};

const getAccessToken = async (obj) => {
  let { client_id, type, redirect_uri } = obj;
  const codeVerifier = localStorage.getItem("codeVerifier");
  if (!codeVerifier) {
    console.error("Error: Unable to get Code Verifier!");
    return { error: "Unable to get Code Verifier!" };
  }
  if (!client_id) {
    console.error("Error: Client ID is not present!");
    return { error: "Client ID is not present!" };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const headers = new Headers();
  headers.append("Content-Type", `application/x-www-form-urlencoded`);
  const formData = new URLSearchParams();
  formData.append("client_id", client_id);
  formData.append("code", code);
  formData.append("redirect_uri", redirect_uri);
  formData.append("grant_type", "authorization_code");
  formData.append("code_verifier", codeVerifier);
  try {
    const response = await fetch(baseUrl + "oauth2/token", {
      method: "POST",
      body: formData.toString(),
      headers: headers,
    });

    if (response.ok) {
      let data = await response.json();
      if (type === "USER_DATA") {
        let resp = await getUserDetails(data?.access_token);
        return resp;
      } else {
        return data;
      }
    } else {
      console.error("Error: Unable to get oauth2 token!");
      return { error: "Unable to get oauth2 token!" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unable to get oauth2 token!" };
  }
};

async function getUserDetails(token) {
  try {
    if (token) {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);
      headers.append("Content-Type", `application/x-www-form-urlencoded`);

      const url = baseUrl + "userinfo";

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Error: Unable to get user details!");
        return { error: "Unable to get user details!" };
      }
    } else {
      console.error("Error: Token in not present!");
      return { error: "Token in not present!" };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unable to get user details!" };
  }
}
const zaperon = {
  requestAuthorizationCode,
  getAccessToken,
  getUserDetails,
};
export { requestAuthorizationCode, getAccessToken, getUserDetails };
export default zaperon;
