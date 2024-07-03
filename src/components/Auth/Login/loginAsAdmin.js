import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import * as Input from "../Input";
import { useFormValidation } from "../../../lib/hooks/useFormValidation";

const defaultValues = {
  email: "",
  password: "",
};

const LoginAsAdmin = ({ history }) => {
  const { formValues, validate, register, handleOnChange, isValid } =
    useFormValidation({ formName: "loginAsAdmin", defaultValues: defaultValues });
  const { email, password } = formValues["loginAsAdmin"] ?? {};

  useEffect(() => {
    register(defaultValues);
  }, []);

  useEffect(() => {
    validate(formValues["loginAsAdmin"] ?? {});
  }, [formValues]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@admin.com" && password === "admin") {
      history.push("/LayoutAdmin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <>
      <div
        className="card mx-auto"
        style={{ maxWidth: "380px", marginTop: "200px" }}
      >
        <div className="card-body">
          <h4 className="card-title mb-4">Admin Sign in</h4>
          <form name="loginAsAdmin" onSubmit={handleOnSubmit}>
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
            <div className="form-group">
              <Input.Submit
                classNames="btn-primary btn-block"
                title="Login"
                disabled={!isValid}
              />
            </div>
          </form>
        </div>
      </div>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      <br />
      <br />
    </>
  );
};

export default LoginAsAdmin;
