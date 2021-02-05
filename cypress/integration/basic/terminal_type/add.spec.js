/// <reference types="Cypress" />
context('终端类型管理-新增', () => {
    before(() => {
    })

    beforeEach(() => {
        // 异步获取终端类型列表
        cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');

        // 登录，进入系统首页
        cy.login('admin', '1qaz@WS');
        cy.contains('商用车企业平台');
        // 进入“终端类型管理”页面
        cy.visit('/terminalTpye')

        // 验证初始列表取得成功
        cy.wait('@getTerminalTypeList').its('response.statusCode').should('eq', 200);

    })

    after(() => {
    })

    afterEach(() => {
    })

    it('新增页面元素验证', () => {
        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.title('终端类型维护');
        cy.contains('终端名称').should('be.visible');
        cy.contains('设备制造商省ID').should('be.visible');
        cy.contains('设备制造商市ID').should('be.visible');
        cy.contains('制造商ID').should('be.visible');
        cy.contains('终端型号').should('be.visible');
        cy.contains('厂家编码').should('be.visible');
        cy.contains('型号编码').should('be.visible');
        cy.contains('通讯类型').should('be.visible');
        cy.contains('确定').should('be.visible');
        cy.contains('取消').should('be.visible');
    })

    it('新建成功', () => {

        cy.intercept('/business-admin/terminalType/list').as('getTerminalTypeList');
        cy.intercept('/business-admin/terminalType/add').as('addTerminalType');
        // 点击“新建”，输入所有信息
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        cy.get('[data-cy=typ-name-input]').type('测试终端0128');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10005');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100055');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000555');
        cy.get('[data-cy=typ-model-input]').type('28');
        cy.get('[data-cy=typ-factoryId-input]').type('2021');
        cy.get('[data-cy=typ-modelId-input]').type('555');
        // “通讯类型”选择“UDP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('UDP');

        // 点击“确定”按钮
        cy.get('[data-cy=typ-sure-button]').click();

        // 验证出现成功提示
        cy.wait('@addTerminalType').then((interception) => {
            cy.contains('新增终端类型成功').should('be.visible');
        })

        // 输入终端名称，点击“查询”
        cy.get('[data-cy=typ-search-name-input]').type('测试终端0128');
        cy.get('[data-cy=typ-search-button]').click();

        // 待列表刷新后判断数据中是否包含所查终端型号
        cy.wait('@getTerminalTypeList').then((interception) => {
            cy.get('[data-cy=typ-data-table]')
                .find('tbody>tr').first()
                .should('contain', '测试终端0128');
        })
    })

    it('新建取消', () => {

        // 点击“新建”，输入所有信息
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“取消”按钮
        cy.get('[data-cy=typ-cancel-button]').click();

        // 返回上一层页面并刷新
        cy.go(-1).reload();        

    })

    it('终端名称必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入终端名称，其他信息正确填写
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');

        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入终端名称”的提示信息
        cy.contains('请输入终端名称').should('be.visible');
    })

    it('设备制造商省ID必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');

        // 不输入备制造商省ID，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“输入设备制造商省ID”的提示信息
        cy.contains('请输入设备制造商省ID').should('be.visible');
    })

    it('设备制造商市ID必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入备制造商市ID，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入设备制造商市ID”的提示信息
        cy.contains('请输入设备制造商市ID').should('be.visible');
    })

    it('制造商ID必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入造商ID，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入制造商ID”的提示信息
        cy.contains('请输入制造商ID').should('be.visible');
    })

    it('终端型号必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入端型号，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入终端型号”的提示信息
        cy.contains('请输入终端型号').should('be.visible');
    })

    it('厂家编码必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入厂家编码，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-modelId-input]').type('333');

        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入厂家编码”的提示信息
        cy.contains('请输入厂家编码').should('be.visible');
    })

    it('型号编码必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不输入型号编码，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');

        // “通讯类型”选择“TCP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('TCP');

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入型号编码”的提示信息
        cy.contains('请输入型号编码').should('be.visible');
    })

    it('通讯类型必填', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');
        // 不选择通讯类型，其他信息正确填写
        cy.get('[data-cy=typ-name-input]').type('测试终端0126');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').type('10002');
        cy.get('[data-cy=typ-manufacturerCityId-input]').type('100022');
        cy.get('[data-cy=typ-manufacturerId-input]').type('1000222');
        cy.get('[data-cy=typ-model-input]').type('15');
        cy.get('[data-cy=typ-factoryId-input]').type('222');
        cy.get('[data-cy=typ-modelId-input]').type('333');
        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入通讯类型”的提示信息
        cy.contains('请输入通讯类型').should('be.visible');
    })

    it('通讯类型的下拉可选项内容', () => {

        // 点击“新建”
        cy.get('[data-cy=typ-create-button]').click();
        cy.contains('终端类型维护');

        // 验证“通讯类型”包括“TCP、UDP”
        cy.get('[data-cy=typ-communicationType-select]')
            .should('contain', 'TCP')
            .should('contain', 'UDP')
    })
})
