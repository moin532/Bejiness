import { useNavigate } from 'react-router-dom'
import './Post.css'

export default function Post() {
    const navigate = useNavigate();

    return (

        <>
            <div className="post-main-div">
                <div id="postbtn">
                    <button className="postdiv" onClick={() => navigate("/post_requirements")}>Post Your Requirement<lord-icon
                        src="https://cdn.lordicon.com/ujxzdfjx.json"
                        trigger="loop"
                        delay="1500"
                        stroke="bold"
                        colors="primary:#000,secondary:#fff"
                        style={{ width: '25px', height: '25px' }}>
                    </lord-icon></button>
                </div>
            </div>
        </>
    )
}