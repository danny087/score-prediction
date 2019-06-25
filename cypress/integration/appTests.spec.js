describe('Input form', () => {
    it('Shows right url',() => {
        cy.visit("http://localhost:3000/home")
        cy.wait(9000)
        cy.contains('Matchday')
        .click()
        .url().should('include','/matches/1')
    })
    it('search for testleague',() => {
        cy.visit("http://localhost:3000/leagues")
        cy.wait(9000)
        cy.get('[data-cy="input"]')
        .click({force:true})
        .type('testleague')
        cy.wait(2000)
        cy.get('[data-cy="findleague"]')
        .click()
        .url().should('include','/league/testleague')

    })

    it.only('logs out', () => {
        cy.visit("http://localhost:3000/leagues")
        cy.wait(9000)
        cy.contains('logout')
        .click()

    })
})