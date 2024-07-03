import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormValidation } from "../../lib/hooks/useFormValidation";
import { setDelivery } from "../../lib/state/actions";
import { selectCartTotal } from "../../lib/state/selectors";
import * as Input from "../Auth/Input";
import Payment from "./Payment";
import DeliveryBox from "./DeliveryBox";
import emailjs from "emailjs-com";
import { useHistory } from "react-router-dom";

const defaultValues = {
  delivery: "standard",
  address: "",
};

const options = ["Canada", "Russia", "United States", "India", "Afganistan"];

const Checkout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useSelector((state) => state.user);
  const { delivery } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const { first, last, email, city, country, gender } = user ?? {};
  const { formValues, validate, register, handleOnChange, isValid } =
    useFormValidation({ formName: "checkout" });

  useEffect(() => {
    if (!formValues["checkout"]) {
      register(defaultValues);
    }

    // Redirect if first name is null or empty
    if (!first) {
      history.push("/register");
    }
  }, [first, history, register, formValues]);

  useEffect(() => {
    validate(formValues["checkout"] ?? {});
  }, [formValues]);

  const handleOnChangeDelivery = (e, value) => {
    handleOnChange(e, value);
    dispatch(setDelivery(value));
    const shippingCost = value === "standard" ? 0 : 20;
    localStorage.setItem("total", total + shippingCost);
  };

  const handlePaymentClick = () => {
    if (isValid) {
      const templateParams = {
        first_name: formValues.checkout.first || first,
        last_name: formValues.checkout.last || last,
        email: formValues.checkout.email || email,
        city: formValues.checkout.city || city,
        country: formValues.checkout.country || country,
        address: formValues.checkout.address,
        delivery: formValues.checkout.delivery || delivery,
        total: localStorage.getItem('total'),
        to_email: formValues.checkout.email || email,
      };

      emailjs
        .send(
          "service_w7arllu",
          "template_pqandmg",
          templateParams,
          "Pshd2eNlbj_KQ-BdB"
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
          },
          (err) => {
            console.log("FAILED...", err);
          }
        );
    }
  };

  return (
    <>
      <section
        className="section-content padding-y"
        style={{ margin: "100px auto", maxWidth: "720px" }}
      >
        <div className="container">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Delivery info</h4>

              <div className="form-row">
                <div className="form-group col-sm-6">
                  <DeliveryBox
                    title="standard"
                    value={delivery}
                    message="Free by airline within 20 days"
                    onChange={(e) => handleOnChangeDelivery(e, "standard")}
                  />
                </div>
                <div className="form-group col-sm-6">
                  <DeliveryBox
                    title="fast"
                    value={delivery}
                    message="Extra 20TND will be charged"
                    onChange={(e) => handleOnChangeDelivery(e, "fast")}
                  />
                </div>
              </div>

              <div className="form-row">
                <Input.Text
                  label="First name"
                  name="first"
                  value={first}
                  onChange={handleOnChange}
                />
                <Input.Text
                  label="Last name"
                  name="last"
                  value={last}
                  onChange={handleOnChange}
                />
              </div>

              <div className="form-row">
                <Input.Email
                  label="Email"
                  value={email}
                  onChange={handleOnChange}
                  col="6"
                />
              </div>
              <div className="form-row">
                <Input.Select
                  name="country"
                  options={options}
                  label="Country"
                  value={country}
                  col="6"
                  onChange={handleOnChange}
                />
                <Input.Text
                  label="City"
                  name="city"
                  value={city}
                  onChange={handleOnChange}
                />
              </div>
              <Input.TextArea
                label="Address"
                name="address"
                onChange={handleOnChange}
              />
             
            </div>
            <button
              className="btn btn-outline-primary btn-lg mt-3 btn-block"
              onClick={handlePaymentClick}
              isValid={!isValid}
            >
              Send Mail
            </button>
            <div className="form-row" style={{ padding: "0 25px 30px" }}>
              <Payment isValid={!isValid} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Checkout;
