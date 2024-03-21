import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormComponent = ({ department, departmentOptions, apiData }) => {
  useEffect(() => {
    if (apiData) {
      // Parse the API data and format it according to JSGrid's data structure
      const formattedData = [];
      Object.keys(apiData).forEach((key) => {
        apiData[key].forEach((item) => {
          const createdDateTime = new Date(item.CreatedTime);
          const updatedDateTime = new Date(item.UpdatedTime);

          // Adjust for the local timezone offset
          const utcOffset = -8 * 60 * 60 * 1000;

          // Apply the offset to the created and updated date time
          const localCreatedTime = new Date(
            createdDateTime.getTime() + utcOffset
          );
          const localUpdatedTime = new Date(
            updatedDateTime.getTime() + utcOffset
          );

          // Format the date and time
          const createdDateStr = localCreatedTime.toISOString().split("T")[0];
          const createdTimeStr = localCreatedTime.toTimeString().slice(0, 8); // Extract HH:mm:ss
          const updatedDateStr = localUpdatedTime.toISOString().split("T")[0];
          const updatedTimeStr = localUpdatedTime.toTimeString().slice(0, 8); // Extract HH:mm:ss

          // Combine date and time strings
          const formattedCreatedDateTime = `${createdDateStr} ${createdTimeStr}`;
          const formattedUpdatedDateTime = `${updatedDateStr} ${updatedTimeStr}`;

          formattedData.push({
            標題: item.Title,
            員工編號: item.PersonID,
            客戶名稱: item.CustomerName,
            專案名稱: item.ProjectName,
            產品名稱: item.ProductName,
            新呈料號: item.EverbizCode,
            花費時間: item.WorkHour,
            選項: item.JobTypeCode,
            日期: formattedCreatedDateTime,
            創建日期: formattedUpdatedDateTime,
            備註: item.Remark,
          });
        });
      });

      // Initialize JSGrid with the formatted data
      $("#jsGrid").jsGrid({
        width: "100%",
        height: "400px",
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        data: formattedData,
        fields: [
          { name: "標題", type: "text", width: 100 },
          { name: "員工編號", type: "text", width: 100 },
          { name: "客戶名稱", type: "text", width: 100 },
          { name: "專案名稱", type: "text", width: 150 },
          { name: "產品名稱", type: "text", width: 150 },
          { name: "新呈料號", type: "text", width: 100 },
          { name: "花費時間", type: "text", width: 50 },
          { name: "選項", type: "text", width: 150 },
          { name: "日期", type: "text", width: 150 },
          { name: "創建日期", type: "text", width: 150 },
          { name: "備註", type: "text", width: 150 },
        ],
      });
    }
  }, [apiData]);

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
        alert("成功上傳至資料庫!"); // Provide feedback to the user
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
    // Initialize Select2 when the component mounts or department changes
    const $select = $(selectRef.current);
    $select.select2({
      closeOnSelect: false, // Keep the dropdown open after selecting an option
    });

    return () => {
      // Destroy Select2 when the component unmounts or department changes
      $select.select2("destroy");
    };
  }, [department]); // Re-run this effect whenever the department changes

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
          <h5>新增日誌 {department}</h5>
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
              <h5>工作日誌 {department}</h5>
              <div id="jsGrid"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
