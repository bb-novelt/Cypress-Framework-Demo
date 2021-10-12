nstallbeforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.exec("cd .. && npx nps mongodb.restore_default");
});

describe('Main stories', () => {
  it('set a captain', () => {
    cy.visit('http://localhost:4200')
    cy.viewport("iphone-6");
    cy.contains('Black Pearl').click();
    cy.contains('Jack Sparrow').click();
    cy.contains('Back').click();
    cy.contains('Jack Sparrow').should("exist");
  })

  it('It delete a boat', () => {
    cy.visit('http://localhost:4200')
    cy.contains('Black Pearl').click();
    cy.contains('Delete').click();
    cy.contains('Black Pearl').should("not.exist");
  })
})
