/// <reference types="cypress" />
context('SIMCard管理-导出', () => {
    let baseUrl;
    let base;
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('base').then((par) => {
            base = par;
        })
    })

    after(() => {
    })

    afterEach(() => {
    })

    beforeEach(() => {
        cy.intercept(baseUrl.simcard.search).as('getSimInitList');
        // 登录
        cy.login(base.userName, base.password);
        // 进入SIM卡管理页面
        cy.visit(baseUrl.simcard.root);
        // 等待初始列表取得成功
        cy.wait('@getSimInitList');
    })

    it.skip('导出-选中单条数据', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('导出-全部数据', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.export).as('simExport');

        /** 操作 */
        cy.get("[data-cy=sim-export-button]").click();
        cy.contains('确定').click();

        /** 期望 */
        cy.wait('@simExport')
            .then((response) => {
                // expect(response.state).to.be(200);
            });
    })
    it.skip('导出-筛选后的数据', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

})