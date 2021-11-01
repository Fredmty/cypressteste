/// <reference types="cypress" />

import {format, prepareLocalStorage} from '../support/utils'
context('dev finances', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })

        //cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('cadastrar entradas', () => {

        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(12); //atribut
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 3);
    });


    it('cadastrar saídas', () => {

      
        cy.get('#transaction .button').click(); //id + classe
        cy.get('#description').type('Mesada'); //id
        cy.get('[name=amount]').type(-12); //atributo
        cy.get('[type=date]').type('2021-03-20'); //atributos
        cy.get('button').contains('Salvar').click(); //tipo e valor 

        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Remover entradas e saídas', () => {

        //estrategia 1: voltar para elemento pai, e avançar para um td img atrtibuto

        cy.get('td.description')
          .contains('Mesada')
          .parent()
          .find('img[onClick*=remove]')
          .click();

        //estrategia 2: buscar todo os irmaos, e buscar o que tem img + attr
        cy.get('td.description')
         .contains('Suco Kapo')
         .siblings()
         .children('img[onClick*=remove]')
         .click()


         cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it('Validar saldo com diversas transações', () => {
        const entrada = 'Mesada'
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
        //capturar as linhas com as transações
        //capturar o texto dessas colunas
        //somar os valores de entrada e saida
        let incomes = 0
        let expenses = 0
        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => {

              cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                  if(text.includes('-')){
                      expenses = expenses + format(text)
                  } else {
                      incomes = incomes + format(text)
                  } 
                  cy.log('entradas',expenses)
                  cy.log('saida',incomes)

                })

        
          })
          cy.get('#totalDisplay').invoke('text').then(text => {
              
              let formatedTotalDisplay = format(text)
              let expectedTotal = incomes + expenses 

              expect(formatedTotalDisplay).to.eq(expectedTotal)

          });

        //formatar esses valores das linhas
        //capturar o texto do total
        //comparar o somatório de entradas e despesas com o total
    });
});