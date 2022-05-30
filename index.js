const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT||5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zat3w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
    await client.connect()
    const doctorCollection = client.db("allDoctors").collection("doctor");

    // get the all doctors
    app.get('/doctors',async(req,res)=>{
        const doctors = await doctorCollection.find().toArray();
        res.send(doctors)
    })
    // add a doctor in database
    app.post('/addDoctor',async(req,res)=>{
        const doctorDetail = req.body;
        const addDoctor = await doctorCollection.insertOne(doctorDetail);
        res.send(addDoctor)
    })

    // update the doctor 
    app.put('/updateDoctor/:id',async(req,res)=>{
        const id = req.params.id;
        const doctorDetail = req.body
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
            $set: {
                doctorName: doctorDetail.doctorName,
                doctorEmail: doctorDetail.doctorEmail,
                doctorNumber: doctorDetail.doctorNumber,
                image: doctorDetail.image
            },
          };
          const updateDoctor = await doctorCollection.updateOne(filter, updateDoc);
          res.send(updateDoctor)
    })
    // delete Doctor
    app.delete('/deleteDoctor/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const deleteDoctor= await doctorCollection.deleteOne(query);
        res.send(deleteDoctor)
    })
}
finally{
    // client.close();
}
}
run().catch(console.dir())

app.get('/', (req, res) => {
  res.send('Hello World! from doctor')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})