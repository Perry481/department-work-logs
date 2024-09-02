import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const SearchDialog = ({ isOpen, onClose, onSearch, initialCriteria }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    employeeId: "",
    customerId: "",
    productName: "",
    productId: "",
    workHours: "",
    date: null,
  });

  useEffect(() => {
    if (initialCriteria) {
      setSearchCriteria(initialCriteria);
    } else {
      setSearchCriteria({
        employeeId: "",
        customerId: "",
        productName: "",
        productId: "",
        workHours: "",
        date: null,
      });
    }
  }, [initialCriteria, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSearchCriteria((prev) => ({ ...prev, date }));
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-dialog-overlay"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    >
      <div
        className="card card-primary"
        style={{
          width: "600px",
          maxWidth: "100%",
          boxShadow: "0 5px 15px rgba(0,0,0,.5)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          className="card-header bg-primary text-white"
          style={{
            borderBottom: "none",
            padding: "20px",
          }}
        >
          <h5 className="m-0">高級搜索</h5>
        </div>
        <div
          className="card-body"
          style={{
            padding: "30px",
          }}
        >
          <div className="row">
            <div className="form-group col-md-6">
              <label>員工編號</label>
              <input
                type="text"
                className="form-control"
                name="employeeId"
                onChange={handleInputChange}
                placeholder="輸入員工編號"
              />
            </div>
            <div className="form-group col-md-6">
              <label>客戶編號</label>
              <input
                type="text"
                className="form-control"
                name="customerId"
                onChange={handleInputChange}
                placeholder="輸入客戶編號"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>產品名稱</label>
              <input
                type="text"
                className="form-control"
                name="productName"
                onChange={handleInputChange}
                placeholder="輸入產品名稱"
              />
            </div>
            <div className="form-group col-md-6">
              <label>新呈料號</label>
              <input
                type="text"
                className="form-control"
                name="productId"
                onChange={handleInputChange}
                placeholder="輸入新呈料號"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>花費時間</label>
              <input
                type="text"
                className="form-control"
                name="workHours"
                onChange={handleInputChange}
                placeholder="輸入花費時間"
              />
            </div>
            <div className="form-group col-md-6">
              <label>日期</label>
              <DatePicker
                selected={searchCriteria.date}
                onChange={handleDateChange}
                className="form-control"
                dateFormat="yyyy/MM/dd"
                placeholderText="選擇日期"
                wrapperClassName="w-100"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 text-right">
              <button className="btn btn-secondary mr-2" onClick={onClose}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleSearch}>
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
