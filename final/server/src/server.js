import express from "express";
import cors from "cors";
import {ObjectId} from "mongodb";
import {db} from "./mongo";
import bodyParser from "body-parser";

console.log("express start..");

const app = express();
app.use(cors());
app.use( bodyParser.json() );

//https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md
if (global.__coverage__) {
    console.log("backend coverage enabled");
    require("@cypress/code-coverage/middleware/express")(app);
}
const port = process.env.NODE_ENV === "production" ? 80 : 8080;

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.get('/listBoat', async (req, res) => {
    res.send(await db().collection("TheBoat").find().toArray())
})
app.post('/addBoat', async (req, res) => {
    console.log("addBoat, body: ",req.body);
    await db().collection("TheBoat").insertOne({name: req.body.name})
    res.send({success:true})
})
app.post('/setCaptain', async (req, res) => {
    const  filter = {_id: ObjectId(req.body.boatId)};
    const boat = await db().collection("TheBoat").findOne(filter);
    let updatedBoat = {...boat, captain: req.body.captain};
    await db().collection("TheBoat").replaceOne(filter, updatedBoat)
    res.send({success:true})
})

app.post('/delete', async (req, res) => {
    console.log("delete, body: ",req.body);
    await db().collection("TheBoat").deleteOne({_id: ObjectId(req.body._id)})
    res.send({success:true})
})

app.listen(port, async () => {
    // eslint-disable-next-line no-undef
    console.info("🚀 Server ready at " + port);
});

