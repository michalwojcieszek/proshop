import React from "react";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useDeleteFavouriteMutation } from "../slices/favouriteApiSlice";
import { removeFromFavourites } from "../slices/favouritesSlice";

const FavouriteScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const favourites = useSelector((state) => state.favourites);

  const [deleteFavourite, { isLoading: loadingDeleteFavourite }] =
    useDeleteFavouriteMutation();

  const removeFromFavouritesHandler = async (id) => {
    if (userInfo) {
      await deleteFavourite(id);
    }
    dispatch(removeFromFavourites(id));
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Favourite products</h1>
        {favourites.length === 0 ? (
          <Message>
            You have no favourite products <Link to="/">Go back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {favourites.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>

                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromFavouritesHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
    </Row>
  );
};

export default FavouriteScreen;
