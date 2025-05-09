import { useState } from 'react';
import 'styles/mealPlanner.css'
import '../../css/mealPlanner.css'



export default function MealPlannerApp() {
  const [currentWeek, setCurrentWeek] = useState({
    start: new Date(2025, 4, 6), // May 6, 2025
    end: new Date(2025, 4, 12), // May 12, 2025
  });
  
  // Sample meal data
  const [meals] = useState([
    { id: 1, name: "Overnight Oats", day: "Monday", mealType: "breakfast", tags: ["gluten-free"] },
    { id: 2, name: "Tangy & Savory Mexican Soup", day: "Monday", mealType: "lunch", tags: ["gluten-free"] },
    { id: 3, name: "Baked Ratatouille", day: "Monday", mealType: "dinner", tags: ["gluten-free"] },
    { id: 4, name: "2 Minute Chocolate Yum", day: "Tuesday", mealType: "breakfast", tags: [] },
    { id: 5, name: "Easy Chicken with White Wine Sauce", day: "Tuesday", mealType: "dinner", tags: ["gluten-free", "dairy-free"] },
    { id: 6, name: "Spicy Chicken Corn Dogs", day: "Wednesday", mealType: "lunch", tags: ["gluten-free", "dairy-free"] },
    { id: 7, name: "Tangy & Savory Mexican Soup", day: "Saturday", mealType: "dinner", tags: ["gluten-free"] },
  ]);
  

  
  // Navigate to previous or next week
  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeek.start);
    const newEnd = new Date(currentWeek.end);
    
    if (direction === 'next') {
      newStart.setDate(newStart.getDate() + 7);
      newEnd.setDate(newEnd.getDate() + 7);
    } else {
      newStart.setDate(newStart.getDate() - 7);
      newEnd.setDate(newEnd.getDate() - 7);
    }
    
    setCurrentWeek({ start: newStart, end: newEnd });
  };
  
  // Format week display
  const formatWeekDisplay = () => {
    const startDay = currentWeek.start.getDate();
    const endDay = currentWeek.end.getDate();
    const month = currentWeek.start.toLocaleString('sv-SE', { month: 'long' });
    return `${startDay}-${endDay} ${month}, ${currentWeek.start.getFullYear()}`;
  };
  
  // Get days for current week
  const getDaysInWeek = () => {
    const days = [];
    const currentDate = new Date(currentWeek.start);
    
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      days.push({
        date: date,
        day: date.getDate(),
        weekday: weekdays[i],
        meals: meals.filter(meal => meal.day === weekdays[i])
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  
  // Generate calendar days
  const weekDays = getDaysInWeek();

  return (
    <div className="app-container">
      <div className="calendar-container">
        <div className="calendar-header">
          <div>
             <div className="calendar-header">
                <button 
                  onClick={() => navigateWeek('prev')}
                  className='week-display'
                >
                  ←
                </button>
                <span>{formatWeekDisplay()}</span>
                <button 
                  onClick={() => navigateWeek('next')}
                  className='week-display'
                >
                  →
                </button>
            </div>
          </div>
        </div>
            
            <div className="calendar-grid">
              
              {/* Calendar cells */}
              {weekDays.map((day) => (
                <div className="calendar-day" key={day.date}>
                  <div className="calendar-day-header">{day.weekday}</div>
                  
                  {/* Breakfast meals */}
                  {day.meals.filter(meal => meal.mealType === 'breakfast').map(meal => (
                    <div 
                      key={`breakfast-${meal.id}`} 
                      className="meal breakfast"
                    >
                       <div className="label">Breakfast</div>
                      <div>{meal.name}</div>
                    </div>
                  ))}
                  
                  {/* Lunch meals */}
                  {day.meals.filter(meal => meal.mealType === 'lunch').map(meal => (
                    <div 
                      key={`lunch-${meal.id}`} 
                      className="meal lunch"
                    >
                      <div className="label">Lunch</div>
                      <div>{meal.name}</div>
                    </div>
                  ))}
                  
                  {/* Dinner meals */}
                  {day.meals.filter(meal => meal.mealType === 'dinner').map(meal => (
                    <div 
                      key={`dinner-${meal.id}`} 
                      className="meal dinner"
                    >
                      <div className="label">Dinner</div>
                      <div>{meal.name}</div>
                    </div>
                  ))}
                  
                </div>
              ))}
            </div>

        

      </div>
    </div>
  );
}

