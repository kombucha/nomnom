export const readFileAsText = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = ev => resolve(ev.target.result);
    reader.readAsText(file);
  });

export default { readFileAsText };
