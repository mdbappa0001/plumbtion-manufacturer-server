//1
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

//3
const cors = require('cors')
require('dotenv').config()

//4
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akda9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db("plumbtion-manufacturer").collection("tools");
        const reviewsCollection = client.db("plumbtion-manufacturer").collection("reviews");
        const ordersCollection = client.db("plumbtion-manufacturer").collection("orders");

        //8 get tool 
        app.get('/tool', async (req, res) => {
            const query = {}
            const tools = await toolsCollection.find(query).toArray()
            res.send(tools)
        })

         //9 get single tool 
         app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolsCollection.findOne(query)
            res.send(tool)
        })

          //23 add tool (pipes)
          app.post('/tool', verifyJWT, verifyAdmin, async (req, res) => {
            const pipe = req.body
            const result = await toolsCollection.insertOne(pipe)
            res.send(result)
        })

        //24 delete product (pipe) 
        app.delete('/tool/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const tools = await toolsCollection.deleteOne(query)
            res.send(tools)
        })

        //11 available tool (pipe) update
        app.put('/tool/:id', async (req, res) => {
            const id = req.params.id
            const updateTool = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    available: updateTool.available,
                },
            };
            const result = await toolsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

          // ***    Order        **//

        //10 get orders
        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })

           // ***    Review        **//

        //21 get reviews 
        app.get('/review', async (req, res) => {
            const query = {}
            const reviews = await reviewsCollection.find(query).toArray()
            res.send(reviews)
        })

        //22 post reviews
        app.post('/review', verifyJWT, async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        //34 delete review
        app.delete('/review/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id
            const filter = { _id : ObjectId(id) }
            const result = await reviewsCollection.deleteOne(filter)
            res.send(result)
        })


    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello From Plumbkin Manufacture')
})

app.listen(port, () => {
    console.log(`Plumbkin Manufacture Listening On Port ${port}`);
})