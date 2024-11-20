describe("template spec", () => {
  it("renders the default elements on the screen", () => {
    cy.visit("http://localhost:3000/exam");
    cy.get('[data-testid="main-title"]')
      .should("exist")
      .should("have.text", "Lafayette Jazz Workshop Placement Exam");
  });
});
