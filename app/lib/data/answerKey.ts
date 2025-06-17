const keySignatureDbMajor = ["bb", "eb", "ab", "db", "gb"];
const keySignatureFSharp = ["f#", "c#", "g#", "d#", "a#", "e#"];
const keySignatureGminor = ["bb", "eb"];
const keySignatureGSharpMinor = ["f#", "c#", "g#", "d#", "a#"];

export const correctKeySigNotationAnswers = [
  keySignatureDbMajor,
  keySignatureFSharp,
  keySignatureGminor,
  keySignatureGSharpMinor,
];

export const correctKeySigAnswers = ["db", "a", "f", "c#"];

const scaleDbMajor = ["db", "eb", "f", "gb", "ab", "bb", "c"];
const scaleBMajor = ["b", "c#", "d#", "e", "f#", "g#", "a#"];
const scaleCDorian = ["c", "d", "eb", "f", "g", "a", "bb"];
const scaleFSharpDorian = ["f#", "g#", "a", "b", "c#", "d#", "e"];
const scaleBbMixolydian = ["bb", "c", "d", "eb", "f", "g", "ab"];
const scaleCSharpMixolydian = ["c#", "d#", "e#", "f#", "g#", "a#", "b"];

export const correctScalesAnswers = [
  scaleDbMajor,
  scaleBMajor,
  scaleCDorian,
  scaleFSharpDorian,
  scaleBbMixolydian,
  scaleCSharpMixolydian,
];

export const correctTriadNotes: string[] = [
  "d, f#, a", // RegExp /^df#a$/
  "f#, a#, c#", // RegExp /^f#a#c#$/
  "db, fb, ab", // RegExp /^db(?:e|fb)ab$/
  "f#, a, c#", // RegExp /^f#ac#$/
  "eb, gb, bbb", // RegExp /^ebgb(?:a|bbb)$/
  "e, g#, b#", // RegExp /^eg#(?:b#|c)$/
];

export const correctSeventhChordNotationNotesText: string[] = [
  "e, g#, b, d#",
  "g, bb, d, f",
  "db, f, ab, cb",
  "d#, f#, a, c",
  "d, f, ab, c",
  "gb, bb, d, fb",
  "eb, gb, bb, d",
];

export const correctSeventhChordAnswers = [
  /^([Ee]#)(?:dim7|°7|o7)$/i,
  /^([Ff])(?:∆|∆7|[Mm]aj7|[Mm]a7)$/i,
  /^([Gg])(?:-∆|m∆|m∆7|min\(maj7\)|min[Mm]aj7|mi[Mm]aj7|m[Mm]aj7|-maj7|-Maj7|Gmin\(maj7\))$/i,
  /^([Bb]7)$/i,
  /^([Ff]#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/i,
  /^([Aa]b)(?:-7|min7|mi7|m7)$/i,
  /^([Dd])(?:\+7|7\+|7#5|7\(#5\)|[Aa]ug7|)$/i,
];

export const correctSeventhChordNonRegexAnswers: string[] = [
  "E#dim7", // E# diminished 7
  "F∆", // F major 7
  "G-∆", // G minor major 7
  "B7", // B dominant 7
  "F#ø", // F# half-diminished 7
  "Ab-7", // Ab minor 7
  "D+7", // D augmented 7
];

export const correctProgressionAnswers = [
  //2 - First actual test question
  /^([Ee]#)(?:-7|min7|mi7|m7)$/i,
  /^([Aa]#7)$/i,
  /^([Dd]#)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/i,
  //3
  /^([Ee]b)(?:-7|min7|mi7|m7)$/i,
  /^([Aa]b7)$/i,
  /^([Dd]b)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/i,
  //4
  /^([Dd]#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/i,
  /^([Gg]#7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/i,
  /^([Cc]#)(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/i,
  //5
  /^([Ff]#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/i,
  /^([Bb]7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/i,
  /^([Ee])(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/i,
  //6
  /^([Aa]b)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/i,
  /^([Dd]b7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/i,
  /^([Gg]b)(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/i,
];

// Actual test answers that are counted in student score (not including C Major examples)
export const correctProgressionNonRegexAnswers = [
  "E#-7 A#7 D#∆",
  "Eb-7 Ab7 Db∆",
  "D#ø G#7 C#-7",
  "F#ø B7 E-7",
  "Abø Db7 Gb-7",
];
