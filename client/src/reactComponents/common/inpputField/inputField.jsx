import './inputField.css'

function InputField({ name, value, onChange, placeholder, ...rest }) {
  return (
    <div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}

export default InputField
