import { Item } from "dynamoose/dist/Item.js";
import { IncommingPrinterInterface } from "../service/incommingPrinter.interface.js";

export interface DynamoPrinterInterface extends IncommingPrinterInterface {
  updateTimeStamp: number;
  itemType: string;
}

export interface PrinterItem extends Item, DynamoPrinterInterface {}
