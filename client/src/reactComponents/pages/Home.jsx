function Home() {
  return (
    <div style={{ marginLeft: '20px'}}>
   <h2>🥘 How to get recipes:</h2>

      <h3 >1. Choose number of meals</h3>
      <p>Enter how many recipe options you'd like.</p>

      <h3>2. Select mealtime</h3>
      <p>Pick one or more: breakfast, lunch, or dinner.</p>

      <h3>3. Set servings (default 1)</h3>
      <p>Enter how many servings per recipe.</p>

      <h3>4. Add dietary restrictions (optional)</h3>
      <p>Select from dairy-free, gluten-free, or vegan.</p>

      <h3>5. Choose a cuisine (optional)</h3>
      <p>Click the field to search or scroll for cuisines.</p>

      <h3>6. Set cooking time (optional)</h3>
      <p>Select a max cooking time: under 15, 30, 60, or 60+ minutes.</p>

      <h3>7. Search by ingredients (optional)</h3>
      <p>Enter ingredients to find recipes with that ingredient.</p>

      <h3>8. Click "Get recipes"</h3>
      <p>You must be logged in — otherwise you'll see an error.</p>
    </div>
  )
}

export default Home