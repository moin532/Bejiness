import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchProducts } from "../../ApiCallModules/Apis";
import Loader from "../../Loader/Loader";
import PageLayout from "../PageLayout/PageLayout";
import Card from "../Card/Card";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export default function SearchResult() {
    const query = useQuery().get('q');

    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);



    useEffect(() => {
        setIsLoading(true);
        const fetchProducts = async () => {
            try {
                await SearchProducts(query).then((data) => {
                    setProducts(data.products);
                    setIsLoading(false);
                })

            } catch (error) {
                console.error("Error occurred while fetching user data:", error);
            }
        };

        fetchProducts();

    }, [query])

    return (
        <>
            <PageLayout>
                {
                    !isLoading ?
                        products.length != 0 ?
                            <Card products={products} />
                            :
                            <h1>Sorry, we could not find your product!!</h1>
                        :
                        <Loader />
                }
            </PageLayout>
        </>
    )
}