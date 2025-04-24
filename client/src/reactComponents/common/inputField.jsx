function InputField({ name, value, onChange, placeholder, ...rest }) {
  return (
    <div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onInvalid={(e) => e.target.setCustomValidity('How many meals')}
        onInput={(e) => e.target.setCustomValidity('')}
        {...rest}
      />
    </div>
  );
}

export default InputField;
