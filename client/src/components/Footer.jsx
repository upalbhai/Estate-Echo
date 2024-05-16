import {AiFillInstagram,AiFillYoutube,AiFillGithub, AiFillFacebook} from "react-icons/ai"
import '../styles/footer.css'
export default function Footer(){
    return(
        <>
            <footer>
                <div>
                    <h2 id='title'>EstateEcho</h2>
                   <p id="para"> Embark on a seamless<span className='text-slate-700'> journey</span>
          <br />
          to find your next perfect place</p>
                    <strong>All rights received @EstateEcho</strong>
                </div>
                <aside>
                    <h4>Follow Us</h4>
                    <a className="link" href=""><AiFillInstagram/></a>
                    <a className="link" href=""><AiFillYoutube /></a>
                    <a className="link" href=""><AiFillFacebook /></a>
                </aside>
            </footer>
        </>
    )
}