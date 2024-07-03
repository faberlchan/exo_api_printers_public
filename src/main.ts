import dynamoose from "dynamoose";
import express from "express";
import { PrinterController } from "./controller/printers.controler.js";
import PrinterModel from "./models/printer.model.js";

async function main() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const printerControler = new PrinterController();

  dynamoose.aws.ddb.local("http://localhost:4566");
  const DynamoTable = new dynamoose.Table("0002testTable", [PrinterModel]);

  app.use(express.json({ limit: "1mb" }));
  app.listen(PORT, () => console.log("currently listening to port " + PORT));
  app.use(printerControler.router);

  console.log("haskkey = " + DynamoTable.hashKey)
  console.log("rangekey = " + DynamoTable.rangeKey)

  try {
    await DynamoTable.create();
    console.log("Sucessfully created table");
  } catch (e) {
    console.log("error while creating table : " + e);
  }
}

main().catch();
