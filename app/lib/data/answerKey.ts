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

// Original RegExp for reference, to be replaced by correctTriadNotes for grading
/*
export const correctTriads: RegExp[] = [
  /^df#a$/,
  /^f#a#c#$/,
  /^db(?:e|fb)ab$/,
  /^f#ac#$/,
  /^ebgb(?:a|bbb)$/,
  /^eg#(?:b#|c)$/,
];
*/

// New array with comma-separated notes for triad grading
export const correctTriadNotes: string[] = [
  "d, f#, a", // Corresponds to /^df#a$/
  "f#, a#, c#", // Corresponds to /^f#a#c#$/
  "db, fb, ab", // Corresponds to /^db(?:e|fb)ab$/, choosing Fb
  "f#, a, c#", // Corresponds to /^f#ac#$/ (F# minor)
  "eb, gb, bbb", // Corresponds to /^ebgb(?:a|bbb)$/, choosing Bbb (Eb minor)
  "e, g#, b#", // Corresponds to /^eg#(?:b#|c)$/, choosing B# (E augmented)
];

export const correctNonRegexTriads = [
  "Dmaj",
  "F#maj",
  "Bbm", // Note: Original regex was for Db-based chord, this name is Bb minor.
  // The notes "db, fb, ab" represent Db minor.
  "F#m", // Changed from "F#maj" to "F#m" to match notes "f#, a, c#"
  "Ebm", // The notes "eb, gb, bbb" represent Eb minor.
  "Eaug", // Changed from "Em" to "Eaug" to match notes "e, g#, b#"
];

// Original RegExp for reference, to be replaced by correctSeventhChordNotationNotesText for grading
/*
export const correct7thChordNotationAnswers = [
  /^eg#bd#$/,
  /^gbbdf$/,
  /^dbfab(?:b|cb)$/,
  /^d#f#ac$/,
  /^dfabc$/,
  /^gbbbd(?:fb|e)$/,
  /^ebgbbbd$/,
];
*/

// New array with comma-separated notes for seventh chord notation grading
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
  /^(E#)(?:dim7|°7|o7)$/,
  /^(F)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/,
  /^(G)(?:-∆|m∆|m∆7|min[Mm]aj7|mi[Mm]aj7|m[Mm]aj7|-maj7|-Maj7)$/,
  /^(B7)$/,
  /^(F#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/,
  /^(Ab)(?:-7|min7|mi7|m7)$/,
  /^(D)(?:\+7|7#5|7\(#5\)|[Aa]ug7|)$/,
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
  //1
  /^(D)(?:-7|min7|mi7|m7)$/,
  /^(G7)$/,
  /^(C)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/,
  //2
  /^(F#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/,
  /^(B7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/,
  /^(E)(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/,
  //3
  /^(Eb)(?:-7|min7|mi7|m7)$/,
  /^(Ab7)$/,
  /^(Db)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/,
  //4
  /^(D#)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/,
  /^(G#7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/,
  /^(C#)(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/,
  //5
  /^(E#)(?:-7|min7|mi7|m7)$/,
  /^(A#7)$/,
  /^(D#)(?:∆|∆7|[Mm]aj7|[Mm]a7)$/,
  //6
  /^(Ab)(?:ø|ø7|-7b5|m7b5|min7b5|mi7b5)$/,
  /^(Db7)(?:\(?b9\)?|\(?#9b9\)?|\(?b9#9\)?|\(?b13\)?|\(?alt\)?|\(?b13b9\)?|\(?b9b13\)?|\(?b13#9b9\)?||\(?b13b9#9\)?|\(?#9b9b13\)?|\(?b9#9b13\)?|\(?#9b13\)?)$/,
  /^(Gb)(?:-7|min7|mi7|m7|m6|mi6|min6|-6)$/,
];

export const correctProgressionNonRegexAnswers = [
  "D-7 G7 C∆",
  "F#ø B7 E-7",
  "Eb-7 Ab7 Db∆",
  "D#ø G#7 C#-7",
  "E#-7 A#7 D#∆",
  "Abø Db7 Gb-7",
];
