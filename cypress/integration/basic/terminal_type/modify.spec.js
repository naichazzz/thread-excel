context('终端类型管理-修改', () => {

    before(() => {
    })

    after(() => {
    })

    afterEach(() => {
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

    it('修改成功', () => {

        cy.intercept('/business-admin/terminalType/update').as('updateTerminalType');

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        // 正确修改所有数据
        cy.contains('终端类型维护');
        cy.get('[data-cy=typ-name-input]').clear().type('测试终端0129');
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').clear().type('10009');
        cy.get('[data-cy=typ-manufacturerCityId-input]').clear().type('100099');
        cy.get('[data-cy=typ-manufacturerId-input]').clear().type('1000999');
        cy.get('[data-cy=typ-model-input]').clear().type('29');
        cy.get('[data-cy=typ-factoryId-input]').clear().type('2009');
        cy.get('[data-cy=typ-modelId-input]').clear().type('999');
        // “通讯类型”选择“UDP”
        cy.get('[data-cy=typ-communicationType-select]').elSelect('UDP');

        // 点击“确定”按钮
        cy.get('[data-cy=typ-sure-button]').click();

        // 验证出现成功提示
        cy.wait('@updateTerminalType').then((interception) => {
            cy.contains('修改终端类型成功').should('be.visible');
        })

    })


    it('取消修改', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        // 期望dialog显示
        cy.expectElDialogDismiss('[data-cy=typ_manage_dialog]', false);

        // 点击“取消”按钮
        cy.get('[data-cy=typ-cancel-button]').click();

        // 期望：关闭dialog
        cy.expectElDialogDismiss('[data-cy=typ_manage_dialog]', true);
    })

    it('右上角“X”，关闭修改页面', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        // 期望dialog显示
        cy.expectElDialogDismiss('[data-cy=typ_manage_dialog]', false);

        // 点击右上角的“X”
        cy.get('[data-cy=typ_manage_dialog]')
            .find('.el-dialog__close').click({ force: true });

        // 期望：关闭dialog
        cy.expectElDialogDismiss('[data-cy=typ_manage_dialog]', true);
    })

    it('终端名称必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 终端名称修改为空，其他信息不变
        cy.get('[data-cy=typ-name-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入终端名称”的提示信息
        cy.contains('请输入终端名称').should('be.visible');
    })

    it('设备制造商省ID必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 备制造商省ID修改为空，其他信息不变
        cy.get('[data-cy=typ-manufacturerProvinceId-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“输入设备制造商省ID”的提示信息
        cy.contains('请输入设备制造商省ID').should('be.visible');
    })

    it('设备制造商市ID必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 设备制造商市ID修改为空，其他信息不变
        cy.get('[data-cy=typ-manufacturerCityId-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入设备制造商市ID”的提示信息
        cy.contains('请输入设备制造商市ID').should('be.visible');
    })

    it('制造商ID必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 制造商ID修改为空，其他信息不变
        cy.get('[data-cy=typ-manufacturerId-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入制造商ID”的提示信息
        cy.contains('请输入制造商ID').should('be.visible');
    })

    it('终端型号必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 终端型号修改为空，其他信息不变
        cy.get('[data-cy=typ-model-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入终端型号”的提示信息
        cy.contains('请输入终端型号').should('be.visible');
    })

    it('厂家编码必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 厂家编码修改为空，其他信息不变
        cy.get('[data-cy=typ-factoryId-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入厂家编码”的提示信息
        cy.contains('请输入厂家编码').should('be.visible');
    })

    it('型号编码必填', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');
        // 型号编码修改为空，其他信息不变
        cy.get('[data-cy=typ-modelId-input]').clear();

        // 点击“确定”
        cy.get('[data-cy=typ-sure-button]').click();

        // 给出“请输入型号编码”的提示信息
        cy.contains('请输入型号编码').should('be.visible');
    })

    it('通讯类型的下拉可选项内容', () => {

        // 点击“编辑”
        cy.get('[data-cy=typ-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.contains('终端类型维护');

        // 验证“通讯类型”包括“TCP、UDP”
        cy.get('[data-cy=typ-communicationType-select]')
            .should('contain', 'TCP')
            .should('contain', 'UDP')
    })

})