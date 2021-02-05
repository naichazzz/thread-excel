/// <reference types="cypress" />
context('SIMCard管理-删除', () => {
    /** ======================= 全局变量 ======================= */
    let baseUrl;
    let base;
    let data;
    let simCards;
    /** ======================= 生命周期函数 ======================= */
    before(() => {
        cy.fixture('base_url').then((par) => {
            baseUrl = par;
        });
        cy.fixture('base').then((baseData) => {
            base = baseData;
        });
        cy.fixture('basic/sim_card/delete').then((deleteData) => {
            data = deleteData;
            simCards = deleteData.simCards;
        });
    })

    after(() => {
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
     * 数据准备
     */
    const prepareMultipleData = () => {
        let gBody = {
            groupName: ""
        };
        cy.requestGroupList(gBody)
            .its('body')
            .then((body => {
                let groupId = body.data[0].id;
                for (let i = 0; i < simCards.length; i++) {
                    let sBody = {
                        gid: groupId,
                        simNumber: simCards[i].simNumber
                    };
                    cy.requestSimAdd(sBody);
                }
            }));
    }

    /** ======================= 测试用例 ======================= */
    it('删除一条可用状态的SIM卡信息', () => {
        prepareData();
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimListAfter');
        cy.intercept(baseUrl.simcard.delete).as('deleteSim');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimListAfter');
        // 验证第一行中包含所要删除的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', data.simNumber)
            .should('contain', '可用');
        // 勾选第一行
        cy.get('[data-cy=sim-data-table]')
            .elTableCheckbox(0)
            .check({ force: true });
        //点击删除->确定
        cy.get('[data-cy=sim-delete-button]').click();
        cy.contains('确定').click();
        cy.wait('@deleteSim');

        /** 期望 */
        // 验证出现成功提示框
        cy.contains('删除SIM卡信息成功').should('be.visible');
    })
    it('删除一条已用状态的SIM卡信息', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');
        cy.intercept(baseUrl.simcard.delete).as('deleteSim');

        /** 操作 */
        // 已用->查询
        cy.get('[data-cy=sim-screen-sim-status-select]').elSelect('已用');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        // 验证第一行中包含所要删除的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', '已用');
        // 勾选第一行
        cy.get('[data-cy=sim-data-table]')
            .elTableCheckbox(0)
            .check({ force: true });
        //点击删除->确定
        cy.get('[data-cy=sim-delete-button]').click();
        cy.contains('确定').click();
        cy.wait('@deleteSim');

        /** 期望 */
        // 验证出现成功提示框
        cy.contains('删除SIM失败,SIM已经被绑定').should('be.visible');
    })
    it('删除多条可用状态的SIM卡信息', () => {
        /** 准备 */
        prepareMultipleData();
        cy.intercept(baseUrl.simcard.search).as('getSimList');
        cy.intercept(baseUrl.simcard.delete).as('deleteSim');
        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-input]').type('1864313111');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        // 验证包含所要删除的SIM卡
        for (let i = 0; i < simCards.length; i++) {
            cy.get('[data-cy=sim-data-table]')
                .elTableRow(i)
                .should('contain', simCards[i].simNumber);
        }
        // 勾选多条数据
        for (let i = 0; i < simCards.length; i++) {
            cy.get('[data-cy=sim-data-table]')
                .elTableCheckbox(i)
                .check({ force: true });
        }
        //点击删除->确定
        cy.get('[data-cy=sim-delete-button]').click();
        cy.contains('确定').click();
        cy.wait('@deleteSim');

        /** 期望 */
        cy.contains('删除SIM卡信息成功');
        for (let i = 0; i < simCards.length; i++) {
            cy.get('[data-cy=sim-data-table]')
                .should('not.contain', simCards[i].simNumber);
        }
    })
    it('取消删除', () => {
        /** 准备 */

        /** 操作 */
        // 勾选第一行
        cy.get('[data-cy=sim-data-table]')
            .elTableCheckbox(0)
            .check({ force: true });
        //点击删除->确定
        cy.get('[data-cy=sim-delete-button]').click();
        cy.contains('取消').click();
        /** 期望 */
        cy.contains('已取消删除');
    })

})