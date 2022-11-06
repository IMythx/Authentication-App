import { Form, Link } from "react-router-dom";
import classes from "./AuthForm.module.css";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";

const LogInForm = (props) => {
  const authCtx = useContext(AuthContext);
  const onClickHandler = () => {
    authCtx.clearErrors();
  };
  return (
    <section className={classes.auth}>
      <h1>Log in</h1>
      <Form method="POST" action="/login" data-testid="loginform">
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
          {!props.isLoading && <button>Log in</button>}
          {props.isLoading && <p>Logging in...</p>}
          <Link
            className={classes.toggle}
            to={"/signup"}
            onClick={onClickHandler}
          >
            Create New Account
          </Link>
        </div>
      </Form>
    </section>
  );
};
export default LogInForm;
