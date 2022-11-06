import SignUpForm from "../components/Auth/signUpForm";
import { redirect, useActionData, useNavigation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
const SignUpPage = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const actionData = useActionData();
  if (actionData && actionData.isError) {
    setTimeout(() => {
      authCtx.authErrorsHandler(actionData.message.error.errors[0].message);
    }, 0);
  }

  return <SignUpForm isLoading={navigation.state === "submitting"} />;
};
export default SignUpPage;
export async function action({ request }) {
  const inputData = await request.formData();
  const res = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAZThACu5VNBs-7nmH9cnQQKAVvYSYaDms",
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
    const message = await res.json();
    return { isError: true, message };
  }
  return redirect("/login");
}
