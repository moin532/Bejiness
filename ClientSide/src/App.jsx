import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Components/Home/Home'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import SellerDashboard from './Components/Account/Dashboard/Dashboard'
import Profile from './Components/Account/Profile/Seller/SellerProfile'
import SellerProducts from './Components/Account/Profile/Seller/SellerProducts/SellerProducts'
import ScrollToTop from './Components/ExtraComponents/ScrolltoTop'
import AddProduct from './Components/Account/Profile/Seller/SellerProducts/AddProduct/AddProduct'
import ProductDetails from './Components/Account/Profile/CommonComponents/ProductDetails/ProductDetails'
import EditProduct from './Components/Account/Profile/Seller/SellerProducts/EditProduct/EditProduct'
import ViewCart from './Components/Account/Cart/ViewCart/ViewCart'
import BuyerProfile from './Components/Account/Profile/Buyer/BuyerProfile'
import OrderDetails from './Components/Account/Profile/CommonComponents/OrderDetails/OrderDetails'
import OrderPayment from './Components/Account/Cart/OrderPayment/OrderPayment'

import { useAuth } from './Components/Auth/AuthContext'
import ContactUs from './Components/Home/pages/contact/ContactUs'
import AboutUs from './Components/Home/pages/about/AboutUs'
import Notification from './Components/Account/Profile/Seller/Notification/Notification'
import NotificationDetails from './Components/Account/Profile/Seller/Notification/NotificationDetails/NotificationDetails'
import Blog from './Components/Blog/Blog'
import BlogDetail from './Components/Blog/BlogDetails'
import PostRequirement from './Components/Home/PostRequirements/postrequirement'
import HomeSearch from './Components/Home/components/HomeSearch/HomeSearch'
import SearchResult from './Components/Account/SearchResult/SearchResult'

function App() {
  const { hasToken } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post_requirements" element={<PostRequirement />} />
        
        {/* searching routes */}
        <Route path="/search" element={<HomeSearch />} />
        <Route path="/dashboard/search" element={<SearchResult />} />
        

        {/* {
          (hasToken) ? ( */}
        <>
          <Route path="/dashboard" element={<SellerDashboard />} />
          <Route path="/seller_profile" element={<Profile />} />
          <Route path="/products" element={<SellerProducts />} />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/product_details/:productId" element={<ProductDetails />} />
          <Route path="/edit_product/:productId" element={<EditProduct />} />
          <Route path="/buyer_profile" element={<BuyerProfile />} />
          <Route path="/order_details/:orderId" element={<OrderDetails />} />
          <Route path="/view_cart" element={<ViewCart />} />
          <Route path="/payment" element={<OrderPayment />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/notificationdetails/:id" element={<NotificationDetails />} />

          {/* Blogs */}
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:title/:id" element={<BlogDetail />} />


        </>
        {/* ) : ( */}


        <Route path="/*" element={<Navigate to="/" />} />
        {/* )
        } */}


      </Routes>
    </>
  )
}

export default App
