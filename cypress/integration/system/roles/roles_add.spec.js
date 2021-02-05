context('角色管理', () => {
    before(() => {
    })

    after(() => {
    })

    afterEach(() => {
    })

    beforeEach(() => {
        // cy.intercept('/business-admin/menu/list').as('listmenu');
        cy.intercept('/business-admin/role/list').as('getroleInitList');
        cy.login('admin', '1qaz@WS');
        cy.visit('/roleManage');
        cy.wait('@getroleInitList');
        // cy.wait('@listmenu');
    })

    it('新建角色成功-不设置权限', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第一次');
        cy.get('[data-cy=rol-ok-button]').click();
        // 验证出现成功提示框
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
    })

    it('新建角色成功-设置权限1个', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        cy.intercept('/business-admin/menu/list').as('listmenu');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第二次');
        cy.get('[data-cy=rol-describe-input]').type('123');
        // 勾选列表第一行第一列
        cy.get('[data-cy=rol-tree-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
    })

    it.skip('新建角色成功-设置权限多个', () => {

    })


    it('新建角色成功-角色唯一性', () => {
        cy.intercept('/business-admin/role/add').as('addRole');

        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第一次');
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');
        cy.contains('已存在').should('be.visible');
    })

    it('新建角色成功-必填项校验', () => {
        cy.intercept('/business-admin/role/add').as('addRole');

        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-describe-input]').type('123');
        cy.get('[data-cy=rol-ok-button]').click();
        cy.contains('请输入').should('be.visible');
    })

    it('新建-功能名称-查询部分', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        cy.intercept('/business-admin/menu/list').as('listmenu');

        cy.get('[data-cy=rol-new-button]').click();
        // 功能名称查询
        cy.get('[data-cy=rol-menu-name-input]').type('安全管理');
        cy.get('[data-cy=rol-menu-demand-button]').click();
        cy.wait('@listmenu');
        //验证第一行中包含查询结果
        cy.get('[data-cy=rol-tree-data-table]')
            .find('tbody>tr').first()
            .should('contain', '安全管理');
    })

    it('新建-功能名称-验证', () => {
        cy.intercept('/business-admin/role/add').as('addRole');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第三次');
        // 勾选列表第一行第一列：基本信息管理
        cy.get('[data-cy=rol-tree-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');

        cy.intercept('/business-admin/role/list').as('getRoleList');
        // 输入角色->查询
        cy.get('[data-cy=rol-search-name-input]').type('测试第三次');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .contains('查看').click({ force: true });
        cy.get('[data-cy=rol-tree-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .find('[type="checkbox"]')
            .should('be.checked');
    })

    it('新建角色成功-取消', () => {
        cy.intercept('/business-admin/role/add').as('addRole');

        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试第一次');
        cy.get('[data-cy=rol-clear-button]').click();
        cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', false);

        cy.get('[data-cy=rol_manage_dialog]')
            .find('.el-dialog__close').click({ force: true });

        /** 期望 */
        // 期望dialog不显示
        cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', true);

        /** 复归 */
        //  删除第一第二第三次
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.intercept('/business-admin/role/delete').as('delRole');
        cy.get('[data-cy=rol-search-name-input]').type('测试第一次');
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
})