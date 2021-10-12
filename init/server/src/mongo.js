import {Db, MongoClient} from "mongodb";

const dbName = "tortuga";

export let mangoClient = undefined;
export let mangoDb = undefined;
let url = "mongodb://localhost:27017";

if (process.env.NODE_ENV === "production" && !process.env.LOCAL_DB) {
    let credential;
    if (process.env.mongodb)
        credential = JSON.parse(Buffer.from(process.env.mongodb, "base64").toString("ascii"));
    else
        credential = require("../mongodb.secure.json");
    url = "mongodb+srv://" + credential.user + ":" + credential.password + "@" + credential.dbName + "/?retryWrites=true&w=majority";
}
console.info("mongodbUrl: ", url);

MongoClient.connect(url, {useUnifiedTopology: true}, async function (err, client) {
    if (err) throw err;

    mangoClient = client;
    mangoDb = client.db(dbName);

    await mangoDb.command({
        ping: 1
    });
    // console.log("db status: ", await mangoDb.command({
    //   connectionStatus : 1
    // }));
    // db.on('close', () => { console.log('-> lost connection'); });
    // db.on('reconnect', () => { console.log('-> reconnected'); });

    console.info("Index: ", [
        await mangoDb.collection("TheBoat").createIndex({boatId: 1}),
        await mangoDb.collection("TheCaptain").createIndex({captainId: 1}),
    ]);
    console.info("Mangodb connected");
});

export const db = () => {
    mangoDb.command({
      connectionStatus : 1
    }).then(status =>{
        // console.log("db status: ",status);
    });
    // console.log("db status: ",mangoClient.db("admin").serverStatus().connections);
    return mangoDb;
};

export const connect = () => {
    if (mangoClient)
        return mangoClient.db(dbName);
};
