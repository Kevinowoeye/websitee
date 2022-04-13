import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllProduct,
  deleteProduct,
} from "../../../../redux/actions/productActions";

const AllProducts = () => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.allProducts?.products);
  const token = useSelector((state) => state.userLogin?.userInfo?.access_token);
  const [callback, setCallback] = useState(false);
  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch, callback]);

  const deleteHandler = async (id, public_id) => {
    try {
      if (window.confirm("are you sure?")) {
        const destroyImg = axios.post(
          "/api/destroy",
          { public_id },
          {
            headers: { Authorization: token },
          }
        );
        await destroyImg;
        dispatch(deleteProduct(token, id));
        setCallback(!callback);
        alert("Product Deleted Successfully");
      }
    } catch (error) {
      alert(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };
  return (
    <section className="allProducts container-div">
      <h2>All Products</h2>

      <div className="allProducts__container grid">
        {productsData.map((product) => (
          <div key={product?._id} className="allProducts__container__item">
            <Link to="/">
              <img src={product?.images?.url} alt="" />
            </Link>
            <div className="allProducts__container__item__content">
              <h3>{product.name}</h3>
              <div className="allProducts__container__item-price">
                <h5>${product.price}</h5>
                <p>Stock : {product.Stock}</p>
              </div>
              <p>{product.description.slice(0, 30)}...</p>
              <div className="allProducts__buttons">
                <Link className="button" to={`/dashboard/edit/${product._id}`}>
                  Edit
                </Link>
                <button
                  className="button delete"
                  onClick={() =>
                    deleteHandler(product._id, product.images.public_id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;