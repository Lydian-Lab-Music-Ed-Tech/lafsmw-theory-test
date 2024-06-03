export default function convertObjectToChordChart(
  inputObject: any,
  beatsPerBar = 4,
  numBarsPerLine = 4
) {
  const totalLength = Object.keys(inputObject).length;
  const numBars = totalLength / beatsPerBar;
  const numLines = Math.ceil(numBars / numBarsPerLine);

  // Initialize an array with empty strings for the total length
  const outputArray = Array.from(
    { length: totalLength },
    (_, i) => inputObject[i] || ""
  );

  let result = "";

  for (let i = 0; i < numLines; i++) {
    for (let j = 0; j < numBarsPerLine; j++) {
      const start = i * numBarsPerLine * beatsPerBar + j * beatsPerBar;
      const end = start + beatsPerBar;
      if (start < totalLength) {
        const bar = outputArray
          .slice(start, end)
          .map((chord) => chord.padEnd(2, "-"))
          .join("");
        result += `|-${bar.padEnd(beatsPerBar * 2 - 1, "-")}`;
      }
    }
    result += "|\n";
  }

  return result;
}
