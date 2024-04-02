import { connect } from "mssql";

export default async function handler(req, res) {
  try {
    // Extract the jobItemSgt from the request body
    const { jobItemSgt } = req.body;

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
      // Define the SQL query to delete the item from the table
      const sqlQuery = `
        DELETE FROM [dbo].[absKPJobItem]
        WHERE [JobItemSgt] = @jobItemSgt
      `;

      // Create a new SQL request
      const request = pool.request();

      // Set the jobItemSgt parameter for the query
      request.input("jobItemSgt", jobItemSgt);

      // Execute the SQL query
      await request.query(sqlQuery);

      // Send a success response
      res.status(200).json({ message: "Item deleted successfully" });
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
