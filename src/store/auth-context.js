import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  passError: "",
  emailError: "",
  authErrorsHandler: (message) => {},
  passChanging: {},
  changePasswordHandler: (message, cganged = true) => {},
  clearErrors: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if (remainingTime <= 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const [passError, setPassError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passChanging, setPassChanging] = useState({
    isError: false,
    message: "",
  });

  const userIsLoggedIn = !!token;

  const authErrorsHandler = (message) => {
    if (message.includes("PASSWORD")) {
      setPassError(message.replaceAll("_", " "));
      setEmailError("");
    } else if (message.includes("EMAIL")) {
      setEmailError(message.replaceAll("_", " "));
      setPassError("");
    }
  };
  const clearErrors = () => {
    setEmailError("");
    setPassError("");
    setPassChanging({
      isError: false,
      message: "",
    });
  };
  const changePasswordHandler = (message, changed = false) => {
    if (changed) {
      setToken(message.idToken);
      localStorage.setItem("token", message.idToken);
      localStorage.setItem("expirationTime", message.expirationTime);
      setPassChanging({
        isError: false,
        message: "Changed Successfully",
      });
    } else {
      setPassChanging({
        isError: true,
        message: message.replaceAll("_", " "),
      });
    }
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    setPassChanging({
      isError: false,
      message: "Changed Successfully",
    });

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
    clearErrors();
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    passError,
    emailError,
    authErrorsHandler,
    passChanging,
    changePasswordHandler,
    clearErrors,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
