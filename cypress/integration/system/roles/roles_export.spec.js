context('角色管理', () => {
    before(() => {
    })

    after(() => {
    })

    afterEach(() => {
    })

    beforeEach(() => {
        cy.intercept('/business-admin/role/list').as('getroleInitList');
        cy.login('admin', '1qaz@WS');
        cy.visit('/roleManage');
        cy.wait('@getroleInitList');
    })

    it('导出-筛选后的数据', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/export').as('exRole');
        cy.get('[data-cy=rol-search-name-input]').type('普通角色');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=role-data-table]')
            .find('tbody>tr').first()
            .should('contain', '普通角色');
        cy.get('[data-cy=rol-export-button]').click();
        cy.contains('确定').click();
        cy.wait('@exRole');
        // 需求：导出Excel，角色信息表导出YYYYMMDDHHMMSS.xls，（角色名、描述）
    })

    it('导出-全部数据', () => {
        cy.intercept('/business-admin/role/export').as('exRole');
        cy.get('[data-cy=rol-export-button]').click();
        cy.contains('确定').click();
        cy.wait('@exRole');
        // 需求：导出Excel，角色信息表导出YYYYMMDDHHMMSS.xls，（角色名、描述）
    })

    it('导出-取消', () => {
        cy.intercept('/business-admin/role/export').as('exRole');
        cy.get('[data-cy=rol-export-button]').click();
        cy.contains('取消').click();
        cy.get('[data-cy=rol_manage_dialog]')
            .find('.el-dialog__close').click({ force: true });

        /** 期望 */
        // 期望dialog不显示
        cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', true);
    })

    it('导出-失败', () => {
        cy.intercept('/business-admin/role/export').as('exRole');
        cy.get('[data-cy=rol-export-button]').click();
        cy.contains('确定').click();
        cy.wait('@exRole');
        cy.contains('导出失败').should();
    })
})