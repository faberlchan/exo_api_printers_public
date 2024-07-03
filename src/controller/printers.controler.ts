import express, { Response, Request } from "express";
import { PrinterService } from "../service/printers.service.js";

export class PrinterController {
  router: express.Router;
  printerService: PrinterService;

  constructor() {
    this.router = express.Router();
    this.printerService = new PrinterService();
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get("/printer/all", this.getAllPrinters);
    this.router.post("/printer/upsertMany", this.upsertMany);
  }

  private getAllPrinters = async (req: Request, res: Response) => {
    try {
      const all = await this.printerService.getAllPrinters();
      return res.status(200).json(all);
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  };

  private upsertMany = async (req: Request, res: Response) => {
    try {
      const incommingPrinter = req.body
      // const upsertedItem = await this.printerService.batchUpsert(incommingPrinter, "printer", Date.now());
      const upsertedItem = null
      await this.printerService.updateDbWithFull(incommingPrinter, 'printers')
      return res.status(200).json(upsertedItem);
    } catch (e) {
      return res.status(500).json({ message: e });
    }
  };

}
