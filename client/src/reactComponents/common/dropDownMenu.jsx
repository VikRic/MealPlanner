import React, { useState } from 'react'
function DropDownMenu({onChange}) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    console.log(e.target)
    setValue(e.target.value)
    onChange(e.target.value)
  }
  return (
    <div>
      <select id='dropdown01' value={value} onChange={handleChange}>
        <option value="">Choose restriction</option>
        <option value="dairyFree">No dairy</option>
        <option value="glutenFree">No gluten</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
      </select>
    </div>
  )
}

export default DropDownMenu
