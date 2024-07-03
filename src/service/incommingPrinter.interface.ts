export interface IncommingPrinterInterface {
  id: string;
  label: string;
  storeId: string;
  storeLabel: string;
  type: string;
}

export type printerGroup = "printer" | "printers"