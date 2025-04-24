import React, { useState } from 'react'
function DropDownMenu({onChange}) {
  const [value, setValue] = useState('none')

  const handleChange = (e) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }
  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option value="none">Choose restriction</option>
        <option value="dairyFree">No dairy</option>
        <option value="glutenFree">No gluten</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
      <p>You chose {value}</p>
    </div>
  )
}

export default DropDownMenu
