import VexFlow from "vexflow";
import createBlankStaves from "./createBlankStaves";
import { RenderStavesAndNotesParams, BlankStaves } from "./types";
const { Formatter, TickContext } = VexFlow.Flow;

export const setupRendererAndDrawNotes = (
  params: RenderStavesAndNotesParams
): BlankStaves => {
  const {
    rendererRef,
    font,
    fontSize,
    numStaves,
    rendererWidth,
    rendererHeight,
    yPositionOfStaves,
    xPositionOfStaves,
    chosenClef,
    firstStaveWidth,
    keySig,
    setStaves,
    scaleDataMatrix,
    staves,
  } = params;

  const renderer = rendererRef?.current;
  renderer?.resize(rendererWidth, rendererHeight);
  const context = renderer && renderer.getContext();
  context?.setFont(font, fontSize * 1.5);
  context?.clear();
  let newStaves: BlankStaves = [];

  if (context && rendererRef) {
    newStaves = createBlankStaves({
      numStaves,
      context,
      firstStaveWidth,
      x: xPositionOfStaves,
      y: yPositionOfStaves,
      regularStaveWidth: 300,
      chosenClef,
      keySig,
    });
    setStaves(newStaves);
  }

  if (!scaleDataMatrix) return newStaves;

  // Draw each stave
  if (newStaves && context) {
    newStaves.forEach((stave) => {
      stave.setContext(context).draw();
    });
  }

  // Draw notes at their exact positions instead of using the formatter
  scaleDataMatrix.forEach((barOfNoteObjects, index) => {
    if (barOfNoteObjects && barOfNoteObjects.length > 0 && context) {
      const currentStave = staves[index] || newStaves[index];

      barOfNoteObjects.forEach((noteObj) => {
        console.log("noteObj from forEach:", noteObj);
        
        // CRITICAL FIX: Enhance accidental detection and rendering
        // Check if the note has an accidental in its key name - use a more precise pattern
        // Fix the special case of 'b/4' (B natural) vs 'bb/4' (B flat)
        const keyName = noteObj.keys?.[0] || '';
        const hasSharp = keyName.includes('#');
        
        // For flats, we need to distinguish between 'b/4' (B natural) and 'bb/4' (B flat)
        // A flat is only present if the lowercase 'b' is not the first character of the key part
        const keyPart = keyName.split('/')[0]; // Get just the note name without octave
        const hasFlat = keyPart.includes('b') && (keyPart !== 'b'); // True for 'bb/4', 'ab/4', etc., False for 'b/4'
        
        const hasAccidental = hasSharp || hasFlat;
        console.log(`Note ${keyName} - hasSharp: ${hasSharp}, hasFlat: ${hasFlat}, hasAccidental: ${hasAccidental}`);
        
        if (noteObj.staveNote) {
          noteObj.staveNote.setStave(currentStave);
          noteObj.staveNote.setContext(context);
          
          // CRITICAL FIX: Ensure accidentals are properly added to the staveNote
          // We need to re-add accidentals manually if they exist in the key name
          if (hasAccidental) {
            // Extract the accidental symbol from the key name
            let accidentalSymbol = '';
            if (hasSharp) {
              accidentalSymbol = '#';
            } else if (hasFlat) {
              accidentalSymbol = 'b';
            }
            
            if (accidentalSymbol) {
              console.log(`Ensuring accidental ${accidentalSymbol} is visible on note ${keyName}`);
              
              // Create a new accidental modifier and add it to the staveNote
              // This ensures the accidental will be visible when the note is drawn
              const accidentalModifier = new VexFlow.Flow.Accidental(accidentalSymbol);
              
              // Check if this note already has an accidental (avoid duplicates)
              const existingAccidentals = noteObj.staveNote.getModifiers();
              const hasExistingAccidental = existingAccidentals.some(
                mod => mod.getCategory() === 'accidentals'
              );
              
              if (!hasExistingAccidental) {
                console.log(`Adding accidental ${accidentalSymbol} to note ${keyName}`);
                noteObj.staveNote.addModifier(accidentalModifier, 0);
              }
            }
          }
          
          // Position and draw the note at the exact click position
          if (noteObj.exactX) {
            // Create a separate tick context for each note to prevent them from affecting each other
            const tickContext = new TickContext();
            tickContext.addTickable(noteObj.staveNote);

            // Prevent the tick context from doing any formatting that might move notes
            tickContext.preFormat();
            tickContext.setPadding(0); // Set padding to 0 to prevent spacing adjustments

            // Offset correction to align the note with the click position
            const offsetCorrection = -60;

            // Set the x position of the tick context to the exact stored position with offset correction
            tickContext.setX(noteObj.exactX + offsetCorrection);

            noteObj.staveNote.draw();
          } else {
            // If all else fails, use the formatter for notes without exact positions
            Formatter.FormatAndDraw(context, currentStave, [noteObj.staveNote]);
          }
        }
      });
    }
  });

  return newStaves;
};
