import './Dashboard.css';
import PageLayout from "../PageLayout/PageLayout";
import { useEffect, useState } from 'react';
import { GetCategory } from '../../ApiCallModules/Apis';
import DashCategory from './components/Dash_category';
import Loader from '../../Loader/Loader';
import Card from '../Card/Card';

function SellerDashboard() {
  const [categoryTitle, setCategoryTitle] = useState('All');
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        await GetCategory(categoryTitle.toLowerCase()).then((data) => {
          setProducts(data.products);
          setIsLoading(false);
        })

      } catch (error) {
        console.error("Error occurred while fetching user data:", error);
      }
    };
    fetchProduct();

  }, [categoryTitle]);

  const highlightButton = (btn) => {
    setCategoryTitle(btn);
  };

  return (
    <>
      <PageLayout />
      <DashCategory highlightButton={highlightButton} />

      {isLoading ?
        <Loader />
        :
        <Card products={products} />
      }
    </>
  );
}

export default SellerDashboard;