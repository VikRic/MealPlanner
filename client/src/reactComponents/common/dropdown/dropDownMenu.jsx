import  { useState } from 'react'

function DropDownMenu({ options = [], onChange, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (e) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div>
      <select id="dropdown01" value={value} onChange={handleChange}>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropDownMenu
