
context('Profiles', { tags: '@profiles' },() => {

  it('Get Bearer token and set hedera credentials for StandardRegistry', () => {
    //Getting accessToken for StandardRegistry
    let username = 'StandardRegistry'
    cy.request({
      method: 'POST',
      url: Cypress.env('api_server') + 'accounts/login',
      body: {
        username: username,
        password: 'test'
      }
    })
      .then((response) => {
        let accessToken = 'bearer ' + response.body.accessToken
        //Checking if StandardRegisty already has hedera credentials
        cy.request({
          method: 'GET',
          url: Cypress.env('api_server') + 'profiles/' + username,
          headers: {
            authorization: accessToken
          }
        })
          .then((response) => {
            if (response.body.confirmed === false) {
              //If StandardRegistry doesn't have hedera credentials, creating them
              cy.request({
                method: 'PUT',
                url: Cypress.env('api_server') + 'profiles/' + username,
                headers: {
                  authorization: accessToken
                },
                body: {
                  hederaAccountId: '0.0.46804835',
                  hederaAccountKey: '302e020100300506032b657004220420aaf0eac4a188e5d7eb3897866d2b33e51ab5d7e7bfc251d736f2037a4b2075e8',
                  vcDocument: {
                    geography: 'testGeography',
                    law: 'testLaw',
                    tags: 'testTags',
                    type: 'StandardRegistry',
                    '@context': []
                  }
                },
                timeout: 200000
              })
                .then(() => {
                  //get info about StandardRegistry and put it in the file
                  cy.request({
                    method: 'GET',
                    url: Cypress.env('api_server') + 'profiles/' + username,
                    headers: {
                      authorization: accessToken
                    }
                  })
                    .then((response) => {
                      response.body.accessToken = accessToken
                      cy.writeFile("cypress/fixtures/StandardRegistryData.json", JSON.stringify(response.body))
                    })
                })
            }
            else {
              //if StandardRegistry already has hedera credentials, do not create hedera creds, 
              //just put info about StandardRegistry and accessToken in the file (just in case the file isn't presented)
              response.body.accessToken = accessToken
              cy.writeFile("cypress/fixtures/StandardRegistryData.json", JSON.stringify(response.body))
            }
          })
      })
  })
})

