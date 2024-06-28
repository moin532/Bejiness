import React, { useState } from 'react';
import "./Container1.css";
import { useNavigate } from 'react-router-dom';

export default function Container1() {

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container-one">
      <div className="s-main">
        <div className="s-title">B2B Redefined : Bejiness.com 🚀</div>
        <div className="m-title">Connect, Trade, Expand</div>

        <form onSubmit={handleSearch}>
          <div className="s-search">
            <div className="search-container">
              <div className='search-icon'>
                <lord-icon
                  src="https://cdn.lordicon.com/anqzffqz.json"
                  trigger="loop"
                  delay="2000"
                  state="in-reveal"
                  style={{ width: '30px', height: '30px' }}>
                </lord-icon>
              </div>
              <input
                type="text"
                placeholder="Search on Bejiness.com"
                className="search-input"
                defaultValue={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-button" type='submit'>
                <img
                  alt="Search"
                  src="https://production-uploads-cdn.anar.biz/mweb-static-assets/dist/images/search-white.webp"
                />
                <div className="search-button-text">Search</div>
              </button>
            </div>
          </div>
        </form>
        {/* <div className="s-search-suggetion">
          <div className="responsive-container">
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>



            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
            <button className="custom-button" >
              <img src="https://production-uploads-cdn.anar.biz/uploads/image/image/6690959/logo_saree.png" alt="Icon" className="icon" />
              <span className="button-text">Click Me</span>
            </button>
          </div>

        </div> */}
      </div>
      {/* <div className="img-div">
        <img src="/home/home-img1.png" alt="" />
      </div> */}
    </div>
  )
}
