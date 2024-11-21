describe("Header check", () => {
  it("Contains correct header text", () => {
    cy.visit("/exam");
    cy.get('[data-testid="main-title"]')
      .should("exist")
      .should("contain.text", "Lafayette Jazz Workshop Placement Exam");
  });
});

describe("Authenticated tests", () => {
  beforeEach(() => {
    cy.visit("/registration");

    cy.contains("Sign In").click();

    cy.get('input[type="email"]').type("pb@email.com");
    cy.get('input[type="password"]').type("1234Go");

    cy.get('button[type="submit"]').contains("Sign In").click();

    cy.url().should("include", "/exam");
  });

  it("Should access exam page and render CardFooter", () => {
    // Once we are authenticated, we can access the exam page and proceed to test
    cy.get("#class-preference-select").click();
    cy.contains("li", "Advanced Theory").click();

    cy.contains("Begin Test").click();

    cy.get('[data-testid="card-footer"]')
      .should("exist")
      .within(() => {
        cy.get("button").should("contain.text", "Save and Continue >");
      });
  });
});
