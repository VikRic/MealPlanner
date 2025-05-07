export const handleInputChange = (setInputs) => (e) => {
  const { name, value } = e.target
  setInputs((prevState) => ({
    ...prevState,
    [name]: value
  }))
}

// Sends allergy value from dropdown to server
export const handleDropdownChange = (setInputs) => (fieldName) => (value) => {
  setInputs((prevState) => ({
    ...prevState,
    [fieldName]: value
  }));
};

export const handleCheckboxChange = (setInputs) => (name, checked, value) => {
  setInputs((prevState) => {
    let updatedDishTypes = [...prevState.dishTypes]

    if (checked) {
      // Lägg till om den inte redan finns
      if (!updatedDishTypes.includes(value)) {
        updatedDishTypes.push(value)
      }
    } else {
      // Ta bort om den avmarkeras
      updatedDishTypes = updatedDishTypes.filter((dishType) => dishType !== value)
    }

    return {
      ...prevState,
      dishTypes: updatedDishTypes
    }
  })
}
