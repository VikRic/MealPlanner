function InputField({ name, value, onChange, placeholder, ...rest }) {
  return (
    <div>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
/*         onInvalid={(e) => e.target.setCustomValidity('Please enter the number of recipes you\'d like.')}
        onInput={(e) => e.target.setCustomValidity('')} */
        {...rest}
      />
    </div>
  );
}

export default InputField;
