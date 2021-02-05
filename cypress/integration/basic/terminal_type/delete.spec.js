/// <reference types="Cypress" />
context('终端类型管理-删除', () => {
    let number = 0;
    before(() => {
        // 登录，进入系统首页
        cy.login('admin', '1qaz@WS');
        cy.contains('商用车企业平台')
        for (let count = 0; count < 3; count++) {
            // 异步获取终端类型列表
            cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');
            // 进入“终端类型管理”页面
            cy.visit('/terminalTpye')

            // 验证初始列表取得成功
            cy.wait('@getTerminalTypeList').its('response.statusCode').should('eq', 200);

            cy.intercept('/business-admin/terminalType/add').as('addTerminalType');
            // 点击“新建”，输入所有信息
            cy.get('[data-cy=typ-create-button]').click();
            cy.contains('终端类型维护');
            cy.get('[data-cy=typ-name-input]').type('测试终端2021');
            cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10007');
            cy.get('[data-cy=typ-manufacturerCityId-input]').type('100077');
            cy.get('[data-cy=typ-manufacturerId-input]').type('1000777');
            cy.get('[data-cy=typ-model-input]').type('1107');
            cy.get('[data-cy=typ-factoryId-input]').type('1108');
            cy.get('[data-cy=typ-modelId-input]').type('777');
            // “通讯类型”选择“UDP”
            cy.get('[data-cy=typ-communicationType-select]').elSelect('UDP');

            // 点击“确定”按钮
            cy.get('[data-cy=typ-sure-button]').click();

            // 验证出现成功提示
            cy.wait('@addTerminalType').then((interception) => {
                cy.contains('新增终端类型成功').should('be.visible');
            })
        }
    })

    beforeEach(() => {
        if (number == 0) {
            cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');

            // 进入“终端类型管理”页面
            cy.visit('/terminalTpye')

            // 验证初始列表取得成功
            cy.wait('@getTerminalTypeList').its('response.statusCode').should('eq', 200);

            // 输入查询条件
            cy.get('[data-cy=typ-search-name-input]').type('测试终端2021');
            cy.get('[data-cy=typ-search-manufacturerId-input]').type('1000777');
            cy.wait(600);
            // 点击“查询”
            cy.get('[data-cy=typ-search-button]').click();
        }
        else {
            // 异步获取终端类型列表
            cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');

            // 登录，进入系统首页
            cy.login('admin', '1qaz@WS');
            cy.contains('商用车企业平台')

            // 进入“终端类型管理”页面
            cy.visit('/terminalTpye')

            // 验证初始列表取得成功
            cy.wait('@getTerminalTypeList').its('response.statusCode').should('eq', 200);

            // 输入查询条件
            cy.get('[data-cy=typ-search-name-input]').type('测试终端2021');
            cy.get('[data-cy=typ-search-manufacturerId-input]').type('1000777');
            cy.wait(600);
            // 点击“查询”
            cy.get('[data-cy=typ-search-button]').click();
        }


    })

    after(() => {
    })

    afterEach(() => {
    })

    it('单条删除成功', () => {

        cy.intercept('/business-admin/terminalType/delete').as('deleteTerminalType');
        // 勾选列表第一行第一列
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        // 点击删除->确定
        cy.get('[data-cy=typ-delete-button]').click();
        cy.contains('是否确认删除该条信息?');
        cy.contains('确定').click();
        cy.wait('@deleteTerminalType');

        // 验证出现成功提示框
        cy.contains('删除终端类型成功！').should('be.visible');
        number++;
    })

    it('取消删除', () => {

        // 勾选列表第一行第一列
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').first()
            .click();
        // 点击删除->确定
        cy.get('[data-cy=typ-delete-button]').click();
        cy.contains('是否确认删除该条信息?');
        cy.contains('取消').click();

        // 期望dialog不显示并出现取消提示
        cy.expectElDialogDismiss('[data-cy=typ_manage_dialog]', true);
        cy.contains('已取消删除').should('be.visible');
        number++;

    })

    it('批量删除成功', () => {
        cy.intercept('/business-admin/terminalType/delete').as('deleteTerminalType');
        // 勾选列表第一行第一列
        for (let selectnum = 0; selectnum < 2; selectnum++) {
            // 勾选列表第一行第一列
            cy.get('[data-cy=typ-data-table]')
                .find('tbody>tr').eq(selectnum)
                .find('td').eq(0)
                .click();
        }

        // 点击删除->确定
        cy.get('[data-cy=typ-delete-button]').click();
        cy.contains('是否确认删除该条信息?');
        cy.contains('确定').click();
        cy.wait('@deleteTerminalType');

        // 验证出现成功提示框
        cy.contains('删除终端类型成功！').should('be.visible');

    })
})