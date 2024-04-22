import { connect } from "mssql";

export default async function handler(req, res) {
  try {
    // Extract data from the request body
    const {
      jobItemSgt,
      personId,
      customerName,
      projName,
      prodName,
      prodID,
      workHour,
      jobTypeCode,
      remark,
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
      // Define the SQL query to update data in the table
      const sqlQuery = `
        UPDATE [dbo].[absKPJobItem]
        SET PersonID = @PersonID, CustomerName = @CustomerName, ProjectName = @ProjName, ProductName = @ProdName, CreatedTime = @CreatedTime,
            EverbizCode = @ProdID, WorkHour = @WorkHour, JobTypeCode = @JobTypeCode, Remark = @Remark, UpdatedTime = GETDATE()
        WHERE JobItemSgt = @JobItemSgt;
      `;

      // Create a new SQL request
      const request = pool.request();

      // Set parameters for the query
      request.input("JobItemSgt", jobItemSgt);
      request.input("PersonID", personId);
      request.input("CustomerName", customerName);
      request.input("ProjName", projName);
      request.input("ProdName", prodName);
      request.input("ProdID", prodID);
      request.input("WorkHour", workHour);
      request.input("JobTypeCode", jobTypeCode);
      request.input("Remark", remark);
      request.input("CreatedTime", createdTime);

      // Execute the SQL query
      const result = await request.query(sqlQuery);

      // Check if the update was successful
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: "Data updated successfully" });
      } else {
        res.status(404).json({ error: "Item not found" });
      }
    } catch (error) {
      console.error("SQL Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Close the SQL connection
      await pool.close();
    }
  } catch (error) {
    console.error("Connection Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
