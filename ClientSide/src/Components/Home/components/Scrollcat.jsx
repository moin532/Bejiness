import React, { useRef, useEffect } from "react";
import Tag from "./Tag"; // Importing the Component
import data from "./category.json";
import "./Scrollcat.css";

const Scrollcat = () => {
  const scrl = useRef();

  useEffect(() => {
    const scrollList = () => {
      if (scrl.current) {
        // Check if the scroll position is near the end of the first set
        if (scrl.current.scrollLeft >= scrl.current.scrollWidth / 2) {
          // Reset to the middle position
          scrl.current.scrollLeft = scrl.current.scrollLeft - scrl.current.scrollWidth / 2;
        } else {
          // Scroll to the right
          scrl.current.scrollLeft += 1; // Adjust this value to control scroll speed
        }
      }
    };

    // Initial scroll position
    scrl.current.scrollLeft = scrl.current.scrollWidth / 2;

    // Run the scroll function at a set interval
    const scrollInterval = setInterval(scrollList, 10); // Adjust this value to control scroll frequency

    // Clean up the interval on component unmount
    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <>
      <div className="s-head">
        <p>All Categories</p>
      </div>
      <div className="s-App">
        <ul className="s-ul" ref={scrl}>
          {[...data.fruits, ...data.fruits].map((d, i) => (
            <li key={i} className="s-li">
              <Tag data={d} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Scrollcat;
