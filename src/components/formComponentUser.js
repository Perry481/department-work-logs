import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditForm from "./editForm";
import SearchDialog from "./SearchDialog";

const FormComponentUser = ({
  department,
  departmentOptions,
  apiData,
  departmentNameEng,
  fetchDataFromAPI,
  userID,
  departName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const originalDataRef = useRef([]);

  useEffect(() => {
    if (apiData) {
      const formattedData = [];
      Object.keys(apiData).forEach((key) => {
        apiData[key].forEach((item) => {
          const createdDateTime = new Date(item.CreatedTime);
          const offset = 8 * 60 * 60 * 1000;
          const localCreatedTime = new Date(createdDateTime.getTime() + offset);
          const createdDateStr = localCreatedTime.toISOString().split("T")[0];

          formattedData.push({
            JobItemSgt: key,
            員工編號: item.PersonID,
            客戶編號: item.CustomerName,
            專案名稱: item.ProjectName,
            產品名稱: item.ProductName,
            新呈料號: item.EverbizCode,
            花費時間: item.WorkHour,
            選項: item.JobTypeCode,
            日期: createdDateStr,
            創建日期: createdDateStr,
            備註: item.Remark,
          });
        });
      });

      setGridData(formattedData);
      originalDataRef.current = formattedData;

      initializeJsGrid(formattedData);
    }
  }, [apiData]);

  const initializeJsGrid = (data) => {
    $("#jsGrid").jsGrid({
      width: "100%",
      height: "500px",
      inserting: false,
      editing: false,
      deleting: true,
      sorting: true,
      paging: true,
      data: data,
      deleteConfirm: "確定從資料庫中刪除此筆資料?",
      fields: [
        { name: "員工編號", type: "text", width: 60, editing: false },
        { name: "客戶編號", type: "text", width: 100 },
        { name: "專案名稱", type: "text", width: 120 },
        { name: "產品名稱", type: "text", width: 120 },
        { name: "新呈料號", type: "text", width: 100 },
        { name: "花費時間", type: "text", width: 50 },
        { name: "選項", type: "text", width: 150 },
        { name: "日期", type: "text", width: 100 },
        { name: "創建日期", type: "text", width: 150, editing: false },
        { name: "備註", type: "text", width: 125 },
        {
          type: "control",
          width: 100,
          headerTemplate: function () {
            const $container = $("<div>").css({
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            });

            const $searchButton = $("<button>")
              .attr({
                class: "btn btn-default btn-sm search-btn",
                title: "Search",
              })
              .append($("<i>").addClass("fas fa-search"))
              .on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                setIsSearchDialogOpen(true);
              });

            const $resetButton = $("<button>")
              .attr({
                class: "btn btn-secondary btn-sm reset-btn",
                title: "Reset Search",
              })
              .text("Reset")
              .on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                resetSearch();
              });

            return $container.append($searchButton).append($resetButton);
          },
          itemTemplate: (_, item) => {
            const buttonWidth = $("#jsGrid")
              .find("tr.jsgrid-insert-row")
              .children()
              .last()
              .width();

            const $editButton = $("<button>")
              .attr({
                class: "btn btn-primary btn-sm edit-btn",
                title: "Edit",
                "data-item-id": item.JobItemSgt,
                style: `width: ${buttonWidth}px`,
              })
              .text("編輯")
              .on("click", function () {
                openEditForm(item);
              });

            const $deleteButton = $("<button>")
              .attr({
                class: "btn btn-danger btn-sm delete-btn",
                title: "Delete",
                "data-item-id": item.JobItemSgt,
                style: `width: ${buttonWidth}px`,
              })
              .text("刪除")
              .on("click", function () {
                $("#jsGrid").jsGrid("deleteItem", item);
                console.log("Deleting", item);
              });

            return $("<div>").append($editButton, $deleteButton);
          },
        },
      ],
      onItemDeleting: function (args) {
        const deletedItem = args.item;
        const jobItemSgt = deletedItem.JobItemSgt;
        console.log("Deleting the JobItemSgt:", jobItemSgt);

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
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
          });
      },
    });
  };

  const handleSearch = (criteria) => {
    console.log("Search criteria:", criteria);
    const filtered = originalDataRef.current.filter((item) => {
      return (
        (!criteria.employeeId || item.員工編號.includes(criteria.employeeId)) &&
        (!criteria.customerId || item.客戶編號.includes(criteria.customerId)) &&
        (!criteria.productName ||
          item.產品名稱.includes(criteria.productName)) &&
        (!criteria.productId || item.新呈料號.includes(criteria.productId)) &&
        (!criteria.workHours ||
          item.花費時間.toString() === criteria.workHours) &&
        (!criteria.date ||
          item.日期 === criteria.date.toISOString().split("T")[0])
      );
    });
    console.log("Filtered data:", filtered);
    setGridData(filtered);
    $("#jsGrid").jsGrid("option", "data", filtered);
  };

  const resetSearch = () => {
    console.log("Resetting search. Original data:", originalDataRef.current);
    setGridData(originalDataRef.current);
    $("#jsGrid").jsGrid("option", "data", originalDataRef.current);
  };

  function openEditForm(item) {
    setEditItem(item);
    setIsEditing(true);
  }

  const handleTabClick = () => {
    console.log("Tab clicked, refreshing grid...");
    setTimeout(() => {
      $("#jsGrid").jsGrid("refresh");
      window.dispatchEvent(new Event("resize"));
    }, 750);
  };

  useEffect(() => {
    const tabElement = document.getElementById("tabs-logs-from-database-tab");
    if (tabElement) {
      tabElement.addEventListener("click", handleTabClick);
      return () => {
        tabElement.removeEventListener("click", handleTabClick);
      };
    }
  }, []);

  const selectRef = useRef(null);
  const timeRef = useRef(null);

  const timeOptions = [];
  for (let i = 0; i <= 10; i += 0.5) {
    timeOptions.push(i.toFixed(1));
  }

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectValue, setSelectValue] = useState([]);
  const [inputValues, setInputValues] = useState({
    customerName: "",
    projName: "",
    prodName: "",
    prodID: "",
    remark: "",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

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
    event.preventDefault();
    if (!selectedDate) {
      alert("請選擇日期!");
      return;
    }

    const select2Data = $(selectRef.current).select2("data");
    const select2Values = select2Data.map((item) => item.id);
    const select2TimeValues = $(timeRef.current).val();
    const formattedDate = selectedDate
      ? selectedDate.toLocaleDateString("en-US")
      : "";

    try {
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

      if (response.ok) {
        alert("成功上傳至資料庫!");
        fetchDataFromAPI(departmentNameEng);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to insert data");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to insert data. Please try again later.");
    }

    setInputValues({
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
    const $select = $(selectRef.current);
    const $timeSelect = $(timeRef.current);
    $timeSelect.select2({
      minimumResultsForSearch: -1,
    });
    $select.select2({
      closeOnSelect: false,
    });

    return () => {
      $select.select2("destroy");
      $timeSelect.select2("destroy");
    };
  }, [department]);
  return (
    <div className="card-body">
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onSearch={handleSearch}
        initialCriteria={searchCriteria}
      />
      <div className="tab-content" id="custom-tabs-four-tabContent">
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
                required
              />
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
                {isEditing && editItem && (
                  <div
                    className="edit-form-overlay"
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
                        fetchDataFromAPI(departmentNameEng);
                      }}
                      department={department}
                      departmentOptions={departmentOptions}
                      onCancel={() => setIsEditing(false)}
                      fetchDataFromAPI={fetchDataFromAPI}
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
