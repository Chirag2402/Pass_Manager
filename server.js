const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if unable to connect
});

// Routes
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.status(200).json(findResult);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
});

app.post('/', async (req, res) => {
    try {
        const data = req.body;

        if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
            return res.status(400).json({ success: false, message: 'Invalid request body' });
        }

        const db = client.db(dbName);
        const collection = db.collection('passwords');

        let result;
        if (Array.isArray(data)) {
            // Insert multiple documents
            result = await collection.insertMany(data);
        } else {
            // Insert a single document
            result = await collection.insertOne(data);
        }

        res.status(201).json({ success: true, result });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'Failed to insert data' });
    }
});

app.delete('/', async (req, res) => {
    try {
        const filter = req.body;

        if (!filter || (Array.isArray(filter) && filter.length === 0) || (!Array.isArray(filter) && Object.keys(filter).length === 0)) {
            return res.status(400).json({ success: false, message: 'Invalid request body' });
        }

        const db = client.db(dbName);
        const collection = db.collection('passwords');

        let result;
        if (Array.isArray(filter)) {
            // Delete multiple documents
            const deleteResults = await Promise.all(
                filter.map(async (condition) => collection.deleteOne(condition))
            );
            const deletedCount = deleteResults.reduce((sum, res) => sum + res.deletedCount, 0);
            result = { deletedCount };
        } else {
            // Delete a single document
            result = await collection.deleteOne(filter);
        }

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No document found to delete' });
        }

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ success: false, message: 'Failed to delete data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
