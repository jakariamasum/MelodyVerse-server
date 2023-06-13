const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('music school is running');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yzkj8ly.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const instructorsCollection = client.db("music-school").collection("instructors");
        const classesCollection = client.db("music-school").collection("classes");
        const studentsCollection = client.db("music-school").collection("students");
        const slectedCollection = client.db("music-school").collection("selected");
        const addClassCollection = client.db("music-school").collection("addClass");

        app.get('/instructors', async (req, res) => {
            const { sort } = req.query;
            if (sort) {
                const result = await instructorsCollection.find().sort({ availableSeats: -1 }).limit(6).toArray();
                res.send(result);
            }
            else {
                const result = await instructorsCollection.find().toArray();
                res.send(result);
            }
        })


        app.post('/classes', async (req, res) => {
            const info = req.body;
            const result = await classesCollection.insertOne(info);
            res.send(result);
        })

        app.get('/classes', async (req, res) => {
            const { sort } = req.query;
            if (sort) {
                const result = await classesCollection.find().sort({ availableSeats: -1 }).limit(6).toArray();
                res.send(result);
            }
            else {
                const result = await classesCollection.find().toArray();
                res.send(result);
            }
        })


        app.post('/students', async (req, res) => {
            const info = req.body;
            // console.log(info)
            const result = await studentsCollection.insertOne(info);
            res.send(result);
        })

        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const { role } = req.body;
            const filter = { _id: new ObjectId(id) };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    role: role
                },
            };
            const result = await studentsCollection.updateOne(filter, updateDoc);
            res.send(result)

        })

        app.get('/students', async (req, res) => {
            const { email } = req.query;
            // console.log('email',email)
            if (email) {
                const query = { email: email };
                const result = await studentsCollection.findOne(query);
                res.send(result)
            }
            else {
                const result = await studentsCollection.find().toArray();
                res.send(result)
            }
        })

        app.post('/selected', async (req, res) => {
            const info = req.body;
            console.log(info)
            const result = await slectedCollection.insertOne(info);
            res.send(result);
        })

        app.get('/selected', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await slectedCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/add-class', async (req, res) => {
            const info = req.body;
            const result = await addClassCollection.insertOne(info);
            res.send(result);
        })

        app.put('/add-class/:id', async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;
            const filter = { _id: new ObjectId(id) };
            // create a document that sets the plot of the movie
            const updateDoc = {
                $set: {
                    status: status
                },
            };
            const result = await addClassCollection.updateOne(filter, updateDoc);
            res.send(result)

        })

        app.get('/add-class', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await addClassCollection.find(query).toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('ok musing here')
}) 