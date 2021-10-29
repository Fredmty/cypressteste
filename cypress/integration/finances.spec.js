/// <reference types="cypress" />


context('dev finances', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/');
        cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('cadastrar entradas', () => {

        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(12); //atribut
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 1);
    });


    it('cadastrar saídas', () => {

      
        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(-12); //atributo
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 1);
    });

    it('Remover entradas e saídas', () => {
        const entrada = 'Total'
        const saida = 'KinderOvo'
        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type(entrada); //id
        cy.get('[name=amount]').type(120); //atribut
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor

        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type(saida); //id
        cy.get('[name=amount]').type(-12); //atribut
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor

        //estrategia 1: voltar para elemento pai, e avançar para um td img atrtibuto

        cy.get('td.description')
          .contains(entrada)
          .parent()
          .find('img[onClick*=remove]')
          .click();

        //estrategia 2: buscar todo os irmaos, e buscar o que tem img + attr
        cy.get('td.description')
         .contains(saida)
         .siblings()
         .children('img[onClick*=remove]')
         .click()


         cy.get('#data-table tbody tr').should('have.length', 0);
    });
});