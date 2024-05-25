import express from "express"; 
import connectDB from "./mongodb/connect.js";
import cors from "cors"; 
import * as dotenv from "dotenv";
import helmet from "helmet"; 
import router from "./routes/index.js";

dotenv.config(); 
const app = express(); 
app.use(express.json()); 
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
app.use(cors()); 

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/train", router); 

const PORT = process.env.PORT || 6001; 

const startServer = async () => {
  try {
      connectDB(process.env.MONGO_URL, () => {
      console.log("MongoDB connected, starting server...");
      app.listen(PORT, () => console.log("Server started on port http://localhost:8080")
      );
    });
  } catch (error) {
      console.log(error);
  }
};
startServer();