// TODO: Install qrcode package when QR functionality is needed
// import QRCode from "qrcode";

export const generateQRDataUrl = async (url: string): Promise<string> => {
  // Placeholder implementation - returns a simple SVG QR code placeholder
  if (process.env.NODE_ENV === "development") {
    console.warn("[QR] QRCode package not installed. Using placeholder.");
  }
  // Return a data URL for a placeholder image
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150">
      <rect fill="#ffffff" width="150" height="150"/>
      <rect fill="#000000" x="10" y="10" width="40" height="40"/>
      <rect fill="#000000" x="100" y="10" width="40" height="40"/>
      <rect fill="#000000" x="10" y="100" width="40" height="40"/>
      <text x="75" y="85" text-anchor="middle" font-size="12">QR: ${url.slice(0, 20)}...</text>
    </svg>
  `)}`;
};


