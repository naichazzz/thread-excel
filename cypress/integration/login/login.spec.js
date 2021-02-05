/// <reference types="Cypress" />
context('登录页面-登录', () => {
    /** ======================= 全局变量 ======================= */
    let baseUrl;
    let data;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('login/login').then((par) => {
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
    it('登录页面显示', () => {
        /* 准备 */

        /* 操作 */

        /* 期望 */
        cy.contains('登录').should('be.visible');
    })

    it('登录成功', () => {
        /* 准备 */
        cy.intercept(baseUrl.login.login).as('login');
        cy.intercept(baseUrl.login.getInfo).as('getInfo');

        /* 操作 */
        cy.get('[data-cy=log-username-input]').type(data.user.userName);
        cy.get('[data-cy=log-password-input]').type(data.user.password);
        cy.get('[data-cy=log-verification-code-input]').type(data.captcha);
        cy.get('[data-cy=log-login-button]').click();
        cy.wait('@login');
        cy.wait('@getInfo');

        /* 期望 */
        cy.contains(data.title).should('be.visible');
        cy.contains(data.user.userName).should('be.visible');
    })
    it('用户名为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=log-username-input]').clear();
        cy.get('[data-cy=log-password-input]').type(data.user.password);
        cy.get('[data-cy=log-verification-code-input]').type(data.captcha);
        cy.get('[data-cy=log-login-button]').click();

        /* 期望 */
        cy.contains('用户名不能为空').should('be.visible');
    })
    it('密码为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=log-username-input]').type(data.user.userName);
        cy.get('[data-cy=log-password-input]').clear();
        cy.get('[data-cy=log-verification-code-input]').type(data.captcha);
        cy.get('[data-cy=log-login-button]').click();

        /* 期望 */
        cy.contains('密码不能为空').should('be.visible');
    })
    it('验证码为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=log-username-input]').type(data.user.userName);
        cy.get('[data-cy=log-password-input]').type(data.user.password);
        cy.get('[data-cy=log-verification-code-input]').clear();
        cy.get('[data-cy=log-login-button]').click();

        /* 期望 */
        cy.contains('验证码不能为空').should('be.visible');
    })
    it('验证码刷新', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=log-code-image]').click();

        /* 期望 */
        cy.wait('@captchaImage')
            .its('response.body')
            .then((body) => {
                expect(body.code).to.eq(200);
            });
    })
    it('验证码错误', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=log-username-input]').type(data.user.userName);
        cy.get('[data-cy=log-password-input]').type(data.user.password);
        cy.get('[data-cy=log-verification-code-input]').type("aaaa");
        cy.get('[data-cy=log-login-button]').click();

        /* 期望 */
        cy.contains('验证码错误').should('be.visible');
    })
    it('登录失败超过5次', () => {
        /* 准备 */

        /* 操作 */
        for (let i = 0; i < 5; i++) {
            cy.get('[data-cy=log-username-input]').clear().type(data.forgetPasswordUser.userName);
            cy.get('[data-cy=log-password-input]').clear().type(data.forgetPasswordUser.password + i);
            cy.get('[data-cy=log-verification-code-input]').clear().type(data.captcha);
            cy.get('[data-cy=log-login-button]').click();
        }

        /* 期望 */
        cy.get("由于多次登录失败，该账户已被禁用，请10分钟后重试或联系管理员!").should('be.visible');
    })
    it('记住密码', () => {
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
        cy.get('[data-cy=log-username-input]').should('have.value', data.user.userName);
        cy.get('[data-cy=log-password-input]').should('have.value', data.user.password);
    })

})