import { connect } from "mssql";

export const config = {
  api: {
    responseLimit: false,
  },
};

// Function to map DepartID to DepartName
function getDepartName(departID) {
  if (departID.startsWith("B51")) {
    return "智慧管理部";
  } else if (departID.startsWith("A0")) {
    return "CEO";
  } else if (departID.startsWith("B1")) {
    return "業務";
  } else if (departID.startsWith("B2")) {
    return "廠務";
  } else if (departID.startsWith("B3")) {
    return "品保";
  } else if (departID.startsWith("B4")) {
    return "採購";
  } else if (departID.startsWith("B5")) {
    return "人資";
  } else if (departID.startsWith("B6")) {
    return "工程";
  } else {
    return "Unknown"; // Handle other cases as needed
  }
}

export default async function handler(req, res) {
  try {
    // Prepare the SQL query
    const sqlQuery = `
      SELECT 
          abs.EmployeeID,
          abs.Password,
          per.DepartID
      FROM 
          [dbo].[absKPEmployee] abs
      JOIN 
          [CHIComp01].[dbo].[comPerson] per ON abs.EmployeeID = per.PersonID
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
      // Execute the SQL query
      const result = await pool.request().query(sqlQuery);

      // Modify the result to include DepartName
      const modifiedResult = result.recordset.map((record) => ({
        ...record,
        DepartName: getDepartName(record.DepartID),
      }));

      // Send the modified result as a response
      res.status(200).json(modifiedResult);
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
