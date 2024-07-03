import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../lib/state/actions";
import toast, { Toaster } from 'react-hot-toast';

const Product = ({ id, name, price, category, image }) => {
  const dispatch = useDispatch();

  const addToCartAction = () => {
    toast.success('Product added to the cart');
    dispatch(addToCart({ id, name, price, image }));
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    height: '400px',
  };

  const imgWrapStyle = {
    overflow: 'hidden',
    display: 'block',
    width: '100%',
    height: '200px'
  };

  const imgStyle = {
    width: '100%',
    transition: 'transform 0.3s',
    display: 'block',
  };

  const infoWrapStyle = {
    padding: '15px',
    textAlign: 'left',
  };

  const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'block',
    width: '100%',
    marginTop: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  return (
    <div className="col-sm-4 col-6 product-card">
      <Toaster />
      <div style={cardStyle} className="card">
        <a href="#" style={imgWrapStyle} className="img-wrap">
          <img src={`data:image/png;base64,${image}`} alt={name} style={imgStyle} />
        </a>
        <figcaption style={infoWrapStyle} className="info-wrap">
          <a href="#" className="text-muted">{category}</a>
          <a href="#" className="title" style={{ fontWeight: 'bold', color: '#333' }}>{name}</a>
          <div style={{ color: '#007BFF', fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>TND{price}</div>
          <button style={buttonStyle} onClick={addToCartAction}>
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </figcaption>
      </div>
    </div>
  );
};

export default Product;
