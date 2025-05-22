import "./footer.css"
import { AiFillFacebook, AiFillLinkedin } from "react-icons/ai"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2025 Meal Planner</p>
        <a href="https://spoonacular.com/food-api">API: Spoonacular</a>
      </div>

      <div className="footer-right social-icons">
        <a className="facebook" href="https://sv-se.facebook.com/viktor.rickardsson.91" target="_blank" rel="noopener noreferrer">
          <AiFillFacebook />

        </a>
        <a className="linkedin" href="https://se.linkedin.com/in/viktor-rickardsson-08a323256" target="_blank" rel="noopener noreferrer">
          <AiFillLinkedin />
        </a>
      </div>
    </footer>
  )
}

export default Footer