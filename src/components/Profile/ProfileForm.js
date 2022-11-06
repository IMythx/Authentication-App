import { Form } from "react-router-dom";
import classes from "./ProfileForm.module.css";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
const ProfileForm = ({ changingPass }) => {
  const authCtx = useContext(AuthContext);
  return (
    <Form className={classes.form} method="POST" action="/profile">
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" name="password" />
        {authCtx.passChanging.isError && (
          <p className={classes.error}>{authCtx.passChanging.message}</p>
        )}
        {!authCtx.passChanging.isError && authCtx.passChanging.message && (
          <p className={classes.changed}>{authCtx.passChanging.message}</p>
        )}
      </div>
      <div className={classes.action}>
        {!changingPass && <button>Change Password</button>}
        {changingPass && <p>Changing password...</p>}
      </div>
    </Form>
  );
};

export default ProfileForm;
