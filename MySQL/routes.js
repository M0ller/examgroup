import {connection} from "./index.js";

export const routeRequests = (app, connection) => {

    const dbName = "animals"

    // Route to test insertions
    app.post('/insert', (req, res) => {
        const startTime = new Date();

        const dataToInsert = req.body; // assumes the request body is an array of objects to insert

        const query = 'INSERT INTO your_table SET ?';

        for (let i = 0; i < dataToInsert.length; i++) {
            connection.query(query, dataToInsert[i], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error inserting data');
                    return;
                }

                if (i === dataToInsert.length - 1) {
                    const endTime = new Date();
                    const elapsedTime = endTime - startTime;
                    console.log(`Inserted ${dataToInsert.length} rows in ${elapsedTime} ms`);
                    res.send(`Inserted ${dataToInsert.length} rows in ${elapsedTime} ms`);
                }
            });
        }
    });

    // Route to test GET requests
    app.get('/get', (req, res) => {
        const startTime = new Date();

        const query = `SELECT * FROM ${dbName}`;

        connection.query(query, (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error getting data');
                return;
            }

            const endTime = new Date();
            const elapsedTime = endTime - startTime;
            console.log(`Query: "SELECT * FROM ${dbName}". Got ${results.length} rows in ${elapsedTime} ms`);
            res.json({ message: `Query: "SELECT * FROM ${dbName}". Got ${results.length} rows in ${elapsedTime} ms`, result: results});
        });
    });
}