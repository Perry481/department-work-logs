import { connect } from "mssql";

export const config = {
  api: {
    responseLimit: false,
  },
};
export default async function handler(req, res) {
  try {
    // Define the department name based on the query parameter
    const departmentName = req.query.departmentName;

    // Prepare the SQL query with a WHERE clause to filter by departmentName
    const sqlQuery = `
    SELECT TOP (1000) [JobItemSgt]

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
    WHERE [departmentName] = @departmentName
    `;

    const sqlConfig = {
      user: "sa",
      password: "chi",
      server: "192.168.0.9",
      database: "CHIComp01",
      encrypt: false,
    };
    const pool = await connect(sqlConfig);

    try {
      const result = await pool
        .request()
        .input("departmentName", departmentName) // Pass the departmentName as parameter
        .query(sqlQuery);

      // Initialize an object to store the data with JobItemSgt as keys
      const separatedData = {};

      // Iterate through the result and organize the data by JobItemSgt
      result.recordsets[0].forEach((item) => {
        if (!separatedData[item.JobItemSgt]) {
          separatedData[item.JobItemSgt] = [];
        }
        separatedData[item.JobItemSgt].push(item);
      });

      res.status(200).json(separatedData);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
