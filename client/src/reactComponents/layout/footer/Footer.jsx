import "./footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© 2025 Meal Planner</p>
        <a href="https://spoonacular.com/food-api">API: Spoonacular</a>
      </div>

      <div className="footer-right social-icons">
        <a className="facebook" href="https://sv-se.facebook.com/viktor.rickardsson.91" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" alt="Facebook" />

        </a>
        <a className="linkedin" href="https://se.linkedin.com/in/viktor-rickardsson-08a323256" target="_blank" rel="noopener noreferrer">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" alt="Linkedin" />

        </a>
      </div>
    </footer>
  )
}

export default Footer