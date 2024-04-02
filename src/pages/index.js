// pages/index.js
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FormComponent from "../components/formComponent";

const HomePage = ({ selectedDepartment, departName, userID }) => {
  const departmentSales = [
    "會議召開 (固定、臨時會議)",
    "客戶來訪接待",
    "拜訪客戶",
    "產品報價",
    "資料蒐集 (商流、市場訊息)",
    "規格、材料找尋確認",
    "產線協助(交期、追蹤協商)",
    "文書處理 (電話溝通、MAIL 回覆)",
    "登打報價單/維護系統資料",
    "訂單/工單處理",
    "客供處理",
    "廠內工單/延交反應與協調",
    "出貨相關事宜",
    "例行報表/能見度",
    "其他",
  ];
  const departmentIndustry = [
    "建立BOM(含建料號)",
    "其他",
    "做承認書(含上傳客戶系統)",
    "製樣",
    "GP資料維護",
    "繪圖",
    "資料歸檔(含上傳系統)",
    "搜尋物料",
    "開會",
    "製造流程圖",
    "工務事項",
    "(空白)",
    "製作SOP",
    "製作作業流程圖",
    "製作治具",
    "支援產線",
  ];
  const departmentMaterials = ["包裝", "文件製作", "送貨", "(空白)", "其他"];
  const departmentQualityAssurance = [
    "其他",
    "文件製作",
    "RoHS檢驗",
    "客訴處理",
    "信賴性測試",
    "開會",
    "上課",
    "廠內異常處理",
    "儀器校驗",
    "不良品維修",
    "切金相",
    "ORT測試",
    "簽工單",
    "稽核",
    "(空白)",
    "RDT測試",
  ];

  const [apiData, setApiData] = useState(null);
  // Function to fetch data from the API

  let departmentOptions;
  let departmentName;
  let departmentNameEng;
  switch (departName) {
    case "業務":
      departmentOptions = departmentSales;
      departmentName = "業務";
      departmentNameEng = "Sales";
      break;
    case "工程":
      departmentOptions = departmentIndustry;
      departmentName = "工程";
      departmentNameEng = "Industry";
      break;
    case "採購":
      departmentOptions = departmentMaterials;
      departmentName = "採購";
      departmentNameEng = "Materials";
      break;
    case "品保":
      departmentOptions = departmentQualityAssurance;
      departmentName = "品保";
      departmentNameEng = "QualityAssurance";
      break;
    default:
      // Default to departmentSales if the selected department is not recognized
      departmentOptions = departmentSales;
      break;
  }
  const fetchDataFromAPI = async (departmentName) => {
    let localizedDepartmentName;

    // Set the localized department name based on the provided departmentName
    switch (departmentName) {
      case "Sales":
        localizedDepartmentName = "業務";
        break;
      case "Industry":
        localizedDepartmentName = "工程";
        break;
      case "Materials":
        localizedDepartmentName = "採購";
        break;
      case "QualityAssurance":
        localizedDepartmentName = "品保";
        break;
      default:
        localizedDepartmentName = departmentName; // Default to the provided departmentName
    }

    console.log(localizedDepartmentName);

    try {
      // Make a GET request to your API endpoint with the departmentName as a query parameter
      const response = await fetch(
        `/api/getDB?departmentName=${encodeURIComponent(
          localizedDepartmentName
        )}`
      );

      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      // Parse the JSON response
      const data = await response.json();

      // Set the fetched data in state
      setApiData(data);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data from the API when the selected department changes
    console.log(`selected department outside: ${selectedDepartment}`);
    console.log(departName);
    fetchDataFromAPI(selectedDepartment);
  }, [selectedDepartment]);

  return (
    <div className="col-12 col-sm-12">
      <div className="card card-primary card-outline card-outline-tabs">
        <div className="card-header p-0 border-bottom-0">
          <ul className="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="tabs-add-logs-tab"
                data-toggle="pill"
                href="#tabs-add-logs"
                role="tab"
                aria-controls="tabs-add-logs"
                aria-selected="true"
              >
                新增日誌
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="tabs-logs-from-database-tab"
                data-toggle="pill"
                href="#tabs-logs-from-database"
                role="tab"
                aria-controls="tabs-logs-from-database"
                aria-selected="false"
              >
                工作日誌({departName})
              </a>
            </li>
          </ul>
        </div>

        <FormComponent
          department={departmentName}
          departmentOptions={departmentOptions}
          apiData={apiData}
          departmentNameEng={departmentNameEng}
          fetchDataFromAPI={fetchDataFromAPI}
          userID={userID}
          departName={departName}
        />
      </div>
    </div>
  );
};

export default HomePage;
