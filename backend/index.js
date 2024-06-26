const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const rootRouter = require("./routes/index")


main()
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Paytm");
}

app.use(cors())
app.use(express.json())
app.use("/api/v1",rootRouter)


app.listen("3000", () => {
  console.log("Server Listening on port 3000");
});
