import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { SearchProducts } from "../../../ApiCallModules/Apis";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function HomeSearch() {

    const [products, setProducts] = useState([]);
    const query = useQuery().get('q');
    const [hovered, setHovered] = useState(-1);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await SearchProducts(query).then((data) => {
                    setProducts(data.products);
                })

            } catch (error) {
                console.error("Error occurred while fetching user data:", error);
            }
        };

        fetchProducts();

    }, [query])

    return (
        <>
            <Navbar />
            {
                products.length != 0 ?
                    products.map((product, index) => (
                        <div onClick={() => navigate("/signup")} style={{ cursor: "pointer" }} className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-4 d-flex dash-prod-card" key={index}>
                            <div
                                className={`card ${hovered === index ? 'shadow-lg' : 'shadow'} flex-grow-1`}
                                onMouseEnter={() => setHovered(index)}
                                onMouseLeave={() => setHovered(-1)}
                            >
                                <img
                                    className="card-img-top"
                                    height={100}
                                    width={100}
                                    src={product.images}
                                    alt={product.product_name}
                                />
                                <div className={`card-body d-flex flex-column`}>
                                    <h5 className="card-title">{product.product_name}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text">
                                        <b>{product.prices[product.prices.length - 1].price}rs</b></p>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <h1>Sorry, we could not find your product!! <br/>Let us know your Requirements...</h1>
            }
        </>
    )
}