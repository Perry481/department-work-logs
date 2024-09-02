import { connect } from "mssql";

export default async function handler(req, res) {
  try {
    const sqlConfig = {
      user: "sa",
      password: "chi",
      server: "192.168.0.9",
      database: "CHIComp01",
      encrypt: false,
    };

    const pool = await connect(sqlConfig);

    const personQuery = `
      SELECT [PersonID], [PersonName]
      FROM [CHIComp01].[dbo].[comPerson]
    `;

    const customerQuery = `
      SELECT [ID], [ShortName]
      FROM [CHIComp01].[dbo].[comCustomer]
    `;

    const personResult = await pool.request().query(personQuery);
    const customerResult = await pool.request().query(customerQuery);

    const names = {
      persons: personResult.recordset.reduce((acc, curr) => {
        acc[curr.PersonID] = curr.PersonName;
        return acc;
      }, {}),
      customers: customerResult.recordset.reduce((acc, curr) => {
        acc[curr.ID] = curr.ShortName;
        return acc;
      }, {}),
    };

    res.status(200).json(names);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
