import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/cart");
  };

  const addToFavourites = () => {};

  return (
    <Card className="my-3 rounded position-relative">
      <Link to={`/product/${product._id}`}>
        <div className="img-container">
          <Card.Img src={product.image} variant="top" />
        </div>
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
        <Button
          type="submit"
          variant="primary"
          className="d-flex align-items-center justify-content-between mt-2"
          onClick={() => addToCartHandler(product)}
        >
          <FaCartPlus />
          <span className="ms-2">Add to cart</span>
        </Button>
      </Card.Body>
      <FaRegHeart
        className="position-absolute top-0 end-0 mt-2 me-2 text-black"
        onClick={() => addToFavourites(product)}
      />
      {/* <FaHeart className="position-absolute top-0 end-0 mt-2 me-2 text-danger" /> */}
    </Card>
  );
};

export default Product;
