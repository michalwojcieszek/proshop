import { Row, Col, Button, Carousel } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams, Link } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  return (
    <>
      {!keyword ? (
        <>
          {" "}
          <Row>
            <Col md={6} sm={12} className="d-flex align-items-center">
              <div>
                <h1 className="hero-text text-uppercase display-2">
                  Electronic devices store{" "}
                  <span className="hero-span">made for you.</span>
                </h1>
              </div>
            </Col>
            <Col md={6} sm={12} className="d-flex align-items-center">
              <img
                src="/images/your-electronics.webp"
                alt="your electronics store"
                className="hero-img"
              />
            </Col>
          </Row>
          <h2>Latest Products</h2>
        </>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
            {!keyword && <ProductCarousel />}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
