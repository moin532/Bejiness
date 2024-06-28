import React from 'react';
// import PageLayout from "../../Account/PageLayout/PageLayout";
import Navbar from "../components/Navbar";

export default function PostRequirement() {
    return (
        <>
            {/* <Navbar /> */}
            
            <div className="container d-flex justify-content-center align-items-center" >
                <div className="card" style={{ maxWidth: '800px', width: '100%' }}>
                    
                    <div className="card-body">
                    <h1 style={{ 
                            fontSize: '2em', 
                            background: '-webkit-linear-gradient(45deg, #ff6ec4, #7873f5)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent' 
                        }}>Post Your Requirement</h1>
                        <form>
                            <div>
                                <img src="home/bejiness-logo.png" alt="" style={{ height: '60px' }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label" style={{ fontSize: '1.2em' }}>Your Name</label>
                                <input type="text" className="form-control" id="name" placeholder="Enter your name" style={{ fontSize: '1.2em' }} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productCategory" className="form-label" style={{ fontSize: '1.2em' }}>Product Category</label>
                                <select className="form-control" id="productCategory" style={{ fontSize: '1.2em' }}>
                                    <option value="">Select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="furniture">Furniture</option>
                                    <option value="beauty">Beauty Products</option>
                                    <option value="books">Books</option>
                                    <option value="sports">Sports Equipment</option>
                                </select>
                            </div>
                            <div className="form-row d-flex">
                                <div className="form-group col-md-6" style={{ marginRight: '10px' }}>
                                    <label htmlFor="productName" className="form-label" style={{ fontSize: '1.2em' }}>Requirement Product Name</label>
                                    <input type="text" className="form-control" id="productName" placeholder="Enter the product name" style={{ fontSize: '1.2em' }} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="productQuantity" className="form-label" style={{ fontSize: '1.2em' }}>Product Quantity</label>
                                    <input type="number" className="form-control" id="productQuantity" placeholder="Enter the product quantity" style={{ fontSize: '1.2em' }} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Notes" className="form-label" style={{ fontSize: '1.2em' }}>Requirement Product Notes</label>
                                <textarea className="form-control" id="Notes" rows="2" placeholder="Your Notes" style={{ fontSize: '1.2em' }}></textarea>
                            </div>
                            <div className="form-row d-flex">
                                <div className="form-group col-md-6" style={{ marginRight: '10px' }}>
                                    <label htmlFor="mobileNumber" className="form-label" style={{ fontSize: '1.2em' }}>Your Mobile Number</label>
                                    <input type="tel" className="form-control" id="mobileNumber" placeholder="Enter your mobile number" style={{ fontSize: '1.2em' }} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="email" className="form-label" style={{ fontSize: '1.2em' }}>Your Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter your email" style={{ fontSize: '1.2em' }} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3" style={{ fontSize: '1.2em' }}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
