import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import ReactECharts from "echarts-for-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TabsContainer = styled.ul`
  margin-bottom: 0;
`;

const StyledDatePicker = styled(DatePicker)`
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const CalendarContainer = styled.div`
  .react-datepicker {
    font-family: Arial, sans-serif;
    border-radius: 0.3rem;
    border: 1px solid #ced4da;
    background-color: #fff;
  }

  .react-datepicker__month-container {
    float: none;
  }

  .react-datepicker__month {
    margin: 0.4rem;
    text-align: center;
  }

  .react-datepicker__month-text {
    display: inline-block;
    width: 4rem;
    margin: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.3rem;

    &:hover {
      background-color: #f0f0f0;
    }

    &--selected {
      background-color: #216ba5;
      color: white;
    }
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ced4da;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1.2rem;
  }

  select {
    font-size: 1rem;
    padding: 0.2rem;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled.input`
  margin-right: 5px;
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #666;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
`;

const DepartmentDataComponent = React.memo(({ apiData, department }) => {
  const [activeTab, setActiveTab] = useState("使用者");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [names, setNames] = useState({ persons: {}, customers: {} });
  const [showBlank, setShowBlank] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = useCallback(async () => {
    try {
      const response = await fetch("/api/getNames");
      if (response.ok) {
        const data = await response.json();
        setNames(data);
      } else {
        console.error("Failed to fetch names");
      }
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  }, []);

  const filterData = useCallback(() => {
    if (!apiData || typeof apiData !== "object") {
      console.error("apiData is not a valid object:", apiData);
      setFilteredData([]);
      return;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const filtered = Object.values(apiData)
      .flat()
      .filter((item) => {
        if (!item || !item.CreatedTime) {
          console.warn("Invalid item in apiData:", item);
          return false;
        }
        const itemDate = new Date(item.CreatedTime);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      });
    setFilteredData(filtered);
  }, [apiData, selectedDate]);

  useEffect(() => {
    if (apiData) {
      filterData();
    }
  }, [apiData, selectedDate, filterData]);

  const aggregateData = useCallback(
    (data, key) => {
      return data.reduce((acc, item) => {
        let keyValue, displayName;
        if (key === "PersonID") {
          keyValue = item[key];
          displayName = names.persons[keyValue] || keyValue;
          console.log(`User ID: ${keyValue}, Display Name: ${displayName}`); // Added console log
        } else if (key === "CustomerName") {
          keyValue =
            item[key] && item[key].trim() !== "" ? item[key] : "空白客戶";
          displayName = names.customers[keyValue] || keyValue;
        } else {
          keyValue = item[key] || "空白";
          displayName = keyValue;
        }

        if ((keyValue === "空白" || keyValue === "空白客戶") && !showBlank) {
          return acc;
        }

        if (!acc[keyValue]) {
          acc[keyValue] = { id: keyValue, name: displayName, value: 0 };
        }
        acc[keyValue].value += parseFloat(item.WorkHour) || 0;
        return acc;
      }, {});
    },
    [names, showBlank]
  );

  const getUserDetails = useCallback(
    (userId) => {
      const userTasks = filteredData.filter((item) => item.PersonID === userId);
      const customerHours = userTasks.reduce((acc, task) => {
        const customerId = task.CustomerName || "空白客戶";
        const customerName = names.customers[customerId] || customerId;
        if (!acc[customerId]) {
          acc[customerId] = { id: customerId, name: customerName, hours: 0 };
        }
        acc[customerId].hours += parseFloat(task.WorkHour) || 0;
        return acc;
      }, {});

      return {
        customerHours: Object.values(customerHours),
        totalHours: userTasks.reduce(
          (sum, task) => sum + (parseFloat(task.WorkHour) || 0),
          0
        ),
      };
    },
    [filteredData, names]
  );

  const chartData = useMemo(() => {
    if (activeTab === "使用者" && selectedUser) {
      return getUserDetails(selectedUser);
    } else {
      const aggregatedData = aggregateData(
        filteredData,
        activeTab === "使用者"
          ? "PersonID"
          : activeTab === "專案別"
          ? "ProjectName"
          : activeTab === "客戶別"
          ? "CustomerName"
          : "ProductName"
      );
      // Sort the data and store it as an array
      return Object.values(aggregatedData).sort((a, b) => b.value - a.value);
    }
  }, [activeTab, selectedUser, getUserDetails, aggregateData, filteredData]);
  const hasData = useMemo(() => {
    return chartData.length > 0;
  }, [chartData]);
  const handleChartClick = useCallback(
    (params) => {
      if (activeTab === "使用者" && !selectedUser) {
        const userId = chartData[params.dataIndex].id;
        console.log(`Clicked User ID: ${userId}`);
        setSelectedUser(userId);
      }
    },
    [activeTab, selectedUser, chartData]
  );

  const chartOption = useMemo(() => {
    if (!hasData) {
      return null;
    }

    if (activeTab === "使用者" && selectedUser) {
      console.log(`Generating pie chart for User ID: ${selectedUser}`);
      const userDetails = getUserDetails(selectedUser);
      // Pie chart option
      return {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} 小時 ({d}%)",
        },
        series: [
          {
            name: "工作時數",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "outside",
              formatter: "{b}: {c} 小時",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: userDetails.customerHours.map((customer) => ({
              value: customer.hours,
              name: customer.name,
            })),
          },
        ],
      };
    } else {
      // Bar chart option
      const dataCount = chartData.length;
      const initialZoom = dataCount > 20 ? [0, 50] : [0, 100];

      return {
        tooltip: {
          formatter: function (params) {
            return `${params.name}: ${params.value} 小時`;
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: initialZoom[0],
            end: initialZoom[1],
            bottom: 10,
          },
          {
            type: "inside",
            xAxisIndex: [0],
            start: initialZoom[0],
            end: initialZoom[1],
          },
        ],
        xAxis: {
          type: "category",
          data: chartData.map((item) => item.name),
          axisLabel: {
            interval: 0,
            rotate: 30,
            margin: 15,
            formatter: function (value) {
              if (value.length > 5) {
                return value.substring(0, 5) + "...";
              }
              return value;
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: chartData.map((item) => item.value),
          },
        ],
      };
    }
  }, [filteredData, activeTab, selectedUser, chartData, names, getUserDetails]);
  const chartTitle = useMemo(() => {
    if (!hasData) {
      return "無資料";
    }

    if (activeTab === "使用者" && selectedUser) {
      const userName = names.persons[selectedUser] || selectedUser;
      return `${userName} (${selectedUser}) 的客戶工時分佈`;
    } else {
      return activeTab === "使用者"
        ? "使用者工時統計"
        : activeTab === "專案別"
        ? "專案工時統計"
        : activeTab === "客戶別"
        ? "客戶工時統計"
        : "產品工時統計";
    }
  }, [activeTab, selectedUser, names, hasData]);

  if (!apiData) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      <h5>部門資料 {department}</h5>
      <HeaderContainer>
        <TabsContainer className="nav nav-tabs">
          {["使用者", "專案別", "客戶別", "產品別"].map((tab) => (
            <li className="nav-item" key={tab}>
              <a
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedUser(null);
                }}
                href="#"
              >
                {tab}
              </a>
            </li>
          ))}
        </TabsContainer>
        <CalendarContainer>
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedUser(null);
            }}
            dateFormat="yyyy年MM月"
            showMonthYearPicker
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <CalendarHeader>
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  {"<"}
                </button>
                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(value)}
                >
                  {Array.from({ length: 10 }, (_, i) => 2020 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  {">"}
                </button>
              </CalendarHeader>
            )}
          />
        </CalendarContainer>
      </HeaderContainer>
      <div className="tab-content mt-3">
        <ChartHeader>
          <h5>{chartTitle}</h5>
          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              id="showBlank"
              checked={showBlank}
              onChange={(e) => setShowBlank(e.target.checked)}
            />
            <label htmlFor="showBlank">顯示空白數據</label>
          </CheckboxContainer>
        </ChartHeader>
        {hasData ? (
          <>
            {chartOption && (
              <ReactECharts
                ref={chartRef}
                option={chartOption}
                style={{ height: "400px" }}
                onEvents={{ click: handleChartClick }}
              />
            )}
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="btn btn-secondary mt-2"
              >
                返回使用者總覽
              </button>
            )}
          </>
        ) : (
          <NoDataMessage>
            未找到符合條件的資料。請嘗試調整日期或篩選條件。
          </NoDataMessage>
        )}
      </div>
    </div>
  );
});

export default DepartmentDataComponent;
