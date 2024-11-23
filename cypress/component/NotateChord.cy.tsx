// cypress/component/NotateChord.cy.tsx
import React from "react";
import NotateChord from "../../app/components/NotateChord";
import { mount } from "cypress/react";
const sinon = require("sinon");

describe("NotateChord Component", () => {
  beforeEach(() => {});

  it("renders without errors", () => {
    const setChords = sinon.stub().callsFake((chords: any) => {
      console.log("Chords updated:", chords);
    });
    mount(<NotateChord setChords={setChords} />);
    cy.get("div").should("exist");
  });

  it("allows users to add a note to the chord by clicking on the staff", () => {
    const setChords = sinon.stub().callsFake((chords: any) => {
      console.log("Chords updated:", chords);
    });

    mount(<NotateChord setChords={setChords} />);

    // Simulate a click at a specific location on the staff
    cy.get('[data-testid="staff-container"]').click(100, 50);

    // Verify that the chord data has been updated
    cy.wrap(setChords).should("have.been.called");
  });
});
