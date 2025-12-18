import { generateRandomString, generateCodeChallenge } from "./utils.js";
import { baseUrl } from "./baseUrl.js";
import { jwtVerify } from "jose";


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

const validateJwt= async (jwtToken) => {
  try {
    const resp = await fetch(baseUrl + "oauth2/jwks", {
      method: "GET",
    });
    if(resp.status === 200){
      const data = await resp.json()
      const jwk = data.keys[0]
      const { payload } = await jwtVerify(jwtToken, jwk, {
        clockTolerance: 10
      })
      return { valid: true, payload };
    }
  } catch (error) {
    console.error('Validation Failed with Error: ', error)
    return {valid: false, message: error?.message || 'something went wrong during validation.'}
  }
}
const getAccessToken = async (obj) => {
  // Client-only helper that expects to find the auth code in window.location.search
  let { client_id, redirect_uri } = obj;
  const codeVerifier = typeof window !== 'undefined' ? localStorage.getItem("codeVerifier") : null;
  if (!codeVerifier) {
    console.error("Error: Unable to get Code Verifier!");
    return { error: "Unable to get Code Verifier!", status_code: 404 };
  }
  if (!client_id) {
    console.error("Error: Client ID is not present!");
    return { error: "Client ID is not present!", status_code: 404 };
  }
  if (!redirect_uri) {
    console.error("Error: Redirect URI is not present!");
    return { error: "Redirect URI is not present!", status_code: 404 };
  }
  if (typeof window === 'undefined') {
    return { error: "getAccessToken requires a browser environment (uses window.location)", status_code: 400 };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  if (!code) {
    console.error("Error: Unable to get Auth Code!");
    return { error: "Authorization Code not found", status_code: 404 };
  }
  return await getAccessTokenFromCode({ client_id, redirect_uri, code, code_verifier: codeVerifier });
};

// Server-friendly token exchange: accepts explicit code and code_verifier
const getAccessTokenFromCode = async (obj) => {
  let { client_id, redirect_uri, code, code_verifier } = obj;
  if (!client_id) return { error: "Client Id is not present!" };
  if (!redirect_uri) return { error: "Redirect URI is not present!" };
  if (!code) return { error: "Authorization code is not present!" };
  if (!code_verifier) return { error: "Code verifier is not present!" };

  const headers = new Headers();
  headers.append("Content-Type", `application/x-www-form-urlencoded`);
  const formData = new URLSearchParams();
  formData.append("client_id", client_id);
  formData.append("code", code);
  formData.append("redirect_uri", redirect_uri);
  formData.append("grant_type", "authorization_code");
  formData.append("code_verifier", code_verifier);

  try {
    const response = await fetch(baseUrl + "oauth2/token", {
      method: "POST",
      body: formData.toString(),
      headers: headers,
    });

    if (response.ok) {
      const data = await response.json()
      return {...data, status_code: 200};
    } else {
      let data = await response.json();
      console.error("Error: Unable to get oauth2 token! ", data);
      return { error: data?.error, status_code: response.status };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unable to get oauth2 token!" };
  }
};

const getUserDetails = async (obj) => {
  let { client_id, redirect_uri } = obj;
  const codeVerifier = localStorage.getItem("codeVerifier");
  if (!codeVerifier) {
    console.error("Error: Unable to get Code Verifier!");
    return { error: "Unable to get Code Verifier", status_code: 404 };
  }
  if (!client_id) {
    console.error("Error: Client ID is not present!");
    return { error: "Client ID is not present", status_code: 404 };
  }
  if (!redirect_uri) {
    console.error("Error: Redirect URI is not present!");
    return { error: "Redirect URI is not present", status_code: 404 };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  if (!code) {
    console.error("Error: Unable to get Auth Code!");
    return { error: "Authorization Code not found", status_code: 404 };
  }
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
      let resp = await getUserDetailsUsingToken(data?.access_token);
      return resp;
    } else {
      let data = await response.json();
      console.error("Error: Unable to get oauth2 token! ", data);
      return { error: data?.error, status_code: response.status };
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unable to get oauth2 token!" };
  }
};

async function getUserDetailsUsingToken(token) {
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
        const data = await response.json()
        return {...data, status_code: 200};
      } else {
        let data = await response.json();
        console.error("Error: ", data);
        return data;
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
  getUserDetailsUsingToken,
  validateJwt
};
export { requestAuthorizationCode, validateJwt, getAccessToken, getUserDetails, getUserDetailsUsingToken };
export default zaperon;

export async function registerZaperonButton() {
  if (typeof window === "undefined") return; // no-op during SSR
  try {
    const mod = await import("./zaperon-button.js");
    const ZaperonButton = mod.ZaperonButton;
    // attach the auth function wrapper
    ZaperonButton.requestAuthorizationCode = async (obj) => {
      try {
        const res = await requestAuthorizationCode(obj);
        return res;
      } catch (err) {
        console.error("zaperon: requestAuthorizationCode error", err);
        throw err;
      }
    };

    if (!customElements.get("zaperon-btn")) {
      customElements.define("zaperon-btn", ZaperonButton);
    }
  } catch (e) {
    // dynamic import may fail in some environments; surface a console warning
    try { console.warn("zaperon: failed to register button", e); } catch (_) {}
  }
}

// Auto-register in browser environments when the package is imported (non-blocking)
if (typeof window !== "undefined") {
  // fire-and-forget
  registerZaperonButton().catch(() => {});
}

// Expose a debug-friendly global in browser for quick testing
if (typeof window !== "undefined") {
  try {
    window.zaperon = window.zaperon || zaperon;
  } catch (_) {}
}
