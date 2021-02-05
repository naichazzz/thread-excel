/// <reference types="cypress" />
import { HEADRES } from '../config'

Cypress.Commands.add("captchaImage", () => {
    cy.request({
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/system/captchaImage`
    }).its('body').then((body) => {
        window.localStorage.setItem('uuid', body.data.uuid);
    })
})
Cypress.Commands.add("login_api", (body) => {
    cy.request({
        headers: HEADRES,
        method: 'POST',
        url: `http://localhost:8080/api/business-admin/system/login`,
        body: {
            code: "QMCV",
            password: "1qaz@WS",
            username: "admin",
            uuid: window.localStorage.getItem('uuid')
        }
    }).its('body').then((body) => {
        window.localStorage.setItem('token', body.data.token);
    });
})
Cypress.Commands.add("getInfo", () => {
    cy.request({
        headers: HEADRES,
        method: 'GET',
        url: `http://localhost:8080/api/business-admin/user/getInfo`
    });
})

Cypress.Commands.add("requestLogin", (name, password) => {
    cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/business-admin/system/captchaImage`
    }).then((response) => {
        let uuid = response.body.data.uuid;
        cy.request({
            method: 'POST',
            url: `http://localhost:8080/api/business-admin/system/login`,
            body: {
                code: "QMCV",
                password: password,
                username: name,
                uuid: uuid
            }
        }).then((response) => {
            let token = response.body.data.token;
            window.localStorage.setItem('token', token);

            let uuid = response.body.data.uuid;
            cy.request({
                method: 'GET',
                url: `http://localhost:8080/api/business-admin/user/getInfo`,
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                }
            }).then((response) => {
                let userName = response.body.data.userName;
                expect(userName).to.equal(name);
            });

        });
    });
})