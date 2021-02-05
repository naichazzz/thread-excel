context.skip('组管理-新建', () => {

    before(() => {
    })

    beforeEach(() => {
        // 异步获取终端类型列表
        cy.intercept('/business-admin/group/list').as('getGroupList');

        // 登录，进入系统首页
        cy.login('admin', '1qaz@WS');
        cy.contains('商用车企业平台');
        // 进入“终端类型管理”页面
        cy.visit('/groupManage')

        // 验证初始列表取得成功
        cy.wait('@getGroupList').its('response.statusCode').should('eq', 200);
    })

    after(() => {
    })

    afterEach(() => {
    })

       /**
     * 数据复归
     */
    const restoreData = () => {
        let body = {
            pageNum: 1,
            pageSize: 10,
            groupName: "自动测试群组"
        };
        cy.requestGroupList(body)
            .its('body')
            .then((body => {
                let list = body.data.list;
                let idArr = [];
                for (let i = 0; i < list.length; i++) {
                    idArr.push(list[i].id);
                }
                cy.requestGroupDelete(idArr);
            }));
    }

/*  测试用例  */
    it('新建成功-只创建组信息，不关联车辆', () => {

        cy.intercept('/business-admin/group/list').as('getGroupList');
        cy.intercept('/business-admin/group/add').as('addGroup');
        // 点击“新建”，输入所有信息
        cy.get('[data-cy=gro-create-button]').click();
        cy.title('组管理');
        cy.get('[data-cy=gro-groupName-input]').type('自动测试群组1');
        cy.get('[data-cy=gro-groupCode-input]').type('20210201');
        //cy.get('[data-cy=gro-parentGroupId-select]').elSelect('若依科技');
        cy.get('[data-cy=gro-remark-input]').type('自动化测试用');

        // 点击“确定”按钮
        cy.get('[data-cy=gro-sure-button]').click();

        // 验证出现成功提示
        cy.wait('@addGroup').then((interception) => {
            cy.contains('新增组信息成功').should('be.visible');
        })

        // 输入组搜索，点击“查询”
        cy.get('[data-cy=gro-search-groupName-input]').type('自动测试群组1');
        cy.get('[data-cy=gro-search-button]').click();

        // 待列表刷新后判断数据中是否包含所查终端型号
        // cy.wait('@getGroupList').then((interception) => {
        //     cy.get('[data-cy=gro-data-table]')
        //         .find('tbody>tr').first()
        //         .should('contain', '自动测试群组1');
        // })
        restoreData();

    })

    it('新建成功-组信息和关联车辆同时创建', () => {

        cy.intercept('/business-admin/group/list').as('getGroupList');
        cy.intercept('/business-admin/group/add').as('addGroup');
        // 点击“新建”，输入所有信息
        cy.get('[data-cy=gro-create-button]').click();
        cy.title('组管理');
        cy.get('[data-cy=gro-groupName-input]').type('自动测试群组2');
        cy.get('[data-cy=gro-groupCode-input]').type('20210202');
        cy.get('[data-cy=gro-parentGroupId-select]').elSelect('若依科技');
        cy.get('[data-cy=gro-remark-input]').type('自动化测试用');
        // 点击“添加组车辆”
        cy.get('[data-cy=gro-carTab-form]').click();
        

        // 点击“确定”按钮
        cy.get('[data-cy=gro-sure-button]').click();

        // 验证出现成功提示
        cy.wait('@addGroup').then((interception) => {
            cy.contains('新增组信息成功').should('be.visible');
        })

        // 输入组搜索，点击“查询”
        cy.get('[data-cy=gro-search-groupName-input]').type('自动测试群组1');
        cy.get('[data-cy=gro-search-button]').click();

        // 待列表刷新后判断数据中是否包含所查终端型号
        cy.wait('@getGroupList').then((interception) => {
            cy.get('[data-cy=gro-data-table]')
                .find('tbody>tr').first()
                .should('contain', '自动测试群组1');
        })

    })
    
    it('取消新建', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('组信息页面字段验证', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('组名称唯一性验证', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面元素校验', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-过滤条件可选项', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-待选列表-按车牌号查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-待选列表-按车辆类型查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-待选列表-按SIM卡号查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-待选列表-按企业名称查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-待选列表-按终端类型查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-待选列表-组合条件查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-已选列表-按车牌号查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-已选列表-按车辆类型查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-已选列表-按SIM卡号查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-已选列表-按企业名称查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-已选列表-按终端类型查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-已选列表-组合条件查询', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })
    
    it('车辆信息页面-">>"按钮验证', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

    it('车辆信息页面-"<<"按钮验证', () => {
        /** 准备 */

        /** 操作 */

        /** 期望 */

    })

})
