/// <reference types="Cypress" />
context('终端类型管理', () => {
    before(() => {
    })

    beforeEach(() => {
        // 异步获取终端类型列表
        cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');

        // 登录，进入系统首页
        cy.login('admin', '1qaz@WS');
        cy.contains('商用车企业平台')

        // 进入“终端类型管理”页面
        cy.visit('/terminalTpye')

        // 验证初始列表取得成功
        cy.wait('@getTerminalTypeList').its('response.statusCode').should('eq', 200);

    })

    after(() => {
    })

    afterEach(() => {
    })

    it('查询条件及结果列表显示', () => {
        // 期望 
        cy.contains('终端名称').should('be.visible');
        cy.contains('制造商ID').should('be.visible');
        cy.contains('设备制造商省ID').should('be.visible');
        cy.contains('设备制造商市ID').should('be.visible');
        cy.contains('终端型号').should('be.visible');
        cy.contains('型号编码').should('be.visible');
        cy.contains('厂家编码').should('be.visible');
        cy.contains('通讯类型').should('be.visible');
        cy.get('[data-cy=typ-data-table]')
            .should('contain', '终端类型名称')
            .should('contain', '设备制造商省ID')
            .should('contain', '设备制造商市ID')
            .should('contain', '制造商ID')
            .should('contain', '终端型号')
            .should('contain', '厂家编码')
            .should('contain', '型号编码')
            .should('contain', '通讯类型');
    })

    it('按终端名称-查询', () => {
        // 输入终端名称
        cy.get('[data-cy=typ-search-name-input]').type('测试终端0128');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '测试终端0128');
    })

    it('按制造商ID-查询', () => {
        // 输入制造商ID
        cy.get('[data-cy=typ-search-manufacturerId-input]').type('1000555');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '1000555');
    })

    it('按设备制造商省ID-查询', () => {
        // 输入设备制造商省ID
        cy.get('[data-cy=typ-search-manufacturerProvinceId-input]').type('10005');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '10005');
    })

    it('按设备制造商市ID-查询', () => {
        // 输入设备制造商市ID
        cy.get('[data-cy=typ-search-manufacturerCityId-input]').type('100055');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '100055');
    })

    it('按终端型号-查询', () => {
        // 输入终端型号
        cy.get('[data-cy=typ-search-model-input]').type('28');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '28');
    })

    it('按型号编码-查询', () => {
        // 输入型号编码
        cy.get('[data-cy=typ-search-modelId-input]').type('555');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '555');
    })

    it('按厂家编码-查询', () => {
        // 输入厂家编码
        cy.get('[data-cy=typ-search-factoryId-input]').type('2021');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '2021');
    })

    it('通讯类型的下拉可选项内容', () => {

        // 验证“通讯类型”包括“TCP、UDP”
        cy.get('[data-cy=typ-search-communicationType-select]')
            .should('contain', '全部')
            .should('contain', 'TCP')
            .should('contain', 'UDP')
    })

    it('按通讯类型-TCP-查询', () => {
        // 通讯类型选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', 'TCP');
    })

    it('按通讯类型-UDP-查询', () => {
        // 通讯类型选择“UDP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('UDP');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', 'UDP');
    })

    it('组合条件查询', () => {
        // 输入所有查询条件
        cy.get('[data-cy=typ-search-name-input]').type('测试终端0128');
        cy.get('[data-cy=typ-search-manufacturerId-input]').type('1000555');
        cy.get('[data-cy=typ-search-manufacturerProvinceId-input]').type('10005');
        cy.get('[data-cy=typ-search-manufacturerCityId-input]').type('100055');
        cy.get('[data-cy=typ-search-model-input]').type('28');
        cy.get('[data-cy=typ-search-modelId-input]').type('555');
        cy.get('[data-cy=typ-search-factoryId-input]').type('2021');
        cy.get('[data-cy=typ-communicationType-select]').elSelect('UDP');
        cy.wait(600);
        // 点击“查询”
        cy.get('[data-cy=typ-search-button]').click();
        // 期望
        cy.get('[data-cy=typ-data-table]')
            .elTableRow(0)
            .should('contain', '测试终端0128')
            .should('contain', '1000555')
            .should('contain', '10005')
            .should('contain', '100055')
            .should('contain', '28')
            .should('contain', '555')
            .should('contain', '2021')
            .should('contain', 'UDP')
    })

})