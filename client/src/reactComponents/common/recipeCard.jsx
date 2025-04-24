import "styles/recipeList.css";

const RecipeCard = ({ recipe }) => {
  return (
    <div>
      <h3>{recipe.title}</h3>

      <img
        src={recipe.image}
        alt={recipe.title}
        style={{ maxWidth: '200px', borderRadius: '4px' }}
      />

      <p>⏱ Ready in: {recipe.readyInMinutes} min</p>
      <p>🍽 Servings: {recipe.servings}</p>
      <p>🌱 Vegan: {recipe.vegan ? 'Yes' : 'No'}</p>
      <p>🌾 Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</p>
      <p>🐄 Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</p>

      {recipe.ingredients && (
        <>
          <h4>🧂 Ingredients:</h4>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.amount} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default RecipeCard
