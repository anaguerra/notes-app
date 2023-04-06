describe('Note App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')

    // empty database and create new user
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Ana',
      username: 'anaroot',
      password: '12345'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
  })

  it('frontpage can be opened', () => {
    cy.contains('Notes')
  })

  it('login form can be opened', () => {
    cy.contains('Show loginn').click()
  })

  it('user can login', () => {
    cy.contains('Show loginn').click()
    // cy.get('input:first').type('anaroot')
    // cy.get('input:last').type('12345')

    // otras formas
    // cy.get('input').first().type('anaroot')
    // cy.get('input').last().type('12345')

    // cy.get('[placeholder="Username"]').type('anaroot')
    // cy.get('[placeholder="Password"]').type('12345')

    cy.get('[name="Username"]').type('anaroot')
    cy.get('[name="Password"]').type('12345')
    cy.contains('Login').click()
    cy.contains('New note')
  })

  it('login fails with wrong password', () => {
    cy.contains('Show loginn').click()
    cy.get('[name="Username"]').type('anaroot')
    cy.get('[name="Password"]').type('wrong_password')
    cy.contains('Login').click()

    // maneras diferentes de comprobar
    cy.contains('Login error')
    cy.get('.error').contains('Login error')
    // más explícito (no recomendable testar css salvo que sea algo crítico)
    cy.get('.error')
      .should('contain', 'Login error')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
      .should('have.css', 'border-style', 'solid')
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'anaroot', password: '12345' })
    })

    it('a new note can be created', () => {
      const noteContent = 'a note created by cypress'
      cy.contains('New note').click()
      cy.get('[name="noteContent"]').type(noteContent)
      cy.contains('Crear nota').click()
      cy.contains(noteContent)
    })

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({
          content: 'A note created 1 from cypress',
          important: false
        })

        cy.createNote({
          content: 'A note created 2 from cypress',
          important: false
        })
      })

      it('it can be changed as important', () => {
        cy
          .contains('A note created 2 from cypress').as('myNote')

        // cy.debug()

        cy.get('@myNote')
          .contains('make important')
          .click()

        cy.get('@myNote')
          .contains('make not important')
      })
    })
  })
})
