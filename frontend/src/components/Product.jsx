import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import {
  useRemoveFavouriteMutation,
  useUpdateFavouritesMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import {
  addToFavourites,
  removeFromFavourites,
} from "../slices/favouritesSlice";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const favourites = useSelector((state) => state.favourites);

  const [isProductFavourite, setIsProductFavourite] = useState(false);

  useEffect(() => {
    if (
      userInfo?.favouriteItems?.find(
        (productId) => productId === product._id
      ) ||
      favourites.find((productId) => productId === product._id)
    ) {
      setIsProductFavourite(true);
    }
  }, [favourites, userInfo, userInfo?.favouriteItems, product._id]);

  const [updateFavourite, { isLoading: loadingUpdateFavourite }] =
    useUpdateFavouritesMutation();
  const [removeFavourite, { isLoading: loadingRemoveFavourite }] =
    useRemoveFavouriteMutation();

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/cart");
  };

  const addToFavouritesHandler = async (productId) => {
    if (userInfo) {
      const res = await updateFavourite({ productId });
      dispatch(setCredentials({ ...res.data }));
    }
    if (!userInfo) {
      dispatch(addToFavourites(productId));
    }
    toast.success(`${product.name} added to your favourites`);
    setIsProductFavourite(true);
  };

  const removeFromFavouritesHandler = async (productId) => {
    if (userInfo) {
      const res = await removeFavourite(productId);
      dispatch(setCredentials({ ...res.data }));
    }
    if (!userInfo) {
      dispatch(removeFromFavourites(productId));
    }
    toast.success(`${product.name} removed from your favourites`);
    setIsProductFavourite(false);
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
      {isProductFavourite ? (
        <FaHeart
          className="position-absolute top-0 end-0 mt-2 me-2 text-danger cursor-pointer"
          style={{ cursor: "pointer" }}
          onClick={() => removeFromFavouritesHandler(product._id)}
        />
      ) : (
        <FaRegHeart
          className="position-absolute top-0 end-0 mt-2 me-2 text-black cursor-pointer"
          style={{ cursor: "pointer" }}
          onClick={() => addToFavouritesHandler(product._id)}
        />
      )}
    </Card>
  );
};

export default Product;
