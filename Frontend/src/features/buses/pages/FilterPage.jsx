import { set } from 'lodash'
import React from 'react'

const FilterPage = ({filters, setFilters}) => {


const handleCheckBox = (e) => {
  const { name, checked } = e.target;

  setFilters((prev) => {
    // AC ↔ Non-AC (only one allowed)
    if (name === "ac" && checked) {
      return { ...prev, ac: true, nonAc: false };
    }

    if (name === "nonAc" && checked) {
      return { ...prev, nonAc: true, ac: false };
    }

    // Sleeper ↔ Seater (only one allowed)
    if (name === "sleeper" && checked) {
      return { ...prev, sleeper: true, seater: false };
    }

    if (name === "seater" && checked) {
      return { ...prev, seater: true, sleeper: false };
    }

    // If unchecked → just turn it off
    return { ...prev, [name]: checked };
  });
};



  return (
    <div>
      <h1>Filyter Page</h1>

      {/* <button onClick={resetFilters}>Clear</button> */}

      <div>
        <label htmlFor="">AC</label>
        <input type="checkbox" name="ac"
        checked={filters.ac} 
        onChange={handleCheckBox}
        className="mr-2 h-4 w-4"
        id="" />
      </div>
            <div>
        <label htmlFor="">NON-AC</label>
        <input type="checkbox" name="nonAc"
        checked={filters.nonAc} 
        onChange={handleCheckBox}
        className="mr-2 h-4 w-4"
        id="" />
      </div>
      
    </div>
  )
}

export default FilterPage
