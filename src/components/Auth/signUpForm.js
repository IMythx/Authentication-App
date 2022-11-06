import classes from "./AuthForm.module.css";
import { Link, Form } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";
const SignUpForm = (props) => {
  const authCtx = useContext(AuthContext);
  const onClickHandler = () => {
    authCtx.clearErrors();
  };
  return (
    <section className={classes.auth}>
      <h1>Sign Up</h1>
      <Form method="POST" action="/signup">
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required name="email" />
          {authCtx.emailError && (
            <p className={classes.error}>{authCtx.emailError}</p>
          )}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required name="password" />
          {authCtx.passError && (
            <p className={classes.error}>{authCtx.passError}</p>
          )}
        </div>
        <div className={classes.actions}>
          {!props.isLoading && (
            <button onClick={onClickHandler}>Create Account</button>
          )}
          {props.isLoading && <p>Signing Up...</p>}
          <Link
            className={classes.toggle}
            to={"/login"}
            onClick={onClickHandler}
          >
            Login with existing account
          </Link>
        </div>
      </Form>
    </section>
  );
};
export default SignUpForm;
