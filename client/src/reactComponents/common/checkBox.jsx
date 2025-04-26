
function Checkbox({ label, name, checked, onChange, required }) {
  return (
    <label>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
      />
      {label}
    </label>
  )
}

export default Checkbox
