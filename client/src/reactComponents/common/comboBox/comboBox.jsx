import { useState } from 'react'
import './comboBox.css'

function ComboBox({onChange, options }) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredOptions = options.filter(option =>
  option.toLowerCase().includes(query.toLowerCase())
)

  const handleSelect = (selected) => {
    onChange(selected)
    setQuery(selected)
    setShowDropdown(false)
  }

  return (
    <div className="combobox-container">
      <input
        className="combobox-input"
        placeholder="Search cuisine..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => setShowDropdown(true)}
      />
      {/* Adds clear button */}
      {query && (
        <button
          className="combobox-clear"
          onClick={() => {
            setQuery('')
            onChange('')
            setShowDropdown(false)  
          }}
        >
          ×
        </button>
      )}
      {showDropdown && options.length > 0 && (
        <ul className="combobox-dropdown">
          {/* Add (All) value to easier get rid of the dropdown */}
          {query === '' && (
          <li 
            className="combobox-option"
            onClick={() => handleSelect('')}
          >
            All
          </li>
          )}
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="combobox-option"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>

          ))}
        </ul>
      )}
    </div>
  )
}

export default ComboBox
