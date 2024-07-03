import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavAdmin from "./navAdmin";
import Footer from "./Footer";
import Products from "../Home/Products";
import { Route, Switch ,Redirect  } from "react-router-dom";
import AllOrders from "../Home/AllOrders";
const LayoutAdmin = ({ children }) => (
  <Router>
    <div style={{ height: "auto", overflow: "auto" }}>
      <div className="fixed-top">
        <NavAdmin />
      </div>
      <Switch>
        {/* Redirect base URL to /AllProducts */}
        <Route exact path="/LayoutAdmin">
                    <Redirect to="/AllProducts" />
                </Route>
        {/* Route for displaying All Products */}
        <Route path="/AllProducts">
          <Products />
        </Route>

        {/* Route for displaying All Clients */}
        <Route path="/AllOrdres">
          <AllOrders />
        </Route>

        {/* You can add more routes as needed */}
      </Switch>
      <div className="fixed-bottom"></div>
    </div>
  </Router>
);
export default LayoutAdmin;
