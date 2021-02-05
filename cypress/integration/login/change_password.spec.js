/// <reference types="Cypress" />
context('登录页面-修改密码', () => {
    /** ======================= 全局变量 ======================= */
    let baseUrl;
    let base;
    let data;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('base').then((par) => {
            base = par;
        });
        cy.fixture('login/change_password').then((par) => {
            data = par;
        });
    })

    after(() => {
    })

    beforeEach(() => {
        // cy.captchaImage().then(() => {
        //     let body;
        //     cy.login_api(body).then(() => {
        //         cy.getInfo();
        //     })
        // });
        // cy.visit('/SIMCard');
        // cy.intercept(baseUrl.login.captchaImage).as('captchaImage');

        // cy.visit(baseUrl.login.root);
        // cy.wait('@captchaImage');

        // 登录
        cy.login(base.user.userName, base.user.password);
        // cy.login(data.userName, data.password);
        cy.get('[data-cy=ind-dropdown-link]').click();
        cy.get('[data-cy=ind-change-password-dropdown-item]').click();
    })

    afterEach(() => {
    })

    /** ======================= 全局方法 ======================= */
    /** ======================= 测试用例 ======================= */
    it('修改密码页面显示', () => {
        /* 准备 */

        /* 操作 */

        /* 期望 */
        cy.get('[data-cy=ind-change-password-dialog]')
            .should('contain.text', '旧密码')
            .should('contain.text', '新密码')
            .should('contain.text', '确认新密码')
            .should('contain.text', '确 定');
    })
    it.skip('修改密码成功', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('Admin123@');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('Admin123@');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.url().should('include', baseUrl.login.root);
        cy.login(data.userName, 'Admin123@');
        cy.url().should('include', baseUrl.login.login);

        /* 复归 */
        // todo
    })
    it('旧密码为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').clear();
        cy.get('[data-cy=ind-dia-new-password-input]').type(data.newPassword);
        cy.get('[data-cy=ind-dia-password-confirm-input]').type(data.newPassword);
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('请输入密码').should('be.visible');
    })
    it('新密码为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').clear();
        cy.get('[data-cy=ind-dia-password-confirm-input]').clear();
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('请输入新密码').should('be.visible');
    })
    it('确认新密码为必填项', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type(data.newPassword);
        cy.get('[data-cy=ind-dia-password-confirm-input]').clear();
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('请确认新密码').should('be.visible');
    })
    it('新密码和确认新密码不一致', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('admin@123');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('123@qwe');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('两次输入密码不一致!').should('be.visible');
    })
    it('新密码输入小于7位', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('ad@123');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('ad@123');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('新密码长度不正确').should('be.visible');
    })
    it('新密码输入大于10位', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('qwert@12345');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('qwert@12345');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('新密码长度不正确').should('be.visible');
    })
    it('新密码输入纯字母', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('qwertyu');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('qwertyu');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('新密码组成不正确').should('be.visible');
    })
    it('新密码输入纯数字', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('12345678');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('12345678');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('新密码组成不正确').should('be.visible');
    })
    it.skip('新密码输入不包括特殊字符', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-old-password-input]').type(data.password);
        cy.get('[data-cy=ind-dia-new-password-input]').type('admin123');
        cy.get('[data-cy=ind-dia-password-confirm-input]').type('admin123');
        cy.get('[data-cy=ind-dia-commit-button]').click();

        /* 期望 */
        cy.contains('新密码组成不正确').should('be.visible');
    })
    it('取消修改密码', () => {
        /* 准备 */

        /* 操作 */
        cy.get('[data-cy=ind-dia-cancel-button]').click();

        /* 期望 */
        cy.get('[data-cy=ind-change-password-dialog]')
            .should('not.have.css', 'display', 'none');
    })

})