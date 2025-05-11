import React from "react";
import InputForm from '../common/inputForm'
import MealPlannerApp from "../layout/test";
import MyTest from "../common/test";



function Recipe() {
  return (
      <div className="recipe-layout">
      <InputForm />
      <MealPlannerApp />
      <MyTest />
      </div>

  );
}

export default Recipe;