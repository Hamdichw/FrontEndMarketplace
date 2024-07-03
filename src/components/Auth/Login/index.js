import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Input from "../Input";
import { useFormValidation } from "../../../lib/hooks/useFormValidation";
import useAuthentication from "../../../lib/hooks/useAuthentication";
import GoogleSignInButton from "../Google SSO/GoogleSignInButton ";
import { jwtDecode } from "jwt-decode";
const Alert = ({ isVisible }) =>
  isVisible && (
    <div className="alert alert-info mt-3">
      <p className="icontext">
        <i className="icon text-primary fa fa-thumbs-up"></i>User successfully
        connected
      </p>
    </div>
  );
const ErrorMessage = ({ error }) => {
  return (
    error && (
      <div className="alert alert-danger mt-3">
        <p className="icontext]" style={{ color: "crimson" }}>
          <i className="icon text-danger fas fa-exclamation-circle"></i>{" "}
          {error?.error || "Please login"}
        </p>
      </div>
    )
  );
};

const defaultValues = {
  email: "zied0011@gmail.com",
  password: "",
};
const Login = ({ history }) => {
  const dispatch = useDispatch();
  const { handleUserLogin } = useAuthentication(dispatch);
  const { handleUserRegistration } = useAuthentication(dispatch);
  const { user, error } = useSelector((state) => state.user);
  const { formValues, validate, register, handleOnChange, isValid } =
    useFormValidation({ formName: "login", defaultValues: defaultValues });
  const { email, password } = formValues["login"] ?? {};
  useEffect(() => {
    register(defaultValues);
  }, []);
  useEffect(() => {
    validate(formValues["login"] ?? {});
  }, [formValues]);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleUserLogin(email, password).then((currentUser) => {
      localStorage.setItem('email',email)
      currentUser && setTimeout(() => history.push("/"), 2000);
    });
  };
  const handleGoogleLoginSuccess = (token) => {
    console.log("Google auth successful, token:", token);
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;
    localStorage.setItem('email',email)

    let username = email.split('@')[0];
    const newUser = {
      email: email, 
      last:username,
      first:username,
      password: "googleuser", // Not needed for Google login
    };
    handleUserLogin(newUser.email, newUser.password).then((currentUser) => {
      currentUser && setTimeout(() => history.push("/"), 2000);
    });
     handleUserRegistration(newUser).then((currentUser) => {
      currentUser && setTimeout(() => history.push("/"), 2000);
    }); 
    
  };

  const handleGoogleLoginFailure = (error) => {
    console.log("Google auth failed:", error);
  };

  return (
    <>
      <div
        className="card mx-auto"
        style={{ maxWidth: "380px", marginTop: "200px" }}
      >
        <div className="card-body">
          <h4 className="card-title mb-4">Sign in</h4>
          {/* feedback et message d'erreurs */}
          <ErrorMessage error={error} />
          <Alert isVisible={!!user} />
          <form name="login" onSubmit={handleOnSubmit}>
            {/* 
          <a href="#" className="btn btn-facebook btn-block mb-2"> <i className="fab fa-facebook-f"></i> &nbsp  Sign in with Facebook</a>
          <a href="#" className="btn btn-google btn-block mb-4"> <i className="fab fa-google"></i> &nbsp  Sign in with Google</a> 
          */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <Input.Email
                label="Email"
                style={{ padding: 0 }}
                onChange={handleOnChange}
                value={email}
              />
            </div>
            <div className="form-group">
              <Input.Password
                label="Password"
                name="password"
                style={{ padding: 0 }}
                onChange={handleOnChange}
                value={password}
              />
            </div>
            <div className="form-group" style={{ display: "flex", justifyContent: "space-between" }}>
              <Input.Checkbox col="6">Remember</Input.Checkbox>
              <Link col="6" to={"/loginAsAdmin"}>login As Admin</Link>
            </div>
            <div className="form-group">
              <Input.Submit
                classNames="btn-primary btn-block"
                title="Login"
                disabled={!isValid}
              />
            </div>
          </form>
          <div
            className="form-group"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <GoogleSignInButton
              onLoginSuccess={handleGoogleLoginSuccess}
              onLoginFailure={handleGoogleLoginFailure}
            />
          </div>
        </div>
      </div>
      <p className="text-center mt-4">
        Don't have account? <Link to="/register">Sign Up</Link>
      </p>
      <br />
      <br />
    </>
  );
};
export default Login;
