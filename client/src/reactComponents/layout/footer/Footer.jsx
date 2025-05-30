import "./footer.css"
import { Link } from "react-router-dom"
import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2025 Meal Planner</p>
        <a href="https://spoonacular.com/food-api">API: Spoonacular</a>
      </div>
      <div>
           <Link to="/Terms">Terms of Service</Link>
      </div>

      <div className="footer-right social-icons">
        <a className="facebook" href="https://sv-se.fac ebook.com/viktor.rickardsson.91" target="_blank" rel="noopener noreferrer">
          <img alt="Facebook" src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"/>
        </a>

        <a className="linkedin" href="https://se.linkedin.com/in/viktor-rickardsson-08a323256" target="_blank" rel="noopener noreferrer">
          <img alt="Linkedin" src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"/>
        </a>

      </div>
    </footer>
  )
}

export default Footer