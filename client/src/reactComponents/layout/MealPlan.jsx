import 'styles/mealPlan.css'
const MealPlan = () => {
  const days = ['Dag 1', 'Dag 2', 'Dag 3', 'Dag 4', 'Dag 5']
  const meals = ['Frukost', 'Lunch', 'Middag']

  return (
    <div className="meal-plan-container">
      <div className="grid">
        <div className="header empty"></div>
        {meals.map((meal, i) => (
          <div key={i} className="header">{meal}</div>
        ))}

        {days.map((day, i) => (
          <>
            <div key={day} className="day">{day}</div>
            {meals.map((_, j) => (
              <div key={`${i}-${j}`} className="meal-slot">
                <button style={{color:'black'}}>Namn + bild</button>
              </div>
            ))}
          </>
        ))}
      </div>

      <div className="shopping-list">
        Här är inköpslistan
      </div>
    </div>
  )
}

export default MealPlan
