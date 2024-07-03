import { ScanResponse } from "dynamoose/dist/ItemRetriever.js";
import PrinterModel from "../models/printer.model.js";
import {
  DynamoPrinterInterface,
  PrinterItem,
} from "../models/printer.interface.js";
import {
  IncommingPrinterInterface,
  printerGroup,
} from "./incommingPrinter.interface.js";

export class PrinterService {
  async getAllPrinters(): Promise<ScanResponse<PrinterItem>> {
    const query = PrinterModel.scan();
    // const query = PrinterModel.query("itemType").eq("printers").all()
    return await query.exec();
  }

  private addTimeStampAndGroup(
    printers: IncommingPrinterInterface[],
    groupName: string,
    timeStamp: number
  ): DynamoPrinterInterface[] {
    return printers.map((printer) => ({
      ...printer,
      updateTimeStamp: timeStamp,
      itemType: groupName,
    }));
  }

  /**
   *
   *  Splits a list into smaller chunks (slices) of a specified size.
   *
   * @param {Array} arrToDivide The array to be divided into chunks.
   * @param {number} chunkSize The maximum number of elements each chunk should contain.
   *
   * @returns {Array<Array>} A new array containing the chunks of the original array.
   */
  private splitArray(arrToDivide: Array<any>, chunkSize: number): Array<any> {
    let i = 0;
    const slices = [];

    // slice is segfault safe in case of index going over array length
    for (; i < arrToDivide.length; i += chunkSize)
      slices.push(arrToDivide.slice(i, i + chunkSize));
    return slices;
  }

  async batchUpsert(
    incommingPrinter: IncommingPrinterInterface[],
    groupName: string,
    timeStamp: number
  ): Promise<DynamoPrinterInterface[]> {
    const awsBatchLimit = 25;
    const dynamoPrinters = this.addTimeStampAndGroup(
      incommingPrinter,
      groupName,
      timeStamp
    );
    const slices = this.splitArray(dynamoPrinters, awsBatchLimit);

    let total = 0;

    for (const slice of slices) {
      await PrinterModel.batchPut(slice);
      total += slice.length;
      console.log("chunck size = " + total);
    }
    return dynamoPrinters;
  }

  // todo: figure out how to deal with unprocessed ID. --> ask Max ? 
  async batchDelete(idsToDelete: Array<string>) {
    const awsBatchLimit = 25;
    const slices = this.splitArray(idsToDelete, awsBatchLimit);
    let totalProcessedItem = 0;

    for (const slice of slices) {
      const unprocessedItem = (await PrinterModel.batchDelete(slice)).unprocessedItems
      totalProcessedItem += slice.length - unprocessedItem.length
    }
    console.log(`deleted ${totalProcessedItem} / ${idsToDelete.length}`);
  }

  async getZombiesId(groupName: printerGroup, timeStamp: number) {
    const zombies = await PrinterModel.query("itemType")
      .eq(groupName)
      .where("updateTimeStamp")
      .lt(timeStamp)
      .attributes(["id"])
      .exec();
    return zombies.map((zombie) => zombie.id);
  }

  async removeZombies(groupName: printerGroup, timeStamp: number) {

    const idsToRemove = await this.getZombiesId(groupName, timeStamp);
    await this.batchDelete(idsToRemove);
  }

  async updateDbWithFull(
    incommingPrinter: IncommingPrinterInterface[],
    groupName: printerGroup
  ) {

    // await dynamoose.transaction()
    const timeStamp = Date.now();
    const incommingPrinters = await this.batchUpsert(
      incommingPrinter,
      groupName,
      timeStamp
    );

    await this.removeZombies(groupName, timeStamp);
  }
}
