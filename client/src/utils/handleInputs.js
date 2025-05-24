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
  }))
}

export const handleCheckboxChange = (setInputs) => (name, checked, value) => {
  setInputs((prevState) => {
    let updatedDishTypes = [...prevState.dishTypes]

    if (checked) {
      // Add if doesnt exist
      if (!updatedDishTypes.includes(value)) {
        updatedDishTypes.push(value)
      }
    } else {
      // Remove if unmarked
      updatedDishTypes = updatedDishTypes.filter((dishType) => dishType !== value)
    }

    return {
      ...prevState,
      dishTypes: updatedDishTypes
    }
  })
}

export const handleArrayInputChange = (setInputs) => (e) => {
  const { name, value } = e.target
  setInputs((prevState) => ({
    ...prevState,
    [name]: name === 'ingredientSearch'
    ? value.split(',')
    : value
  }))
}
