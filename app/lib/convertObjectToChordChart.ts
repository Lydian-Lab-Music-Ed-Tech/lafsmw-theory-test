import { InputData } from "./types";

export default function convertObjectToChordChart(inputObject: InputData) {
  const numBars = 12;
  const beatsPerBar = 4;
  const totalNumBeats = 48;
  const numLines = 3;
  const numBarsPerLine = numBars / numLines;

  const outputArray = Array.from(
    { length: totalNumBeats },
    (_, i) => inputObject[i] || ""
  );

  let result = "";

  for (let line = 0; line < numLines; line++) {
    for (let bar = 0; bar < numBarsPerLine; bar++) {
      const start = line * numBarsPerLine * beatsPerBar + bar * beatsPerBar;
      const end = start + beatsPerBar;
      if (start < totalNumBeats) {
        const bar = outputArray
          .slice(start, end)
          .map((chord) => chord.padEnd(6, "-"))
          .join("");
        result += `|-${bar.padEnd(beatsPerBar * 2 - 1, "-")}`;
      }
    }
    if (line < numLines - 1) {
      result += "|<br />";
    }
  }

  return result.slice(0, -1) + "||";
}
