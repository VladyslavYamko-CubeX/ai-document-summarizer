const textExtensions = ["txt", "md"];

function getExtension(name: string) {
  return name.split(".").pop()?.toLowerCase();
}

async function readPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const textDecoder = new TextDecoder();
  return textDecoder.decode(buffer);
}

export async function readFileContent(file: File): Promise<string> {
  const ext = getExtension(file.name);
  if (!ext) {
    throw new Error("Unsupported file type. Use .txt or .md.");
  }

  if (textExtensions.includes(ext)) {
    return file.text();
  }

  if (ext === "pdf") {
    return readPdf(file);
  }

  throw new Error("Only .txt, .md, or simple .pdf files are supported.");
}
