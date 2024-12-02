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

    cy.get('input[type="email"]').type(Cypress.env("NEXT_PUBLIC_EMAIL"));
    cy.get('input[type="password"]').type(
      Cypress.env("NEXT_PUBLIC_SIGNIN_PASS")
    );

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
        cy.get("p").should("contain.text", "Page: 1/27");
      });

    cy.get('[data-testid="progress-bar"]')
      .should("exist")
      .and("have.attr", "aria-valuenow", "3");

    // Perform an action to update the progress bar:
    // Click the "Save and Continue >" button to go to the next page
    cy.get('[data-testid="card-footer"]')
      .find("button")
      .contains("Save and Continue >")
      .click();

    // Verify the progress bar has updated
    cy.get('[data-testid="progress-bar"]')
      .should("exist")
      .and("have.attr", "aria-valuenow", "7");

    // Verify the page number has incremented
    cy.get('[data-testid="card-footer"]').within(() => {
      cy.get("p").should("contain.text", "Page: 2/27");
    });
  });
});
