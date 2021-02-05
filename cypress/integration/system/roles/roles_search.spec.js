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

    it('角色管理查询条件及结果列表显示', () => {
        cy.intercept('/business-admin/role/list').as('getroleInitList');
        cy.contains('角色搜索').should('be.visible');
        cy.get('[data-cy=rol-data-table]')
            .should('contain', '角色')
            .should('contain', '备注')
            .should('contain', '操作');
    })

    it('新增、修改页面查内容', () => {
        // 树状结构如何表示
        cy.intercept('/business-admin/role/list').as('getroleInitList');
        cy.get('[data-cy=rol-new-button]').click();
        cy.contains('角色名').should('be.visible');
        cy.contains('描述').should('be.visible');
        cy.contains('功能名称').should('be.visible');
        cy.contains('描述').should('be.visible');
        cy.contains('功能名称').should('be.visible');
        cy.get('[data-cy=rol-tree-data-table]')
            .should('contain', '功能名称')
            .should('contain', '备注');
    })

    it('按角色名查询', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');

        // 输入角色->查询
        cy.get('[data-cy=rol-search-name-input]').type('普通角色');
        cy.get('[data-cy=rol-demand-button]').click();

        // 待列表刷新后判断数据中是否包含角色名
        cy.wait('@getRoleList').then((interception) => {
            cy.get('[data-cy=rol-data-table]')
                .find('tbody>tr').first()
                .should('contain', '普通角色');
        })
    })

    it('查询结果为空', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');

        // 输入角色->查询
        cy.get('[data-cy=rol-search-name-input]').type('角色新增数据');
        cy.get('[data-cy=rol-demand-button]').click();
        // 需求：查询结果为空时需要提示用户查询结果为空
        cy.wait('@getRoleList');
        cy.contains('查询结果为空').should('be.visible');
    })

    it('查看', () => {
        cy.intercept('/business-admin/role/list').as('getRoleList');
        // 输入角色->查询
        cy.get('[data-cy=rol-search-name-input]').type('5678');
        cy.get('[data-cy=rol-demand-button]').click();
        cy.wait('@getRoleList');
        // cy.get('[data-cy=rol-see-button]').click();
        cy.get('[data-cy=rol-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .contains('查看').click({ force: true });
        cy.contains('角色名').should('be.visible');
        cy.contains('描述').should('be.visible');
        cy.get('[data-cy=rol-tree-data-table]')
            .should('contain', '功能名称')
            .should('contain', '备注')
            .should('contain', '基本信息管理');
        // cy.contains('基本信息管理').should('be.visible');
    })
})