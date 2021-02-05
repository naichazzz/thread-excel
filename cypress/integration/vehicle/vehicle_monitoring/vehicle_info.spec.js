context('车辆监控-选择车辆', () => {
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
        // cy.visit(base.urlWatchMap);
    }

    /**
     * 数据复归
     */
    const restoreData = () => {
    }

    /** ======================= 测试用例 ======================= */

    it('页面查询区域字段显示', () => {
        /* 期望 */
        // cy.contains('IP/URL地址').should('be.visible');
        // cy.contains('TCP端口').should('be.visible');
        // cy.get('[data-cy=com-data-table]')
        //     .should('contain', '车牌号')
        //     .should('contain', 'SIM卡号')
        //     .should('contain', 'VIN')
        //     .should('contain', '企业名称')
        //     .should('contain', '终端类型')
        //     .should('contain', '终端号码')
        //     .should('contain', '在线状态')
        //     .should('contain', '车辆类型')
        //     .should('contain', '通讯类型');
        // cy.get('button')
        //     .should('contain', '选择车辆')
        //     .should('contain', '设置');
    })
    it('查询条件-企业名称', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */
        // cy.get('[data-cy=cal-ip-select]').elSelect('货运平台');
    })
    it('查询条件-终端类型', () => {
        /** 准备 */

        /** 操作 */
        cy.get('[data-cy=cal-ip-select]').elSelect('货运平台');
        cy.get('[data-cy=cal_setting_button]').click();

        /** 期望 */
        cy.contains('请选择车辆').should('be.visible');
    })
    it('查询条件-车辆类型', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('车辆信息列表区域显示', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('车辆信息列表排列顺序', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('车辆信息列表数据过多时的展示方式', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('查询全部车辆', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('查询部分车辆', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('单一车辆选择成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('多条车辆选择成功', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('分页功能验证', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

})