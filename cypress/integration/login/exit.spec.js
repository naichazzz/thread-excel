/// <reference types="Cypress" />
context('登录页面-退出', () => {
    /** ======================= 全局变量 ======================= */
    let baseUrl;
    let data;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('base').then((par) => {
            data = par;
        });
    })

    after(() => {
    })

    beforeEach(() => {
        cy.intercept(baseUrl.login.captchaImage).as('captchaImage');

        cy.visit(baseUrl.login.root);
        cy.wait('@captchaImage');
    })

    afterEach(() => {
    })

    /** ======================= 全局方法 ======================= */
    /** ======================= 测试用例 ======================= */
    it('退出功能验证',()=>{
        /* 准备 */
        cy.intercept(baseUrl.login.login).as('login');
        cy.intercept(baseUrl.login.getInfo).as('getInfo');

        /* 操作 */
        cy.get('[data-cy=log-username-input]').type(data.user.userName);
        cy.get('[data-cy=log-password-input]').type(data.user.password);
        cy.get('[data-cy=log-verification-code-input]').type(data.captcha);
        cy.get('[data-cy=log-remember-me-checkbox]').elCheck(true);
        cy.get('[data-cy=log-login-button]').click();
        cy.wait('@login');
        cy.wait('@getInfo');
        cy.get('[data-cy=ind-dropdown-link]').click();
        cy.get('[data-cy=ind-exit-dropdown-item]').click();
        cy.get('[type="button"]').contains('确定').click();

        /* 期望 */
        cy.url().should('include', baseUrl.login.root);
        
    })
    it.skip('直接关闭程序',()=>{
        /* 准备 */
        
        /* 操作 */
        
        /* 期望 */
        
    })
    
})