/// <reference types="cypress" />
import { HEADRES } from '../config'

Cypress.Commands.add("requestroleList", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/role/list`,
        body
    });
})
Cypress.Commands.add("requestroleAdd", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/role/add`,
        body
    });
})
Cypress.Commands.add("requestroleDelete", (idArr) => {
    cy.request({
        headers: HEADRES,
        method: 'DELETE',
        url: `http://localhost:8080/api/business-admin/role/delete/${idArr}`
    });
})