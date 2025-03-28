import { CognitoUser } from "@aws-amplify/auth";
import { AuthService } from "./AuthService";

const testSignIn = async () => {
  try {
    const res = await AuthService.signInUser({
      username: "romany",
      password: "Rafie208*",
    });
    console.log("res :::>>>", res);
    if (res instanceof CognitoUser) {
      const token = res.getSignInUserSession()?.getIdToken().getJwtToken();
      console.log("token :::>>>", token);
    }
    return res;
  } catch (error) {
    console.log("error ::::>>>", error);
    throw error;
  }
};

const testSignUp = async () => {
  try {
    const res = await AuthService.signUpUser({
      username: "romany",
      email: "romanyfayiez@gmail.com",
      password: "rooma123",
    });
    console.log("res :::>>>", res);
  } catch (error) {
    console.log("error :::>>>", error);
    throw error;
  }
};

const testRetrieveCurrentUser = async () => {
  try {
    const currentUser = await AuthService.retrieveCurrentAuthenticatedUser();
    console.log("currentUser :::>>>", currentUser);
  } catch (error) {
    console.log("error :::>>>", error);
    throw error;
  }
};

const testGenerateTemporaryIdentityCredentials = async () => {
  const user = await testSignIn();
  const temporaryToken = AuthService.generateTemporaryIdentityCredentials(
    user as CognitoUser
  );
  console.log("temporaryToken :::>>>", temporaryToken);
  return temporaryToken;
};

//testSignIn();
//testSignUp();
//testRetrieveCurrentUser();
testGenerateTemporaryIdentityCredentials();
