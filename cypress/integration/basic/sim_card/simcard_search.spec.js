/// <reference types="cypress" />
context('SIMCard管理-查询', () => {
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
      * 数据准备
      */
    const prepareData = () => {
        let gBody = {
            groupName: ""
        };
        cy.requestGroupList(gBody)
            .its('body')
            .then((body => {
                let groupId = body.data[0].childList[1].childList[1].id;
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
    it('查询条件及结果列表显示', () => {
        prepareData();
        /** 期望 */
        cy.contains('SIM卡号').should('be.visible');
        cy.contains('SIM卡状态').should('be.visible');
        cy.contains('所属组').should('be.visible');
        cy.get('[data-cy=sim-data-table]')
            .should('contain', 'SIM卡号')
            .should('contain', 'SIM卡状态')
            .should('contain', '所属组')
            .should('contain', '创建时间')
            .should('contain', '修改时间');
    })

    it('查询条件-SIM卡状态', () => {
        /** 期望 */
        cy.get('[data-cy=sim-screen-sim-status-select]')
            .should('contain', '全部')
            .should('contain', '已用')
            .should('contain', '可用');
    })

    it('按照SIM卡号查询', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        /** 期望 */
        // 验证第一行中包含所查询的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', data.simNumber);
    })

    it('按照SIM卡状态查询-可用', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-status-select]').elSelect('可用');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        /** 期望 */
        // 验证第一行中包含所查询的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', '可用');
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(1)
            .should('contain', '可用');
    })

    it('按照SIM卡状态查询-已用', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-status-select]').elSelect('已用');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        /** 期望 */
        // 验证第一行中包含所查询的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', '已用');
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(1)
            .should('contain', '已用');
    })

    it('按照所属组查询', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        cy.get('[data-cy=sim-screen-group-treeselect]')
            .treeselectRoot()
            .click();
        cy.get('[data-cy=sim-screen-group-treeselect]')
            .treeselectArrow([0])
            .click();
        cy.get('[data-cy=sim-screen-group-treeselect]')
            .treeselectArrow([0, 1])
            .click();;
        cy.get('[data-cy=sim-screen-group-treeselect]')
            .treeselectLabel([0, 1, 1])
            .click({ force: true });

        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        /** 期望 */
        // 验证第一行中包含所查询的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', '财务部门');
    })

    it('多条件组合查询', () => {
        /** 准备 */
        cy.intercept(baseUrl.simcard.search).as('getSimList');

        /** 操作 */
        // 输入SIM卡号->查询
        cy.get('[data-cy=sim-screen-sim-input]').type(data.simNumber);
        cy.get('[data-cy=sim-screen-sim-status-select]').elSelect('可用');
        cy.get('[data-cy=sim-search-button]').click();
        // 待列表刷新
        cy.wait('@getSimList');
        /** 期望 */
        // 验证第一行中包含所查询的SIM卡
        cy.get('[data-cy=sim-data-table]')
            .elTableRow(0)
            .should('contain', data.simNumber)
            .should('contain', '可用');
    })
    it.skip('无查询条件时，即查询全部', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it.skip('结果列表的排列顺序', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    it('结果列表-创建时间的显示格式', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */
        cy.get('[data-cy=sim-data-table]')
            .elTableCell(0, 4)
            .find('div')
            .should(($div) => {
                const timeStr = $div.text();
                expect(timeStr).to.equal('2020-12-23 01:52:38');
            });
    })
    it('结果列表-修改时间的显示格式', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */
        cy.get('[data-cy=sim-data-table]')
            .elTableCell(0, 5)
            .find('div')
            .should(($div) => {
                const timeStr = $div.text();
                expect(timeStr).to.equal('2020-12-23 01:52:38');
            });
    })

})