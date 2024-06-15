import Container2 from "./components/Container2";
import Container1 from "./components/Container1";
import Scrollcat from "./components/Scrollcat";
import Recommend from "./components/Recommend";
import Trends from "./components/Trends";
import Explore from "./components/Explore";
import Join from "./components/Join";
import Footer from "./components/Footer";
import Post from "./components/Post";
import Navbar from "./components/Navbar";

import './Home.css'
import { useEffect } from "react";


export default function Home() {

  useEffect(() => {
    alert('🚧 Our website is still a work in progress. Join Bejiness and stay tuned for more! 🚧');

  }, [])

  return (
    <div className="homep-main">
      <Navbar />
      <Container1 />
      <Container2 />
      <Scrollcat />
      {/* <Recommend /> */}
      {/* <Trends /> */}
      <Explore />
      <Join />
      <Footer />
      {/* <Post /> */}
    </div>
  )
}