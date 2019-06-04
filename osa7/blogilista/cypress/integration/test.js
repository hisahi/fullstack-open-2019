describe('Blog app', function() {

  describe('when logged in', function() {
    before(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        username: 'testuser',
        name: 'Johannes Sahlonen', // randomly generated name
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)    
      cy.visit('http://localhost:3003')
      
      cy.contains('log in').click()
      cy.get('input[name="Username"]').type('testuser')
      cy.get('input[name="Password"]').type('salainen')
      cy.contains('log in').click()
    })

    it('name of the user is shown', function() {
      cy.contains('Johannes Sahlonen')
      cy.contains('logged in')
    })

    it('a new blog can be created', function() {
      cy.get('input[name="Title"]')
        .type('this is a new blog')
      cy.get('input[name="Author"]')
        .type('some author')
      cy.get('input[name="URL"]')
        .type('http://example.com/')
      cy.contains('add')
        .click()
      cy.contains('this is a new blog')
    })

    describe('after a blog has been created', function() {
      it('it is listed on user page', function() {
        cy.contains('users')
          .click()
        cy.contains('Johannes Sahlonen')
          .click()
        cy.contains('this is a new blog')
      })

      it('a comment can be posted', function() {
        cy.contains('blogs')
          .click()
        cy.get('div a[href*="blogs/"]')
          .click()
        cy.get('input[name="text"]')
          .type('hauska kommentti')
        cy.get('input[value="comment"]')
          .click()
        cy.contains('hauska kommentti')
      })
    })
  })
})