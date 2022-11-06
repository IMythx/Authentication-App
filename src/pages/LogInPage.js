import { useContext } from "react";
import { useActionData, useNavigate, useNavigation } from "react-router-dom";
import LogInForm from "../components/Auth/logInForm";
import AuthContext from "../store/auth-context";
const LogInPage = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const actionData = useActionData();
  if (actionData && !actionData.isError && actionData.idToken) {
    setTimeout(() => {
      authCtx.login(
        actionData.idToken,
        actionData.expirationTime.toISOString()
      );
      navigate("/profile");
    }, 0);
  }
  if (actionData && actionData.isError) {
    setTimeout(() => {
      authCtx.authErrorsHandler(actionData.message.error.errors[0].message);
    }, 0);
  }
  return <LogInForm isLoading={navigation.state === "submitting"} />;
};
export default LogInPage;
export async function action({ request }) {
  const inputData = await request.formData();
  const res = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAZThACu5VNBs-7nmH9cnQQKAVvYSYaDms",
    {
      method: "POST",
      body: JSON.stringify({
        email: inputData.get("email"),
        password: inputData.get("password"),
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    return { isError: true, message: await res.json() };
  }
  const data = await res.json();
  const expirationTime = new Date(
    new Date().getTime() + +data.expiresIn * 1000
  );
  return { isError: false, expirationTime, idToken: data.idToken };
}
