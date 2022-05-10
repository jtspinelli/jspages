interface ClipboardItem {
    readonly types: readonly string[];
    readonly presentationStyle: "unspecified" | "inline" | "attachment";
    getType(): Promise<Blob>;
  }
  
  interface ClipboardItemData {
    [mimeType: string]: Blob | string | Promise<Blob | string>;
  }
  
  declare var ClipboardItem: {
    prototype: ClipboardItem;
    new (itemData: ClipboardItemData): ClipboardItem;
  };