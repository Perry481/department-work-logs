import { connect } from "mssql";

export default async function handler(req, res) {
  try {
    // Extract data from the request body
    const {
      personId,
      customerName,
      projectName,
      productName,
      everbizCode,
      workHour,
      jobTypes,
      remark,
      departmentName,
      createdTime,
    } = req.body;

    // Connect to your SQL Server
    const sqlConfig = {
      user: "sa",
      password: "chi",
      server: "192.168.0.9",
      database: "CHIComp01",
      encrypt: false,
    };

    const pool = await connect(sqlConfig);

    try {
      // Define the SQL query to insert data into the table
      const sqlQuery = `
        INSERT INTO [dbo].[absKPJobItem] (PersonID, CustomerName, ProjectName, ProductName, EverbizCode, WorkHour, JobTypeCode, Remark, CreatedTime, UpdatedTime, DepartmentName)
        VALUES (@PersonID, @CustomerName, @ProjectName, @ProductName, @EverbizCode, @WorkHour, @JobTypeCode, @Remark, @CreatedTime, GETDATE(), @DepartmentName);
      `;

      // Create a new SQL request
      const request = pool.request();

      // Set parameters for the query

      request.input("PersonID", personId);
      request.input("CustomerName", customerName);
      request.input("ProjectName", projectName);
      request.input("ProductName", productName);
      request.input("EverbizCode", everbizCode);
      request.input("WorkHour", workHour);
      request.input("JobTypeCode", jobTypes.join(","));
      request.input("Remark", remark);
      request.input("CreatedTime", createdTime);
      request.input("DepartmentName", departmentName);

      // Execute the SQL query
      await request.query(sqlQuery);

      // Send a success response
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Close the SQL connection
      await pool.close();
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
