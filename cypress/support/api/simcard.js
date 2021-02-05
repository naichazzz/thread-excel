/// <reference types="cypress" />
import { HEADRES } from '../config'

Cypress.Commands.add("requestSimList", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/sim/listAll`,
        body
    });
})
Cypress.Commands.add("requestSimAdd", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/sim/add`,
        body
    });
})
Cypress.Commands.add("requestSimDelete", (idArr) => {
    cy.request({
        headers: HEADRES,
        method: 'DELETE',
        url: `http://localhost:8080/api/business-admin/sim/delete/${idArr}`
    });
})