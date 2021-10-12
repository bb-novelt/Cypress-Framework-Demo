import "@cypress/code-coverage/support";

//https://github.com/cypress-io/cypress/issues/6564
//Make cy.contains() case insensitive
Cypress.Commands.overwrite("contains", (originalFn, subject, filter, text, options = {}) => {
  // determine if a filter argument was passed
  if (typeof text === "object") {
    options = text;
    text = filter;
    filter = undefined;
  }
  options.matchCase = false;
  return originalFn(subject, filter, text, options);
});

// beforeEach(() => {
//   cy.clearCookies();
//   cy.clearLocalStorage();
//   cy.visit("http://localhost:4200", {
//     onBeforeLoad: (win) => {
//       win.sessionStorage.clear();
//       win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
//     }
//   });
//   cy.exec("cd .. && npx nps mongodb.restore_default");
// });
