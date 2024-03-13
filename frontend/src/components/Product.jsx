import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import {
  addToFavourites,
  removeFromFavourites,
} from "../slices/favouritesSlice";
import {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
} from "../slices/favouriteApiSlice";
import { toast } from "react-toastify";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const favourites = useSelector((state) => state.favourites);

  const [isProductFavourite, setIsProductFavourite] = useState(false);

  const [createFavourite, { isLoading: loadingCreateFavourite }] =
    useCreateFavouriteMutation();
  const [deleteFavourite, { isLoading: loadingDeleteFavourite }] =
    useDeleteFavouriteMutation();

  useEffect(() => {
    if (favourites.find((x) => x._id === product._id)) {
      setIsProductFavourite(true);
    } else {
      setIsProductFavourite(false);
    }
  }, [favourites, setIsProductFavourite, product._id]);

  const addToFavouritesHandler = async (product) => {
    if (userInfo) {
      await createFavourite(product);
    }
    dispatch(
      addToFavourites({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
      })
    );
    toast.success(`${product.name} added to your favourites ❤️`);
  };

  const removeFromFavouritesHandler = async (productId) => {
    if (userInfo) {
      await deleteFavourite(productId);
    }
    dispatch(removeFromFavourites(productId));
    toast.success(`${product.name} removed from your favourites 💔`);
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/cart");
  };

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
      {loadingCreateFavourite || loadingDeleteFavourite ? (
        <Spinner className="position-absolute top-0 end-0 mt-2 me-2" />
      ) : isProductFavourite ? (
        <FaHeart
          className="position-absolute top-0 end-0 mt-2 me-2 text-danger cursor-pointer heart-icon"
          style={{ cursor: "pointer" }}
          onClick={() => removeFromFavouritesHandler(product._id)}
        />
      ) : (
        <FaRegHeart
          className="position-absolute top-0 end-0 mt-2 me-2 text-black cursor-pointer heart-icon"
          style={{ cursor: "pointer" }}
          onClick={() => addToFavouritesHandler(product)}
        />
      )}
    </Card>
  );
};

export default Product;
