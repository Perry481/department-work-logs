import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditForm = ({
  item,
  onSubmit,
  department,
  departmentOptions,
  fetchDataFromAPI,
  departmentNameEng,
}) => {
  // console.log("Grid item:", item); // Add this line to check the grid's it

  // State to manage form input values
  const [inputValues, setInputValues] = useState({
    customerName: item.客戶編號,
    projName: item.專案名稱,
    prodName: item.產品名稱,
    prodID: item.新呈料號,
    remark: item.備註,
    timeSelection: item.花費時間,
  });
  const [date, setDate] = useState(() => {
    const initialDate = new Date(item.日期);
    initialDate.setHours(0, 0, 0, 0); // Reset time to midnight
    return initialDate;
  });

  const handleDateChange = (newDate) => {
    const localDate = new Date(newDate);
    localDate.setHours(0, 0, 0, 0); // Ensure the time is set to midnight
    setDate(localDate);
  };

  // Function to generate the correct ISO string for submission or logging
  const generateUTCDateString = (date) => {
    const dateCopy = new Date(date.getTime());
    const offset = date.getTimezoneOffset(); // in minutes
    dateCopy.setMinutes(dateCopy.getMinutes() - offset); // Adjust for timezone difference
    return dateCopy.toISOString().substring(0, 10); // Convert to ISO string
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const updatedItem = {
      jobItemSgt: item.JobItemSgt,
      personId: item.員工編號,
      customerName: inputValues.customerName,
      projName: inputValues.projName,
      prodName: inputValues.prodName,
      prodID: inputValues.prodID,
      remark: inputValues.remark,
      workHour: inputValues.timeSelection, // Directly use the state updated from select2
      jobTypeCode: selectedOptions.join(", "), // Use the updated state for selected options
      createdTime: generateUTCDateString(date),
    };

    console.log("Submitting Updated Item:", updatedItem);
    console.log("Date Submitted:", generateUTCDateString(date));

    // API call to update the database
    try {
      const response = await fetch("/api/updateDB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        console.log("Update successful");
        onSubmit(updatedItem); // Notify FormComponent about the update
        fetchDataFromAPI(departmentNameEng); // Refetching the grid data
      } else {
        throw new Error("Failed to update the item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Extract the preselected options from item.選項
  const preselectedOptions = item.選項
    .split(",")
    .map((option) => option.trim());

  const [selectedOptions, setSelectedOptions] = useState(preselectedOptions);

  const handleSelectionChange = (e) => {
    // For select2, you might need to directly use jQuery to get the selected values
    const selectedValues = $(selectRef.current)
      .select2("data")
      .map((data) => data.id); // Assuming 'id' holds the value you need

    setSelectedOptions(selectedValues); // Update state with the selected values
  };

  // Handler for input value changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const selectRef = useRef(null); // Create a ref for the select element
  const timeRef = useRef(null);

  const timeOptions = [];
  for (let i = 0; i <= 10; i += 0.5) {
    timeOptions.push(parseFloat(i.toFixed(1))); // Ensure consistency by parsing the values as float
  }

  const timeSelectionDropdown = parseFloat(
    inputValues.timeSelection.toFixed(1)
  );
  const handleTimeChange = (e) => {
    // Update the inputValues state for timeSelection with the new value
    setInputValues((prevValues) => ({
      ...prevValues,
      timeSelection: e.target.value,
    }));
  };
  useEffect(() => {
    // Initialize Select2 for the specific time selection dropdown
    $("#timeSelectionEdit")
      .select2({
        dropdownParent: $("#timeSelectionDropdown"),
        minimumResultsForSearch: -1,
      })
      .on("select2:select", function (e) {
        const selectedTime = parseFloat(e.params.data.id); // Ensure it's a float
        if (!isNaN(selectedTime)) {
          setInputValues((prev) => ({ ...prev, timeSelection: selectedTime }));
        }
      });

    // Initialize Select2 for the specific options selection dropdown
    $("#optionSelectionEdit")
      .select2({
        dropdownParent: $("#optionSelectionDropdown"),
        closeOnSelect: true,
        minimumResultsForSearch: Infinity,
      })
      .on("select2:select select2:unselect", function () {
        const selectedOptions = $("#optionSelectionEdit")
          .select2("data")
          .map((data) => data.id); // Use the ID or adjust if needed
        setSelectedOptions(selectedOptions);
      });

    // Cleanup function
    return () => {
      $("#timeSelectionEdit").off("select2:select").select2("destroy");
      $("#optionSelectionEdit")
        .off("select2:select select2:unselect")
        .select2("destroy");
    };
  }, []); // Dependencies should be included if there are any props/state values affecting this setup

  return (
    <div className="card card-primary" id="editForm">
      <div className="card-header">
        <h5>編輯日誌 {department}</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="row">
            <div className="form-group col-6">
              <label>客戶編號</label>
              <input
                type="text"
                className="form-control form-control-border"
                name="customerName"
                value={inputValues.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group col-6">
              <label>專案名稱</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="projName"
                name="projName"
                placeholder="專案名稱"
                value={inputValues.projName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label>產品名稱</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="prodName"
                name="prodName"
                placeholder="產品名稱"
                value={inputValues.prodName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group col-6">
              <label>新呈料號</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="prodID"
                name="prodID"
                placeholder="新呈料號"
                value={inputValues.prodID}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group" id="timeSelectionDropdown">
            <label>花費工時-小時</label>
            <select
              className="form-control select2"
              id="timeSelectionEdit"
              style={{ width: "100%" }}
              ref={timeRef}
              value={timeSelectionDropdown} // Set the value of the select element to timeSelection
              onChange={handleTimeChange} // Handle changes in the select element
            >
              {timeOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" id="optionSelectionDropdown">
            <label>選項</label>
            <select
              className="form-control select2"
              id="optionSelectionEdit"
              style={{ width: "100%" }}
              multiple
              ref={selectRef}
              value={selectedOptions} // Set the selected options
              onChange={handleSelectionChange}
            >
              {departmentOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label>日期</label>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                className="form-control form-control-border"
                dateFormat="yyyy/MM/dd" // Adjust date format as needed
              />
            </div>
            <div className="form-group col-6">
              <label>備註</label>
              <input
                type="text"
                className="form-control form-control-border"
                name="remark"
                value={inputValues.remark}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            儲存
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
