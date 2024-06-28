import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Card.css'

import { MdVerifiedUser } from "react-icons/md";
import { GoUnverified } from "react-icons/go";

export default function Card(props) {
    const navigate = useNavigate()
    const [hovered, setHovered] = useState(-1);

    return (
        <div className="row cards-container d-flex mt-5">
            {props.products.map((product, index) => (
                <div onClick={() => navigate("/product_details/" + product.product_id)} style={{ cursor: "pointer" }} className="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12 mb-4 d-flex dash-prod-card" key={index}>
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

                        <div className="d-flex border-top">
                            <p className="d-inline mx-auto">{product.seller.seller_company}</p>
                            {
                                product.seller.is_seller_verified ?
                                    <p className="d-inline mx-auto">
                                        <MdVerifiedUser size={20} color="#4dff00" />
                                    </p>
                                    :
                                    <p className="d-inline mx-auto">
                                        <GoUnverified size={20} color="#ff1100" />
                                    </p>
                            }
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}