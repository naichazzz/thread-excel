context.skip('车辆调度', () => {
    before(() => {
    })

    beforeEach(() => {
        
        cy.login('admin', '1qaz@WS')
        // cy.contains('车辆监控管理').click()
        // cy.contains('车辆调度').click()
    })

    after(() => {
    })

    afterEach(() => {
    })

    it('车辆调度', () => {
        // cy.request({
        //     method: 'POST',
        //     // url: "/login",
        //     url: "/business-admin/system/captchaImage",
        //     form:true,
        //     body: {
        //         username: "admin",
        //         password: "1qaz@WS",
        //         verificationCode: "1qaz@WS",
        //     }
        // });
        // cy.visit("/carDispatch")

        // cy.get('[data-cy=dis-send-type-radio]')
        //     .contains('CAN故障码信息')
        //     .click();
        // cy.get('[data-cy=dis-send-level-radio]')
        //     .contains('通知')
        //     .click();
        // cy.get('[data-cy=dis-message-type-radio]')
        //     .contains('通知')
        //     .click();
        // cy.get('[data-cy=dis-message-demo-select]')
        //     .click()
        // cy.contains('调度2').should('be.visible');
        // cy.contains('调度2').click();
        // cy.get('[data-cy=dis-select-car-button]')
        //     .click()
        // cy.contains('选择车辆').should('be.visible');
        // cy.contains('车牌号').should('be.visible');
    })

})