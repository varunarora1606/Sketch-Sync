import dotenv from "dotenv";
import os from "os";
import cluster from "cluster";
dotenv.config({
  path: "./.env",
});
import { app } from "./app";

// const totalCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Number of CPUs is ${totalCPUs}`);
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     console.log("Let's fork another worker!");
//     cluster.fork();
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
// }
app.listen(process.env.PORT || 8000, () => {
  console.log("Server is listening on port: " + process.env.PORT);
});
