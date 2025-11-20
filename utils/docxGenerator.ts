import { DocxData } from '../types';

// These are loaded from CDN, so we declare them to satisfy TypeScript
declare const saveAs: any;
const DOCX_LOAD_TIMEOUT = 10000; // 10 seconds

/**
 * Checks if the docx library is available on the window object and waits for it if not.
 * @returns A promise that resolves when the library is loaded, or rejects on timeout.
 */
export const ensureDocxIsLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If library is already loaded, resolve immediately.
    if ((window as any).docx) {
      return resolve();
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if ((window as any).docx) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > DOCX_LOAD_TIMEOUT) {
        clearInterval(interval);
        reject(new Error("Loading the 'docx' library timed out. Check the CDN link and your internet connection."));
      }
    }, 100); // Check every 100ms
  });
};


export const exportToDocx = (data: DocxData) => {
  // Access the docx global from the window object.
  // The 'docx' library is loaded via a <script> tag in index.html.
  const docxGlobal = (window as any).docx;

  if (!docxGlobal) {
    // This is now a fallback, as ensureDocxIsLoaded should have caught this.
    console.error("The 'docx' library is not available on the window object. Check the CDN link in index.html.");
    alert("عذرًا، حدث خطأ أثناء تهيئة مُصدِّر المستندات. لا يمكن إنشاء الملف.");
    return;
  }
  
  const { 
    Document, 
    Packer, 
    Table, 
    TableRow, 
    TableCell, 
    Paragraph, 
    HeadingLevel, 
    WidthType, 
    BorderStyle, 
    AlignmentType 
  } = docxGlobal;

  const { fullName, rentalNumber, location, date, title, body } = data;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({
                                text: `الاسم الكامل: ${fullName}`,
                                alignment: AlignmentType.RIGHT,
                                style: "normalStyle",
                            })],
                        }),
                        new TableCell({
                            children: [new Paragraph({
                                text: `${location} في ${date}`,
                                alignment: AlignmentType.LEFT,
                                style: "normalStyle",
                            })],
                        }),
                    ],
                }),
            ],
          }),
          new Paragraph({
            text: `رقم التأجير: ${rentalNumber}`,
            alignment: AlignmentType.RIGHT,
            style: "normalStyle",
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }), // Spacer
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            style: "headingStyle",
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }), // Spacer
          ...body.split('\n').map(
            (p) =>
              new Paragraph({
                text: p,
                alignment: AlignmentType.JUSTIFIED,
                style: "normalStyle",
                spacing: { after: 150 },
              })
          ),
        ],
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: "normalStyle",
          name: "Normal",
          run: {
            font: "Arial",
            size: 24, // 12pt
          },
        },
        {
            id: "headingStyle",
            name: "Heading",
            basedOn: "Normal",
            run: {
              bold: true,
              size: 32, // 16pt
              font: "Arial",
            },
          },
      ],
    },
  });

  Packer.toBlob(doc).then((blob: Blob) => {
    saveAs(blob, "report.docx");
  });
};