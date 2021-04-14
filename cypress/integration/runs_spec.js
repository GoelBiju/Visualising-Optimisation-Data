describe("Runs tests", () => {
  it("Visits runs page", () => {
    // Aliases
    cy.intercept("/api/runs").as("getRuns");

    cy.visit("http://localhost:3000").wait("@getRuns");

    // expect(true).to.equal(true);
  });
});
