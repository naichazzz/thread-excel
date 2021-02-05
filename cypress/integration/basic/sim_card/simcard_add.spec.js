/// <reference types="cypress" />
context('SIMCard管理-新增', () => {
    /** ======================= 全局变量 ======================= */
    let baseUrl;
    let base;
    let data;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('base').then((baseData) => {
            base = baseData;
        });
        cy.fixture('basic/sim_card/add').then((addData) => {
            data = addData;
        });
    })

    after(() => {
        restoreData();
    })

    afterEach(() => {
    })

    beforeEach(() => {
        loginSim();
    })

    /** ======================= 全局方法 ======================= */
    const loginSim = () => {
        cy.intercept(baseUrl.simcard.search).as('getSimInitList');
        // 登录
        cy.login(base.userName, base.password);
        // 进入SIM卡管理页面
        cy.visit(baseUrl.simcard.root);
        // 等待初始列表取得成功
        cy.wait('@getSimInitList');
    }

    /**
     * 数据复归
     */
    const restoreData = () => {
        let body = {
            pageNum: 1,
            pageSize: 10,
            simNumber: data.simNumber
        };
        cy.requestSimList(body)
            .its('body')
            .then((body => {
                let list = body.data.list;
                let idArr = [];
                for (let i = 0; i < list.length; i++) {
                    idArr.push(list[i].id);
                }
                cy.requestSimDelete(idArr);
            }));
    }

    /** ======================= 测试用例 ======================= */
    it('新建SIM卡成功', () => {
        /** 准备 */
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');
        cy.intercept(baseUrl.simcard.add).as('addSim');

        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();
        // 等待组列表取得成功
        cy.wait('@getGroupList');
        cy.get('[data-cy=sim-dia-commit-button]').click();
        // 等待添加
        cy.wait('@addSim').then((interception) => {

        });

        /** 期望 */
        // 验证出现成功提示框
        cy.contains('成功').should('be.visible');
    })

    it('新建-SIM卡号为必填项', () => {
        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-next-button]').click();

        /** 期望 */
        cy.contains('请输入').should('be.visible');
    })

    it('新建-SIM卡号已存在', () => {
        /** 准备 */
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');
        cy.intercept(baseUrl.simcard.add).as('addSim');

        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();
        cy.get('[data-cy=sim-dia-commit-button]').click();
        // 等待列表被刷新
        cy.wait('@getGroupList');
        cy.wait('@addSim');

        /** 期望 */
        // SIM卡已经存在
        cy.contains('SIM卡号已经存在').should('be.visible');
    })

    it('新建-所属组为必填项', () => {
        /** 准备 */
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');

        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();
        cy.wait('@getGroupList');
        // 验证第一行被勾选
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .should('be.checked');
        // 第一行取消勾选
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .uncheck({ force: true });
        // 验证第一行未被勾选
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .should('not.be.checked');
        cy.get('[data-cy=sim-dia-commit-button]').click();
        /** 期望 */
        cy.contains('请选择所属组').should('be.visible');
    })


    it('新建-所属组-查询条件显示', () => {
        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();

        /** 期望 */
        // 查询条件显示组名
        cy.get('[data-cy=bas-screen-select]')
            .should('contain', '按组名');
    })

    it.skip('新建-所属组-查询全部', () => {

    })

    it('新建-所属组-查询部分', () => {
        /** 准备 */
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');

        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();
        // 等待组列表被刷新
        cy.wait('@getGroupList');
        // 输入查询条件->查询
        cy.get('[data-cy=bas-screen-input]').type(base.group);
        cy.get('[data-cy=bas-search-button]').click();
        // 等待组列表被刷新
        cy.wait('@getGroupList');

        /** 期望 */
        // 验证第一行中包含查询结果
        cy.get('[data-cy=bas-data-table]')
            .find('tbody>tr').first()
            .should('contain', base.group);
    })

    it('新建-所属组-查询结果展示形式', () => {
        /** 准备 */
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');

        /** 操作 */
        // 新建->输入SIM卡号->下一步
        cy.get('[data-cy=sim-create-button]').click();
        cy.get('[data-cy=sim-dia-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-dia-next-button]').click();
        // 等待列表被刷新
        cy.wait('@getGroupList');
        // 输入查询条件->查询
        cy.get('[data-cy=bas-search-button]').click();

        /** 期望 */
        // 验证第一行被勾选
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .should('be.checked');
    })
})