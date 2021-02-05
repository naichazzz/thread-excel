context('用户管理', () => {
    before(() => {
    })

    after(() => {
    })

    afterEach(() => {
    })

    beforeEach(() => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.login('admin', '1qaz@WS');
        cy.visit('/userManage');
        cy.wait('@getuserList');
    })

    it('查询条件及结果列表显示', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.contains('用户名').should('be.visible');
        cy.contains('状态').should('be.visible');
        cy.contains('所属组').should('be.visible');
        cy.contains('角色名').should('be.visible');
        cy.contains('备注').should('be.visible');
        cy.get('[data-cy=use-data-table]')
            .should('contain', '用户名')
            .should('contain', '状态')
            .should('contain', '角色')
            .should('contain', '所属组')
            .should('contain', '备注')
            .should('contain', '全名')
            .should('contain', '联系电话')
            .should('contain', '创建者')
            .should('contain', '启用');
    })

    it('状态下拉内容', () => {
        /** 期望 */
        cy.get('[data-cy=use-screen-use-status-select]')
            .should('contain', '全部')
            .should('contain', '启用')
            .should('contain', '停用');
    })

    it.skip('所属组下拉内容', () => {
        /** 期望 */
        cy.get('[data-cy=use-screen-group-status-select]')
            .should('contain', '全部')
            .should('contain', '启用')
            .should('contain', '停用');
    })

    it('按用户名-查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-search-input]').type('邱实_测试');
        // 点击“查询”
        cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '邱实_测试');
    })

    it('按状态-启用-查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-screen-use-status-select]').elSelect('启用');
        // 点击“查询”
        cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '启用');
    })

    it('按状态-停用-查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-screen-use-status-select]').elSelect('停用');
        // 点击“查询”
        cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '停用');
    })

    it('按角色名-查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-role-input]').type('超级管理员');
        cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '超级管理员');
    })

    it('按备注查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-remarks-input]').type('12345');
        cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '12345');
    })


    it('按所属组-查询', () => {
        cy.intercept('/business-admin/user/list').as('getuserList');
        cy.get('[data-cy=use-screen-group-treeselect]')
            .treeselectRoot()
            .click();
        cy.get('[data-cy=use-screen-group-treeselect]')
            .treeselectArrow([0])
            .click();
        cy.get('[data-cy=use-screen-group-treeselect]')
            .treeselectArrow([0, 1])
            .click();;
        cy.get('[data-cy=use-screen-group-treeselect]')
            .treeselectLabel([0, 1, 1])
            .click({ force: true });
            cy.get('[data-cy=use-search-button]').click();
        cy.wait('@getuserList');
        // 期望
        cy.get('[data-cy=use-data-table]')
            .elTableRow(0)
            .should('contain', '财务部门');
    })

    it('多条件组合查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('查询无结果', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it.skip('结果列表的排列顺序', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })


})