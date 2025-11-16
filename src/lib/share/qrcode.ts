import QRCode from "qrcode";

export const generateQRDataUrl = async (url: string): Promise<string> => {
  return await QRCode.toDataURL(url, {
    width: 150,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
};


