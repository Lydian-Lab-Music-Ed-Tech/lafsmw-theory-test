import { handleKeySigInteraction } from "../handleKeySigInteraction";
import { ButtonStates, GlyphProps, NotesAndCoordinatesData } from "../types";

// Mock the dependencies
jest.mock("../modifyNotesAndCoordinates", () => ({
  removeAccidentalFromNotesAndCoords: jest.fn((coords, foundNote) => coords),
  updateNotesAndCoordsWithAccidental: jest.fn(
    (buttonState, foundNote, coords) => coords
  ),
}));

describe("handleKeySigInteraction", () => {
  const mockSetGlyphState = jest.fn();
  const mockSetKeySigState = jest.fn();
  const mockStave = {
    getNoteStartX: jest.fn(() => 50),
  } as any; // Mock stave object

  const mockNotesAndCoordinates: NotesAndCoordinatesData[] = [
    {
      note: "F",
      originalNote: "F",
      yCoordinateMin: 100,
      yCoordinateMax: 120,
    },
  ];

  const mockFoundNoteData: NotesAndCoordinatesData = {
    note: "F",
    originalNote: "F",
    yCoordinateMin: 100,
    yCoordinateMax: 120,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Adding accidentals", () => {
    test("should add sharp accidental and return correct updatedKeySig", () => {
      const buttonState: ButtonStates = {
        isSharpActive: true,
        isFlatActive: false,
        isEraseAccidentalActive: false,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      const initialKeySig = ["C#", "G#"];
      const initialGlyphs: GlyphProps[] = [];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData,
        110, // yClick
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should return updated key signature with F# added
      expect(result.updatedKeySig).toEqual(["C#", "G#", "F#"]);

      // Should have called the state setters
      expect(mockSetGlyphState).toHaveBeenCalled();
      expect(mockSetKeySigState).toHaveBeenCalledWith(["C#", "G#", "F#"]);
    });

    test("should replace existing accidental when adding new one to same note", () => {
      const buttonState: ButtonStates = {
        isSharpActive: false,
        isFlatActive: true,
        isEraseAccidentalActive: false,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      const initialKeySig = ["C#", "F#", "G#"]; // F already has sharp
      const initialGlyphs: GlyphProps[] = [];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData,
        110, // yClick
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should replace F# with Fb
      expect(result.updatedKeySig).toEqual(["C#", "G#", "Fb"]);
    });
  });

  describe("Erasing accidentals", () => {
    test("should erase accidental and return correct updatedKeySig", () => {
      const buttonState: ButtonStates = {
        isSharpActive: false,
        isFlatActive: false,
        isEraseAccidentalActive: true,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      const initialKeySig = ["C#", "F#", "G#"];
      const initialGlyphs: GlyphProps[] = [
        { xPosition: 50, yPosition: 110, glyph: "accidentalSharp" },
        { xPosition: 100, yPosition: 110, glyph: "accidentalSharp" },
        { xPosition: 150, yPosition: 110, glyph: "accidentalSharp" },
      ];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData,
        110, // yClick
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should remove F# from key signature
      expect(result.updatedKeySig).toEqual(["C#", "G#"]);

      // Should have called the state setters with the correct glyph array (removing index 1)
      const expectedGlyphs = [
        { xPosition: 50, yPosition: 110, glyph: "accidentalSharp" },
        { xPosition: 150, yPosition: 110, glyph: "accidentalSharp" },
      ];
      expect(mockSetGlyphState).toHaveBeenCalledWith(expectedGlyphs);
      expect(mockSetKeySigState).toHaveBeenCalledWith(["C#", "G#"]);
    });

    test("should handle erasing when note is not in key signature", () => {
      const buttonState: ButtonStates = {
        isSharpActive: false,
        isFlatActive: false,
        isEraseAccidentalActive: true,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      const initialKeySig = ["C#", "G#"]; // F is not in the key signature
      const initialGlyphs: GlyphProps[] = [];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData,
        110, // yClick
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should return the same key signature since F wasn't there
      expect(result.updatedKeySig).toEqual(["C#", "G#"]);
    });

    test("should erase only the specific accidental, not all accidentals of same type", () => {
      const buttonState: ButtonStates = {
        isSharpActive: false,
        isFlatActive: false,
        isEraseAccidentalActive: true,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      // Key signature with multiple sharps - we want to erase F# (index 1)
      const initialKeySig = ["C#", "F#", "G#", "D#"];
      const initialGlyphs: GlyphProps[] = [
        { xPosition: 50, yPosition: 100, glyph: "accidentalSharp" }, // C#
        { xPosition: 65, yPosition: 120, glyph: "accidentalSharp" }, // F#
        { xPosition: 80, yPosition: 110, glyph: "accidentalSharp" }, // G#
        { xPosition: 95, yPosition: 130, glyph: "accidentalSharp" }, // D#
      ];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData, // This represents F note
        120, // yClick - clicking on F#
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should remove only F# from key signature, leaving other sharps intact
      expect(result.updatedKeySig).toEqual(["C#", "G#", "D#"]);

      // Should remove only the F# glyph (index 1), leaving others intact
      const expectedGlyphs = [
        { xPosition: 50, yPosition: 100, glyph: "accidentalSharp" }, // C#
        { xPosition: 80, yPosition: 110, glyph: "accidentalSharp" }, // G#
        { xPosition: 95, yPosition: 130, glyph: "accidentalSharp" }, // D#
      ];
      expect(mockSetGlyphState).toHaveBeenCalledWith(expectedGlyphs);
    });
  });

  describe("No action", () => {
    test("should return original keySig when no button is active", () => {
      const buttonState: ButtonStates = {
        isSharpActive: false,
        isFlatActive: false,
        isEraseAccidentalActive: false,
        isEnterNoteActive: false,
        isEraseNoteActive: false,
      };

      const initialKeySig = ["C#", "F#", "G#"];
      const initialGlyphs: GlyphProps[] = [];

      const result = handleKeySigInteraction(
        mockNotesAndCoordinates,
        buttonState,
        mockFoundNoteData,
        110, // yClick
        mockSetGlyphState,
        initialGlyphs,
        mockSetKeySigState,
        initialKeySig,
        mockStave
      );

      // Should return the original key signature unchanged
      expect(result.updatedKeySig).toEqual(["C#", "F#", "G#"]);
    });
  });
});
