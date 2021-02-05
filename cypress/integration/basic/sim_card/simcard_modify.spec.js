/// <reference types="cypress" />
context('SIMCard管理-修改', () => {
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
        cy.fixture('basic/sim_card/modify').then((modifyData) => {
            data = modifyData;
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
     * 数据准备
     */
    const prepareData = () => {
        let gBody = {
            groupName: ""
        };
        cy.requestGroupList(gBody)
            .its('body')
            .then((body => {
                let groupId = body.data[0].id;
                let sBody = {
                    gid: groupId,
                    simNumber: data.simNumber
                };
                cy.requestSimAdd(sBody);
            }));
    }

    /**
     * 数据复归
     */
    const restoreData = () => {
        let body = {
            pageNum: 1,
            pageSize: 10,
            simNumber: data.simCard
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
    it('修改可用状态的SIM卡信息', () => {
        prepareData();
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        // 验证第一行中包含所要删除的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', data.simNumber)
            .should('contain', base.group);
        // 编辑
        cy.get('[data-cy=sim-data-table]')
            .elTableLastCell(0)
            .find('button')
            .click({ force: true });
        cy.get('[data-cy=sim-dia-next-button]').click();
        // 验证第一行被勾选
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .should('be.checked');
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(1)
            .check({ force: true });
        cy.get('[data-cy=sim-dia-commit-button]').click();

        /** 期望 */
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', data.simNumber)
            .should('not.contain', base.group);

        /** 复归 */
        cy.get('[data-cy=sim-data-table]')
            .elTableLastCell(0)
            .find('button').click({ force: true });
        cy.get('[data-cy=sim-dia-next-button]').click();
        cy.get('[data-cy=bas-data-table]')
            .elTableCheckbox(0)
            .check({ force: true });
        cy.get('[data-cy=sim-dia-commit-button]').click();
    })

    it('修改已用状态的SIM卡信息', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');
        cy.intercept(baseUrl.groupManage.search).as('getGroupList');

        /** 操作 */
        // 已用->查询
        cy.get('[data-cy=sim-screen-sim-status-select]').elSelect('已用');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        // 验证第一行中包含所要删除的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .find('tbody>tr').first()
            .should('contain', '已用');
        // 编辑
        cy.get('[data-cy=sim-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        cy.get('[data-cy=sim-dia-next-button]').click();
        cy.wait('@getGroupList');
        cy.get('[data-cy=sim-dia-commit-button]').click();

        /** 期望 */
        cy.contains('修改SIM失败,SIM已经被绑定').should('be.visible');
    })

    it('修改-SIM卡号为必填项', () => {
        /** 准备 */

        /** 操作 */
        // 编辑
        cy.get('[data-cy=sim-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });

        /** 期望 */
        cy.get('[data-cy=sim-dia-sim-input]')
            .should('be.disabled');
    })

    it.skip('修改-SIM卡号已存在', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('关闭修改SIM卡页面', () => {
        /** 准备 */

        /** 操作 */
        // 编辑
        cy.get('[data-cy=sim-data-table]')
            .find('tbody>tr').first()
            .find('td').last()
            .find('button').click({ force: true });
        // 期望dialog显示
        cy.expectElDialogDismiss('[data-cy=sim_manage_dialog]', false);

        cy.get('[data-cy=sim_manage_dialog]')
            .find('.el-dialog__close').click({ force: true });

        /** 期望 */
        // 期望dialog不显示
        cy.expectElDialogDismiss('[data-cy=sim_manage_dialog]', true);
    })

})