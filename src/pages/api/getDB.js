import { connect } from "mssql";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  try {
    // Replace the SQL query placeholder with your actual query
    const sqlQuery = `
    SELECT TOP (1000) [JobItemSgt]
    ,[Title]
    ,[PersonID]
    ,[CustomerName]
    ,[ProjectName]
    ,[ProductName]
    ,[EverbizCode]
    ,[WorkHour]
    ,[JobTypeCode]
    ,[Remark]
    ,[CreatedTime]
    ,[UpdatedTime]
    ,[departmentName]
FROM [CHIComp01].[dbo].[absKPJobItem]

  
    `;

    // Connect to your SQL Server
    const sqlConfig = {
      user: "sa",
      password: "chi",
      server: "192.168.0.9", // This should be a string
      database: "CHIComp01",
      encrypt: false,
    };
    const pool = await connect(sqlConfig);

    try {
      // Execute the SQL query
      const result = await pool.request().query(sqlQuery);

      res.status(200).json(result);
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
