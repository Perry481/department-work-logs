import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditForm from "./editForm";
const FormComponentUser = ({
  department,
  departmentOptions,
  apiData,
  departmentNameEng,
  fetchDataFromAPI,
  userID,
  departName,
}) => {
  // State to track whether editing mode is active
  const [isEditing, setIsEditing] = useState(false);

  // State to store the item being edited
  const [editItem, setEditItem] = useState(null);
  useEffect(() => {
    if (apiData) {
      const formattedData = [];
      Object.keys(apiData).forEach((key) => {
        apiData[key].forEach((item) => {
          // Convert UTC date string to a Date object
          const createdDateTime = new Date(item.CreatedTime);

          // Since the API returns UTC time, we need to manually adjust it to UTC+8
          const offset = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
          const localCreatedTime = new Date(createdDateTime.getTime() + offset);

          // Format the date to get YYYY-MM-DD format
          const createdDateStr = localCreatedTime.toISOString().split("T")[0];

          // Log the formatted created date and time
          console.log(
            `Formatted Created DateTime for ${item.PersonID}:`,
            createdDateStr
          );

          // Include JobItemSgt property in each row
          item.JobItemSgt = key;

          formattedData.push({
            JobItemSgt: key,
            員工編號: item.PersonID,
            客戶編號: item.CustomerName,
            專案名稱: item.ProjectName,
            產品名稱: item.ProductName,
            新呈料號: item.EverbizCode,
            花費時間: item.WorkHour,
            選項: item.JobTypeCode,
            日期: createdDateStr, // Use just the date for grid display
            創建日期: createdDateStr, // Assuming you want the same date format for creation
            備註: item.Remark,
          });
        });
      });

      // Initialize JSGrid with the formatted data
      $("#jsGrid").jsGrid({
        width: "100%",
        height: "500px",
        inserting: false,
        editing: false,
        deleting: true,
        sorting: true,
        paging: true,
        data: formattedData,
        deleteConfirm: "確定從資料庫中刪除此筆資料?", // Customize the confirmation message
        fields: [
          { name: "員工編號", type: "text", width: 100, editing: false },
          { name: "客戶編號", type: "text", width: 100 },
          { name: "專案名稱", type: "text", width: 150 },
          { name: "產品名稱", type: "text", width: 150 },
          { name: "新呈料號", type: "text", width: 100 },
          { name: "花費時間", type: "text", width: 50 }, //less than 10 hours
          {
            name: "選項",
            type: "text",
            width: 150,
          },
          { name: "日期", type: "text", width: 100 },
          { name: "創建日期", type: "text", width: 150, editing: false },
          { name: "備註", type: "text", width: 125 },
          {
            type: "control",
            width: 75,
            itemTemplate: (_, item) => {
              const buttonWidth = $("#jsGrid")
                .find("tr.jsgrid-insert-row")
                .children()
                .last()
                .width(); // Get the width of the last column

              const $editButton = $("<button>")
                .attr({
                  class: "btn btn-primary btn-sm edit-btn",
                  title: "Edit", // Add a title for tooltip
                  "data-item-id": item.JobItemSgt, // Pass the JobItemSgt as data attribute
                  style: `width: ${buttonWidth}px`, // Set the width of the button dynamically
                })
                .text("編輯")
                .on("click", function () {
                  // Handle edit button click
                  openEditForm(item); // Call a function to open the edit form with the item data
                });

              const $deleteButton = $("<button>")
                .attr({
                  class: "btn btn-danger btn-sm delete-btn",
                  title: "Delete", // Add a title for tooltip
                  "data-item-id": item.JobItemSgt, // Pass the JobItemSgt as data attribute
                  style: `width: ${buttonWidth}px`, // Set the width of the button dynamically
                })
                .text("刪除")
                .on("click", function () {
                  // Trigger the onItemDeleting event when the delete button is clicked
                  $("#jsGrid").jsGrid("deleteItem", item); // Trigger delete action
                  console.log("Deleting", item);
                });

              return $("<div>").append($editButton, $deleteButton); // Append both buttons to a div and return
            },
          },
        ],
        onItemDeleting: function (args) {
          const deletedItem = args.item; // Item to be deleted
          const jobItemSgt = deletedItem.JobItemSgt; // Access the JobItemSgt property directly
          console.log("Deleting the JobItemSgt:", jobItemSgt);

          // Make an API call to delete the item from the database
          fetch(`/api/deleteDB`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobItemSgt: jobItemSgt,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Item deleted successfully:", data);
              alert("已刪除");
              // Optionally, you can refresh the grid or perform any other action after successful deletion
            })
            .catch((error) => {
              console.error("Error deleting item:", error);
              // Handle error, show error message, etc.
            });
        },
      });
    }
  }, [apiData]);
  function openEditForm(item) {
    setEditItem(item); // Set the item being edited
    setIsEditing(true); // Set editing mode to true
  }
  const handleTabClick = () => {
    // Refresh the grid when the tab is clicked
    console.log("Tab clicked, refreshing grid...");
    setTimeout(() => {
      $("#jsGrid").jsGrid("refresh");
      // Trigger a resize event on the window object
      window.dispatchEvent(new Event("resize"));
    }, 750); // Delay of 100 milliseconds
  };

  useEffect(() => {
    // Attach event listener to the tab when the component mounts
    const tabElement = document.getElementById("tabs-logs-from-database-tab");
    if (tabElement) {
      tabElement.addEventListener("click", handleTabClick);

      // Remove event listener when the component unmounts
      return () => {
        tabElement.removeEventListener("click", handleTabClick);
      };
    }
  }, []); // Ensure this effect runs only once when the component mounts

  const selectRef = useRef(null);
  const timeRef = useRef(null); // Change the name to timeRef or any other meaningful name

  const timeOptions = [];
  for (let i = 0; i <= 10; i += 0.5) {
    timeOptions.push(i.toFixed(1));
  }

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectValue, setSelectValue] = useState([]);
  const [inputValues, setInputValues] = useState({
    // personID: "",
    customerName: "",
    projName: "",
    prodName: "",
    prodID: "",
    remark: "",
  });
  //updating time
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format the time to HH:mm
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
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

  const handleFormSubmit = async (event) => {
    // Prevent the default form submission
    event.preventDefault();
    if (!selectedDate) {
      alert("請選擇日期!");
      return; // Exit the function if no date is selected
    }
    // Validate the required fields
    if (inputValues.personID === "") {
      // Optionally, provide user feedback or validation messages
      alert("必填區不能空白!");
      return; // Stop further processing
    }

    // Access the current selection data using Select2 method
    const select2Data = $(selectRef.current).select2("data");

    // Extract only the 'id' or 'text' properties from the Select2 data
    const select2Values = select2Data.map((item) => item.id); // Change to 'text' if needed
    const select2TimeValues = $(timeRef.current).val();

    // Format the date as 'YYYY/MM/DD'
    const formattedDate = selectedDate
      ? selectedDate.toLocaleDateString("en-US")
      : "";

    try {
      // Make the API call to insert data
      const response = await fetch("/api/postDB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personId: userID,
          customerName: inputValues.customerName,
          projectName: inputValues.projName,
          productName: inputValues.prodName,
          everbizCode: inputValues.prodID,
          workHour: select2TimeValues,
          jobTypes: select2Values,
          remark: inputValues.remark,
          departmentName: department,
          createdTime: formattedDate,
        }),
      });

      // Check if the response is successful
      if (response.ok) {
        alert("成功上傳至資料庫!"); // Provide feedback to the user

        fetchDataFromAPI(departmentNameEng);
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
      // personID: "",
      customerName: "",
      projName: "",
      prodName: "",
      prodID: "",

      remark: "",
    });

    setSelectValue([]);
    setSelectedDate(null);

    $(selectRef.current).val(null).trigger("change");
    $(timeRef.current).val(null).trigger("change");
  };

  useEffect(() => {
    // Initialize Select2 when the component mounts or department changes
    const $select = $(selectRef.current);
    const $timeSelect = $(timeRef.current);
    $timeSelect.select2({
      minimumResultsForSearch: -1,
    });
    $select.select2({
      closeOnSelect: false, // Keep the dropdown open after selecting an option
    });

    return () => {
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
          <h5>新增日誌 {departName}</h5>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="textInput">員工編號</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="textInput"
                name="personID"
                placeholder="員工編號"
                value={userID}
                disabled
                // onChange={handleInputChange}
                required // Add the required attribute
              />
              {inputValues.personID === "" && (
                <div className="text-danger">*必填</div>
              )}
            </div>
            <div className="form-group">
              <label>客戶編號</label>
              <input
                type="text"
                className="form-control form-control-border"
                id="customerName"
                name="customerName"
                placeholder="客戶編號"
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
              <label>花費工時-小時</label>
              <select
                className="select2bs4 select2-hidden-accessible"
                id="timeSelection"
                style={{ width: "100%" }}
                ref={timeRef}
              >
                {timeOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
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
                placeholderText="點擊選擇日期"
              />
            </div>

            <div className="form-group disabled">
              <label>時間</label>
              <br />
              <div>{formattedTime}</div>
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
              <h5>工作日誌 {departName}</h5>
              <div id="jsGrid">
                {/* Place EditForm component outside of the grid's div */}
                {isEditing && editItem && (
                  <div
                    className=" edit-form-overlay"
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 9999,

                      overflowY: "auto",
                    }}
                  >
                    <EditForm
                      item={editItem}
                      onSubmit={(updatedItem) => {
                        console.log(updatedItem);
                        setIsEditing(false);
                        fetchDataFromAPI(departmentNameEng); // This should refresh the data in the grid
                      }}
                      department={department}
                      departmentOptions={departmentOptions}
                      onCancel={() => setIsEditing(false)}
                      fetchDataFromAPI={fetchDataFromAPI} // Passing the function
                      departmentNameEng={departmentNameEng}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponentUser;
