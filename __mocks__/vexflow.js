// __mocks__/vexflow.js
const resize = jest.fn();
const getContext = jest.fn().mockReturnValue({
  setFont: jest.fn(),
});

const Renderer = jest.fn().mockImplementation(() => ({
  resize,
  getContext,
}));

Renderer.Backends = {
  SVG: "svg",
};

const Stave = jest.fn().mockImplementation(() => ({
  addClef: jest.fn().mockReturnThis(),
  addTimeSignature: jest.fn().mockReturnThis(),
  setEndBarType: jest.fn().mockReturnThis(),
  setContext: jest.fn().mockReturnThis(),
  draw: jest.fn(),
}));

const StaveNote = jest.fn().mockImplementation(() => ({
  addModifier: jest.fn().mockReturnThis(),
}));

const Accidental = jest.fn();

const Formatter = {
  FormatAndDraw: jest.fn(),
};

const Glyph = jest.fn().mockImplementation(() => ({
  setContext: jest.fn().mockReturnThis(),
  setStave: jest.fn().mockReturnThis(),
  render: jest.fn(),
}));

module.exports = {
  Flow: {
    Renderer,
    Stave,
    StaveNote,
    Accidental,
    Formatter,
    Glyph,
  },
};
