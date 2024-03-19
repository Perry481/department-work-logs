import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormComponent = ({ department, departmentOptions }) => {
  useEffect(() => {
    // jsGrid configuration and initialization
    var clients = [
      {
        Name: "Otto Clay",
        Age: 25,
        Country: 1,
        Address: "Ap #897-1459 Quam Avenue",
        Married: false,
      },
      {
        Name: "Connor Johnston",
        Age: 45,
        Country: 2,
        Address: "Ap #370-4647 Dis Av.",
        Married: true,
      },
      {
        Name: "Lacey Hess",
        Age: 29,
        Country: 3,
        Address: "Ap #365-8835 Integer St.",
        Married: false,
      },
      {
        Name: "Timothy Henson",
        Age: 56,
        Country: 1,
        Address: "911-5143 Luctus Ave",
        Married: true,
      },
      {
        Name: "Ramona Benton",
        Age: 32,
        Country: 3,
        Address: "Ap #614-689 Vehicula Street",
        Married: false,
      },
    ];

    var countries = [
      { Name: "", Id: 0 },
      { Name: "United States", Id: 1 },
      { Name: "Canada", Id: 2 },
      { Name: "United Kingdom", Id: 3 },
    ];

    $("#jsGrid").jsGrid({
      width: "100%",
      height: "400px",
      inserting: false,
      editing: false,
      sorting: true,
      paging: true,
      data: clients,
      fields: [
        { name: "Name", type: "text", width: 150, validate: "required" },
        { name: "Age", type: "number", width: 50 },
        { name: "Address", type: "text", width: 200 },
        {
          name: "Country",
          type: "select",
          items: countries,
          valueField: "Id",
          textField: "Name",
        },
        {
          name: "Married",
          type: "checkbox",
          title: "Is Married",
          width: 70,
          sorting: false,
        },
        // { type: "control" },
      ],
    });
  }, []);
  const selectRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectValue, setSelectValue] = useState([]);
  const [inputValues, setInputValues] = useState({
    titleName: "",
    personID: "",
    customerName: "",
    projName: "",
    prodName: "",
    prodID: "",
    timeSpent: "",
    remark: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const handleFormSubmit = async (event) => {
    // Prevent the default form submission
    event.preventDefault();

    // Validate the required fields
    if (inputValues.titleName === "" || inputValues.personID === "") {
      // Optionally, provide user feedback or validation messages
      alert("必填區不能空白!");
      return; // Stop further processing
    }

    // Log out the values
    console.log("Department:", department);
    console.log("Title:", inputValues.titleName);
    console.log("Person ID:", inputValues.personID);
    console.log("Customer Name:", inputValues.customerName);
    console.log("Proj Name:", inputValues.projName);
    console.log("Prod Name:", inputValues.prodName);
    console.log("EverBiz Code:", inputValues.prodID);
    console.log("Time Spent:", inputValues.timeSpent);
    console.log("Remark:", inputValues.remark);

    // Access the current selection data using Select2 method
    const select2Data = $(selectRef.current).select2("data");

    // Extract only the 'id' or 'text' properties from the Select2 data
    const select2Values = select2Data.map((item) => item.id); // Change to 'text' if needed

    // Format the date as 'YYYY/MM/DD'
    const formattedDate = selectedDate
      ? selectedDate.toLocaleDateString("en-US")
      : "";

    const formattedTime = selectedTime
      ? selectedTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to false to use 24-hour format
        })
      : "";
    console.log("Job Types:", select2Values);
    console.log("Formatted Date:", formattedDate);
    console.log("Formatted Time:", formattedTime);
    const formattedDateTime = selectedDate
      ? selectedDate.toLocaleDateString("en-US") +
        " " +
        (selectedTime
          ? selectedTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // Set to false to use 24-hour format
            })
          : "")
      : "";

    console.log("Formatted Date and Time:", formattedDateTime);

    try {
      // Make the API call to insert data
      const response = await fetch("/api/postDB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: inputValues.titleName,
          personId: inputValues.personID,
          customerName: inputValues.customerName,
          projectName: inputValues.projName,
          productName: inputValues.prodName,
          everbizCode: inputValues.prodID,
          workHour: inputValues.timeSpent,
          jobTypes: select2Values,
          remark: inputValues.remark,
          departmentName: department,
          createdTime: formattedDateTime,
        }),
      });

      // Check if the response is successful
      if (response.ok) {
        alert("Data inserted successfully!"); // Provide feedback to the user
      } else {
        // Handle errors if the response is not successful
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to insert data. Please try again later.");
    }

    // After processing, you can optionally clear the form values
    setInputValues({
      titleName: "",
      personID: "",
      customerName: "",
      projName: "",
      prodName: "",
      prodID: "",
      timeSpent: "",
      remark: "",
    });

    setSelectValue([]);
    setSelectedDate(null);
    setSelectedTime(null);
    const $select2 = $(selectRef.current);
    $select2.val(null).trigger("change");
  };

  useEffect(() => {
    // Initialize Select2 when the component mounts
    $(selectRef.current).select2({
      closeOnSelect: false, // Keep the dropdown open after selecting an option
    });

    // Ensure to destroy Select2 when the component unmounts to prevent memory leaks
    return () => {
      $(selectRef.current).select2("destroy");
    };
  }, []);
  return (
    <div className="card-body">
      <div className="tab-content" id="custom-tabs-four-tabContent">
        {/* form */}
        <div
          className="tab-pane fade active show"
          id="tabs-add-logs"
          role="tabpanel"
          aria-labelledby="tabs-add-logs-tab"
        >
          <h5>新增日誌</h5>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="textInput">Title</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="textInput"
                name="titleName"
                placeholder="標題"
                value={inputValues.titleName}
                onChange={handleInputChange}
                required // Add the required attribute
              />
              {inputValues.titleName === "" && (
                <div className="text-danger">*必填</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="textInput">員工編號</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="textInput"
                name="personID"
                placeholder="員工編號"
                value={inputValues.personID}
                onChange={handleInputChange}
                required // Add the required attribute
              />
              {inputValues.personID === "" && (
                <div className="text-danger">*必填</div>
              )}
            </div>
            <div className="form-group">
              <label>客戶名稱</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="customerName"
                name="customerName"
                placeholder="客戶名稱"
                value={inputValues.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
              <label>花費時間</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="timeSpent"
                name="timeSpent"
                placeholder="花費時間"
                value={inputValues.timeSpent}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>選項</label>
              <select
                className="select2bs4 select2-hidden-accessible"
                id="selection"
                style={{ width: "100%" }}
                ref={selectRef}
                multiple
              >
                {departmentOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>日期</label>
              <br />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="form-control form-control-border"
                wrapperClassName="datePicker"
                dateFormat="MM/dd/yyyy"
                placeholderText="選擇日期"
              />
            </div>

            <div className="form-group">
              <label>時間</label>
              <br />
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                placeholderText="選擇時間"
                className="form-control form-control-border"
                wrapperClassName="datePicker"
              />
            </div>
            <div className="form-group">
              <label>備註</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="remark"
                name="remark"
                placeholder="備註"
                value={inputValues.remark}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleFormSubmit}
            >
              新增
            </button>
          </div>
        </div>

        <div
          className="tab-pane fade"
          id="tabs-logs-from-database"
          role="tabpanel"
          aria-labelledby="tabs-logs-from-database-tab"
        >
          <div className="row">
            <div className="col-12">
              <h5>工作日誌 業務</h5>
              <div id="jsGrid"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
