import { useApolloClient } from "@apollo/client";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Amplify, Auth, Hub } from "aws-amplify";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

Amplify.configure({
  Auth: {
    // https://docs.amplify.aws/lib/auth/start/q/platform/js/#re-use-existing-authentication-resource
    region: process.env["REACT_APP_COGNITO_USER_POOL_REGION"],
    userPoolId: process.env["REACT_APP_COGNITO_USER_POOL_ID"],
    userPoolWebClientId: process.env["REACT_APP_COGNITO_USER_POOL_CLIENT_ID"],
    oauth: {
      domain: process.env["REACT_APP_COGNITO_USER_POOL_DOMAIN"],
      scope: ["openid"],
      redirectSignIn: process.env["REACT_APP_BASE_URL"],
      redirectSignOut: process.env["REACT_APP_BASE_URL"],
      responseType: "code",
    },
  },
});

export type AuthContextType = {
  isSignedIn?: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export type AuthProviderProps = {
  children?: ReactNode;
};

export const AuthProvider: FunctionComponent<AuthProviderProps> = (props) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => {
        setIsSignedIn(true);
      })
      .catch((err) => {
        console.error(err);
        setIsSignedIn(false);
      });

    return Hub.listen("auth", ({ payload: { event } }) => {
      switch (event) {
        case "signIn":
          setIsSignedIn(true);
          break;
        case "signOut":
          setIsSignedIn(false);
          navigate("/devices");
          break;
      }
    });
  }, [navigate]);

  const signIn = useCallback(async () => {
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Amazon,
    });
  }, []);

  const client = useApolloClient();
  const signOut = useCallback(async () => {
    await Auth.signOut();
    await client.clearStore();
  }, [client]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          signIn,
          signOut,
          isSignedIn,
        }),
        [isSignedIn, signIn, signOut]
      )}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
