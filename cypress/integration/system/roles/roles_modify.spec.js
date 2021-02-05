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

    it('修改成功', () => {
        cy.intercept('/business-admin/role/update').as('uprole');
        cy.intercept('/business-admin/role/add').as('addRole');
        cy.intercept('/business-admin/role/list').as('getroleInitList');
        // 新建->输入角色名描述->下一步
        cy.get('[data-cy=rol-new-button]').click();
        cy.get('[data-cy=rol-name-input]').type('测试修改');
        cy.get('[data-cy=rol-describe-input]').type('123');
        // 勾选列表第一行第一列
        cy.get('[data-cy=rol-tree-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
        // 查询
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.get('[data-cy=rol-search-name-input]').type('测试修改');
        cy.get('[data-cy=rol-demand-button]').click();
        // 待列表刷新后判断数据中是否包含角色名
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .should('contain', '测试修改');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .contains('编辑').click({ force: true });
        cy.get('[data-cy=rol-name-input]').clear().type('测试修改完成');
        cy.get('[data-cy=rol-describe-input]').clear().type('321');
        // 第一行取消勾选
        cy.get('[data-cy=rol-tree-data-table]')
            .elTableCheckbox(0)
            .uncheck({ force: true });
        cy.get('[data-cy=rol-ok-button]').click();
        cy.wait('@addRole');
        cy.contains('成功').should('be.visible');
    })

    it('修改-必填项', () => {
        cy.intercept('/business-admin/role/update').as('uprole');
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.get('[data-cy=rol-search-name-input]').type('测试修改完成');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .should('contain', '测试修改完成');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .contains('编辑').click({ force: true });
        cy.get('[data-cy=rol-name-input]').clear();
        cy.get('[data-cy=rol-ok-button]').click();
        cy.contains('请输入').should('be.visible');
    })
    it('修改-取消', () => {
        cy.intercept('/business-admin/role/update').as('uprole');
        cy.intercept('/business-admin/role/update').as('uprole');
        cy.intercept('/business-admin/role/list').as('getRoleList');
        cy.get('[data-cy=rol-search-name-input]').type('测试修改完成');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .should('contain', '测试修改完成');
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .contains('编辑').click({ force: true });
        cy.get('[data-cy=rol-name-input]').clear().type('测试');
        cy.get('[data-cy=rol-describe-input]').clear().type('123');
        // 第一行取消勾选
        cy.get('[data-cy=rol-tree-data-table]')
            .elTableCheckbox(0)
            .uncheck({ force: true });
            cy.get('[data-cy=rol-clear-button]').click();
        cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', false);

        cy.get('[data-cy=rol_manage_dialog]')
            .find('.el-dialog__close').click({ force: true });

        /** 期望 */
        // 期望dialog不显示
        cy.expectElDialogDismiss('[data-cy=rol_manage_dialog]', true);
    })
})
