import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { URL } from "../Auth/Auth";
import { Helmet } from 'react-helmet';

const Blog = () => {
  const categories = ["All Industries", "Corporates" , 
    "Dealers and Distributors",  "Auto and Automobiles", "Lighting,Solar,Power" , 
    "Packging,Printing,Paper",  "Plastic,Pvc,Polymers", "Safety and Security", 
    "Stone ,Tiles,Glass" , "Pipes,Pumps,Motors", "MAchinary and Tools", "E-Vehicles",
    "Steel ,Metals, Minerals" , "Sports and Toys", "Small and Medium Companies",
    "Food,Processing,Hospitality", "Garments ,Hoisery, ReadyMade", "Logist, Cargo and Transposter",
    "Wood ,Furniture ,Doors", "Gas and Petrolium" , "Scrap and Recycling" , "Exports and Imports Info" ,
    "Machinary,Tools and Automation" , "ELectrical and Electronics", "Chemical, Pharma","Gem ,Diamonds,Jewellery",
    "Herbal , Ayurvedic, Cosmetic, Perfume", "Buisness 2 Buisness"
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Industries");
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [urlTitle, setUrlTitle] = useState('');
  const [updatedUrlTitle, setUpdatedUrlTitle] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (urlTitle) {
      setUpdatedUrlTitle(urlTitle.replace(/ /g, '_'));
    }
  }, [urlTitle]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(URL + "/api/v1/blogs", {
          method: "GET",
        });
        const data = await response.json();
        setBlog(data.Allblogs);
        if (data.Allblogs.length > 0) {
          setUrlTitle(data.Allblogs[0].title);
        }
      } catch (err) {
        console.log(err);
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    getBlogs();
  }, []);
  

  const filteredBlogs = selectedCategory === "All Industries"
    ? blog
    : blog.filter((blog) => blog.category === selectedCategory);

  return (
    <div className="container mt-5">

        <Helmet>
        <title>{blog.metaTitle}</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="keywords" content={blog.metaKeywords} />
      </Helmet>
      <h1 className="text-center mb-4">Blogs</h1>
      <div className="row">
        <div className="col-12" style={{ backgroundColor: "#050a30" }}>
          <ul className="nav nav-tabs justify-content-center">
            {categories.map((category, index) => (
              <li className="nav-item" key={index}>
                <button
                  className={`nav-link ${selectedCategory === category ? "active bg-warning" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <p className="text-light">{category}</p>
                </button>
              </li>
            ))}
          </ul>
          <div className="dropdown d-md-none">
            <button
              className="dropdown-toggle nav-link text-light"
              type="button"
              onClick={toggleDropdown}
            >
              Categories
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              {categories.map((category, index) => (
                <button
                  className={`dropdown-item ${selectedCategory === category ? "active bg-warning" : ""}`}
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category);
                    setDropdownOpen(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        {filteredBlogs.map((blog, index) => (
          <div className="col-md-4 col-sm-6 mb-4" key={index}>
            <Link to={`/blog/${updatedUrlTitle}/${blog._id}`} style={{
              color: "black",
              textDecoration: "none"
            }}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={blog.images[0]?.url}
                  className="card-img-top"
                  alt="Card image cap"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title.slice(0, 30)}</h5>
                  <p className="card-text" style={{ color: 'black' }}>
                    {blog.content.slice(0, 30)}
                  </p>
                  <a href="#" className="btn btn-primary">
                    Read More
                  </a>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
