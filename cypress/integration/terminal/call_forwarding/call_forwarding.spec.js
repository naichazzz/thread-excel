context('车辆呼转', () => {
    /** ======================= 全局变量 ======================= */
    let base;
    let data;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base').then((baseData) => {
            base = baseData;
        });
        // cy.fixture('sim_card/add').then((addData) => {
        //     data = addData;
        // });
    })

    after(() => {
        restoreData();
    })

    afterEach(() => {
    })

    beforeEach(() => {
        loginCallForwarding();
    })

    /** ======================= 全局方法 ======================= */
    const loginCallForwarding = () => {
        cy.login(base.userName, base.password);
        cy.visit(base.urlCallForwarding);
    }

    /**
     * 数据复归
     */
    const restoreData = () => {
    }

    /** ======================= 测试用例 ======================= */

    it('车辆呼转页面内容', () => {
        /* 期望 */
        cy.contains('IP/URL地址').should('be.visible');
        cy.contains('TCP端口').should('be.visible');
        cy.get('[data-cy=com-data-table]')
            .should('contain', '车牌号')
            .should('contain', 'SIM卡号')
            .should('contain', 'VIN')
            .should('contain', '企业名称')
            .should('contain', '终端类型')
            .should('contain', '终端号码')
            .should('contain', '在线状态')
            .should('contain', '车辆类型')
            .should('contain', '通讯类型');
        cy.get('button')
            .should('contain', '选择车辆')
            .should('contain', '设置');
    })
    it('车辆呼转-IP/URL地址的展示形式', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */
        cy.get('[data-cy=cal-ip-select]').elSelect('货运平台');
    })
    it('车辆呼转-不选择车辆设置', () => {
        /** 准备 */

        /** 操作 */
        cy.get('[data-cy=cal-ip-select]').elSelect('货运平台');
        cy.get('[data-cy=cal_setting_button]').click();

        /** 期望 */
        cy.contains('请选择车辆').should('be.visible');
    })
    it('车辆呼转-成功', () => {
        /** 准备 */
        // cy.intercept('/business-admin/monitor/vehicleInfo').as('getVehicleList');

        /** 操作 */
        cy.get('[data-cy=cal-ip-select]').elSelect('货运平台');
        cy.get('[data-cy=cal_select_car_button]').click();
        cy.wait(2000);

        // cy.wait('@getVehicleList');
        // cy.get('[data-cy=cho-data-table]').elTableCheckbox(0).click();
        // cy.get('[data-cy=cho-commit-button]').click({ force: true });

        // cy.get('[data-cy=cal_setting_button]').click();
        /** 期望 */

    })
    it('车辆呼转-不成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-页面查询区域字段显示', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询条件-企业名称', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询条件-终端类型', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询条件-在线状态', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询条件-车辆类型', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-车辆信息列表区域显示', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询全部车辆', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-查询部分车辆', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-单一车辆选择成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-多条车辆选择成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-全部车辆选择成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('选择车辆-取消选择', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

})