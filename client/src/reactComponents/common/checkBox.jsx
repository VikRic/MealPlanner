import 'styles/checkBox.css'
function Checkbox({ label, name, checked, onChange, required, value }) {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.checked, e.target.value) // Sends name, checked & value
  }

  return (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        value={value}
        required={required}
      />
      {label}
    </label>
  )
}
export default Checkbox
