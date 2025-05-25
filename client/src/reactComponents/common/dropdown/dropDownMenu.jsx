import  { useState } from 'react'

function DropDownMenu({id, options = [], onChange, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (e) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div>
      <select
      id={id}
      value={value}
      onChange={handleChange}
      className={value === '' ? 'placeholder' : ''
      }>
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
