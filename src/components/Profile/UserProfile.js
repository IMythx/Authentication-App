import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";

const UserProfile = (props) => {
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm
        passChanged={props.passChanged}
        changingPass={props.changingPass}
      />
    </section>
  );
};

export default UserProfile;
