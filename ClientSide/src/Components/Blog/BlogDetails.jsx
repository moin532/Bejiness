import React, { useEffect,useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { URL } from '../Auth/Auth';


const BlogDetail = () => {

  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState('');
  const {id }= useParams();
   

    
      
      useEffect(() => {
        const getBlog = async () => {
          setIsLoading(true)
          await fetch(URL + '/api/v1/blog/' + id, {
            method: 'GET',
          })
            .then((res) => res.json())
            .then((data) => {
              
              setBlog(data.SingleBlog);
              setIsLoading(false)
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false)
              alert(err.message)
              console.log(err.message);
              return <p>{err.message}</p>;
            });
        };
        getBlog();

  
      }, []);
            
  
  
  return (


    
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10">
        <div className="blog-header text-center mb-4">
          <h1 className="blog-title">{blog.title}</h1>
          <h4 className="blog-subtitle ">{blog.category}</h4>
        </div>
   
<div className="d-flex flex-wrap justify-content-center">

{
  blog &&  blog.images?.map((image, index) => (
    // console.log(image)
      <img  src={image.url} key={index} className="img-fluid mb-4" alt={`${blog.title} ${index + 1}`}  style={{ height: '300px', objectFit: 'cover' }} />
      
   ))}
      </div>

      <div className="blog-points mb-4">
            {blog && blog.points?.map((item, index) => (
              <div key={index} className="mb-3">
                <h5 className="point-title">{item.point}</h5>
                {/* {point.subpoints && point.subpoints.length > 0 && ( */}
                  <ul className="subpoints-list">
                    {item.subpoints.map((subpoint, subIndex) => (
                      <li key={subIndex} className="subpoint-item">{subpoint}</li>
                    ))}
                  </ul>
                {/* )} */}
              </div>
            ))}
          </div>
        
        <div className="">
        <h3 className='blog-content  '>{blog.content}</h3>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default BlogDetail;
