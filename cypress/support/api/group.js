/// <reference types="cypress" />
import { HEADRES } from '../config'

Cypress.Commands.add("requestGroupList", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/group/list`,
        body
    });
})

Cypress.Commands.add("requestGroupDelete", (idArr) => {
    cy.request({
        headers: HEADRES,
        method: 'DELETE',
        url: `http://localhost:8080/api/group/delete/${idArr}`,
        body
    });
})