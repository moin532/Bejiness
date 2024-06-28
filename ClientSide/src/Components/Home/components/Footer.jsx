import React from 'react';
// import ContactUs from '../pages/contact/ContactUs';
import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  return (

    <footer className="bg-dark text-light p-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h4>Follow us on</h4>
            <div className="wrapper">
              
              <Link href="#" className="icon facebook">
                <div className="tooltip">Facebook</div>
                <span><i className="fab fa-facebook-f"></i></span>
              </Link>
              
              {/* <Link href="#" className="icon twitter">
                <div className="tooltip">Twitter</div>
                <span><i className="fab fa-twitter"></i></span>
              </Link> */}
              
              <Link href="#" className="icon instagram">
                <div className="tooltip">Instagram</div>
                <span><i className="fab fa-instagram"></i></span>
              </Link>

              {/* <Link href="#" className="icon github">
                <div className="tooltip">Github</div>
                <span><i className="fab fa-github"></i></span>
              </Link> */}
              
              {/* <Link href="#" className="icon youtube">
                <div className="tooltip">Youtube</div>
                <span><i className="fab fa-youtube"></i></span>
              </Link> */}
            </div>
          </div>

          {/* <div className="col-md-3">
            <h4>Services</h4>
            <p>Example 4</p>
            <p>Example 5</p>
            <p>Example 6</p>
            <p>Example 6</p>
          </div> */}

          <div className="col-md-3">
            <h4>About</h4>
            <p><b>Bejiness</b> is our brainchild, a dynamic platform dedicated to empowering B2B players. Our vision is clear: to empower businesses to trade efficiently, manage effectively, expand ambitiously, and promote strategically. We've engineered Bejiness.com to be your<b> one-stop solution</b> for all things B2B.</p>
          </div>

          <div className="col-md-3">
            <h4>Pages</h4>
            <Link to='/contactus'><p>contact</p></Link>
            <Link to='/aboutus'><p>About</p></Link>
            <p>Blog</p>

          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <p>© 2024<b> Sambhav Bejitech Private Limited and Bejiness </b> . All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
