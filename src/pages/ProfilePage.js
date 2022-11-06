import { useActionData, useNavigation } from "react-router-dom";
import UserProfile from "../components/Profile/UserProfile";
import AuthContext from "../store/auth-context";
import { useContext } from "react";
let idToken;
let passChanged;

const ProfilePage = () => {
  const authCtx = useContext(AuthContext);
  const actionData = useActionData();
  const navigation = useNavigation();
  idToken = authCtx.token;
  if (actionData && !actionData.isError) {
    setTimeout(() => {
      const expirationTime = new Date(
        new Date().getTime() + +actionData.message.expiresIn * 1000
      );
      authCtx.changePasswordHandler(
        {
          idToken: actionData.message.idToken,
          expirationTime: expirationTime.toISOString(),
        },
        true
      );
      passChanged = true;
    }, 0);
  }
  if (actionData && actionData.isError) {
    setTimeout(() => {
      authCtx.changePasswordHandler(actionData.message.error.errors[0].message);
      passChanged = false;
    }, 0);
  }
  return (
    <UserProfile
      passChanged={passChanged}
      changingPass={navigation.state === "submitting"}
    />
  );
};

export default ProfilePage;
export async function action({ request }) {
  const inputData = await request.formData();
  const res = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAZThACu5VNBs-7nmH9cnQQKAVvYSYaDms",
    {
      method: "POST",
      body: JSON.stringify({
        idToken,
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
  return { isError: false, message: await res.json() };
}
