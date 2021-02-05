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

    it('删除角色成功-单条', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第四次');
        cy.get('[data-cy=rol-ok-button]').click();
        // 验证出现成功提示框
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/delete').as('delRole');
        cy.get('[data-cy=rol-search-name-input]').type('测试第四次');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-delete-button]').click();
        cy.contains('确定').click();
        cy.wait('@delRole');
        cy.contains('删除角色信息成功').should('be.visible');
    })

    it('删除角色-取消', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/delete').as('delRole');
        cy.get('[data-cy=rol-search-name-input]').type('55233');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-delete-button]').click();
        cy.contains('取消').click();
        // cy.get('[data-cy=rol_manage_dialog]')
            // .find('.el-dialog__close').click({ force: true });
            // cy.contains('取消').click();
        cy.contains('已取消删除');
        // 期望dialog不显示
        // cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', true);
    })

    it('删除角色-未勾选', () => {
        cy.get('[data-cy=rol-delete-button]').click();
        cy.contains('您还未选择角色').should('be.visible');
    })

    it('删除角色失败-关联用户', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/delete').as('delRole');
        cy.get('[data-cy=rol-search-name-input]').type('超级管理员');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-delete-button]').click();
        cy.contains('确定').click();
        // 需求：若有用户属于此角色，则此角色不可删除
        cy.contains('失败').should('be.visible');
    })

    it('删除角色成功-多条', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第五次');
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/delete').as('delRole');
        cy.intercept('/business-admin/role/add').as('addRole');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第六次');
        cy.get('[data-cy=rol-ok-button]').click();
        // 验证出现成功提示框
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
        cy.get('[data-cy=rol-search-name-input]').type('测试第');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').eq(1)
            .find('td').eq(0)
            .click();
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').eq(0)
            .find('td').eq(0)
            .click();
        cy.get('[data-cy=rol-delete-button]').click();
        cy.contains('确定').click();
        cy.wait('@delRole');
        cy.contains('删除角色信息成功').should('be.visible');
    })
})