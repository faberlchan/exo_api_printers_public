import dynamoose from "dynamoose";
import { PrinterItem } from "./printer.interface.js";

const schema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
  },
  label: {
    type: String,
    // index: true
  },
  storeId: {
    type: String,
    index: true,
  },
  storeLabel: {
    type: String,
    index: true,
  },
  type: {
    type: String,
    // index: true
  },
  updateTimeStamp: {
    type: Number,
    // rangeKey: true,
  },
  itemType: {
    type: String,
    index: {
      rangeKey: "updateTimeStamp",
    },
  },
});

const PrinterModel = dynamoose.model<PrinterItem>("printers", schema);

export default PrinterModel;