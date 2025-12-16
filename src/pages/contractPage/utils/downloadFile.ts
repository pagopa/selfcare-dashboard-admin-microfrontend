export const downloadBase64File = (
  base64: string,
  mime: string,
  filename: string
) => {
  const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([byteArray], { type: mime });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
};