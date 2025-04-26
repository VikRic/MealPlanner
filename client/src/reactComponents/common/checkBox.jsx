function Checkbox({ label, name, checked, onChange, required }) {
  const handleChange = (e) => {
    onChange(e) // Send event
  }
  return (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        required={required}
      />
      {label}
    </label>
  )
}

export default Checkbox
