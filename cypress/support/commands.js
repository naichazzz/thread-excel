/// <reference types="cypress" />
Cypress.Commands.add('elCheck', {
    prevSubject: true
}, (subject, isCheck) => {
    cy.wrap(subject)
        .find('[type="checkbox"]')
        .check({ force: isCheck });
})
Cypress.Commands.add('elSelect', {
    prevSubject: true
}, (subject, selectName) => {
    cy.wrap(subject).contains(selectName).as('selectName');
    cy.wrap(subject).click();
    cy.get('@selectName').click();
})
Cypress.Commands.add('elTableRow', {
    prevSubject: true
}, (subject, row) => {
    cy.wrap(subject)
        .find('tbody>tr').eq(row);
})
Cypress.Commands.add('elTableCell', {
    prevSubject: true
}, (subject, row, col) => {
    cy.wrap(subject)
        .find('tbody>tr').eq(row)
        .find('td').eq(col);
})
Cypress.Commands.add('elTableCheckbox', {
    prevSubject: true
}, (subject, row) => {
    cy.wrap(subject)
        .find('tbody>tr').eq(row)
        .find('td').first()
        .find('[type="checkbox"]');
})
Cypress.Commands.add('elTableLastCell', {
    prevSubject: true
}, (subject, row) => {
    cy.wrap(subject)
        .find('tbody>tr').eq(row)
        .find('td').last();
})
Cypress.Commands.add('treeselectRoot', {
    prevSubject: true
}, (subject) => {
    cy.wrap(subject)
        .find('.vue-treeselect__control-arrow');
})
Cypress.Commands.add('treeselect', {
    prevSubject: true
}, (subject, treeIndexArr) => {
    cy.wrap(subject).as('treeItem0');
    for (let i = 0; i < treeIndexArr.length; i++) {
        cy.get('@treeItem' + i)
            .find('.vue-treeselect__list')
            .find('.vue-treeselect__list-item')
            .eq(treeIndexArr[i])
            .as('treeItem' + (i + 1));
    }
    cy.get('@treeItem' + treeIndexArr.length);
})
Cypress.Commands.add('treeselectArrow', {
    prevSubject: true
}, (subject, treeIndexArr) => {
    cy.wrap(subject)
        .treeselect(treeIndexArr)
        .find('.vue-treeselect__option-arrow-container')
})
Cypress.Commands.add('treeselectLabel', {
    prevSubject: true
}, (subject, treeIndexArr) => {
    cy.wrap(subject)
        .treeselect(treeIndexArr)
        .find('.vue-treeselect__label-container')
})
/**
 * 登录
 */
Cypress.Commands.add("login", (name, password) => {
    cy.intercept('/business-admin/system/login').as('aslogin');
    cy.intercept('/business-admin/user/getInfo').as('getInfo');

    cy.visit('/');
    // action: 输入用户名、密码、验证码，点击登录按钮
    cy.get('[data-cy=log-username-input]').type(name);
    cy.get('[data-cy=log-password-input]').type(password);
    cy.get('[data-cy=log-verification-code-input]').type('QMCV');
    // cy.get('[data-cy=log-remember-me-checkbox]').check();
    cy.get('[data-cy=log-login-button]').click();

    cy.wait('@aslogin').then((interceptions) => {
        console.log('login:interceptions');
        console.log(interceptions);
        console.log('token:', interceptions.response.body.data.token);
        window.localStorage.setItem('token', interceptions.response.body.data.token);
    });
    cy.wait('@getInfo').then((interceptions) => {
        console.log('getInfo:interceptions');
        console.log(interceptions);
    });
})
/**
 * 期望Element Dialog是否消失
 */
Cypress.Commands.add("expectElDialogDismiss", (selector, isShow) => {
    if (isShow) {
        cy.get(selector).should('not.have.css', 'display', 'none');
    } else {
        cy.get(selector).should('not.have.css', 'display', 'none');
    }
})
Cypress.Commands.add("resetDb", () => {
})