const config = require('./config');
const _ = require('lodash');

const node_acl = require('acl');
const mongoose = require('mongoose');

mongoose.set('debug', true);

const removeAllAllow = async (acl, role) => {
  const resources = await acl.whatResources(role);
  await Promise.all(_.map(resources, async (p, r) => await acl.removeAllow(role, r, p)));
};

const whatResources = async (acl, role) => {
  console.log(`${role}:`, await acl.whatResources(role));
};

const series = async () => {
  try {
    await mongoose.connect(config.mongoose.connect);
    const acl = new node_acl(new node_acl.mongodbBackend(mongoose.connection.db, config.id));

    // clean all
    await removeAllAllow(acl, 'super_admin');
    await removeAllAllow(acl, 'chief_manager'); // 项目总经理
    await removeAllAllow(acl, 'ticket_manager'); // 工单管理者
    await removeAllAllow(acl, 'finace_staff'); // 财务总监
    await removeAllAllow(acl, 'building_manager'); // 运营服务
    await removeAllAllow(acl, 'building_service'); // 客服
    await removeAllAllow(acl, 'fee_confirmer'); // 费用确认员
    await removeAllAllow(acl, 'repair_manager'); // 工程经理
    await removeAllAllow(acl, 'repair_team'); // 维修人员
    await removeAllAllow(acl, 'security_manager'); // 安保经理
    await removeAllAllow(acl, 'security_team'); // 安保人员
    await removeAllAllow(acl, 'content_manager'); // 内容管理员

    // 超级管理员
    await acl.allow('super_admin', 'building', 'admin');
    await acl.allow('super_admin', 'company', 'admin');
    await acl.allow('super_admin', 'user', 'admin');
    await acl.allow('super_admin', 'e_card', 'admin');
    await acl.allow('super_admin', 'parking_service', 'admin');
    await acl.allow('super_admin', 'admin', 'admin');
    await acl.allow('super_admin', 'cms', 'admin');
    await acl.allow('super_admin', 'ticket_template', 'admin');
    await acl.allow('super_admin', 'message', 'admin');
    await acl.allow('super_admin', 'guest_visit', 'admin');
    await acl.allow('super_admin', 'batchly_visitor', 'admin');
    await acl.allow('super_admin', 'completed_acceptance_check', 'admin');
    await acl.allow('super_admin', 'deposit_refund', 'admin');
    await acl.allow('super_admin', 'decoration_application', 'admin');
    await acl.allow('super_admin', 'goods_letin', 'admin');
    await acl.allow('super_admin', 'goods_letout', 'admin');
    await acl.allow('super_admin', 'hide_acceptance_check', 'admin');
    await acl.allow('super_admin', 'individual_visitor', 'admin');
    await acl.allow('super_admin', 'office_handover', 'admin');
    await acl.allow('super_admin', 'property_repair', 'admin');
    await acl.allow('super_admin', 'reserve_visit', 'admin');
    await acl.allow('super_admin', 'settle_in', 'admin');
    await acl.allow('super_admin', 'settle_out', 'admin');
    await acl.allow('super_admin', 'meter', 'admin');
    await acl.allow('super_admin', 'complaint_advice', 'admin');
    await acl.allow('super_admin', 'parking_apply', 'admin');

    // 项目经理 / 现场执行经理
    await acl.allow('chief_manager', 'building', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'company', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'user', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'e_card', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'parking_service', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'admin', ['list', 'show']);
    await acl.allow('chief_manager', 'cms', ['list', 'show']);
    await acl.allow('chief_manager', 'ticket_template', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'message', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'guest_visit', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'batchly_visitor', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'completed_acceptance_check', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'deposit_refund', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'decoration_application', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'goods_letin', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'goods_letout', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'hide_acceptance_check', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'individual_visitor', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'office_handover', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'property_repair', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'reserve_visit', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'settle_in', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'settle_out', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'meter', ['list', 'show', 'add', 'edit']);
    await acl.allow('chief_manager', 'complaint_advice', ['list', 'show', 'add', 'edit']);

    // 工单管理者
    await acl.allow('ticket_manager', 'message', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'guest_visit', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'batchly_visitor', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'completed_acceptance_check', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'deposit_refund', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'decoration_application', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'goods_letin', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'goods_letout', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'hide_acceptance_check', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'individual_visitor', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'office_handover', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'property_repair', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'reserve_visit', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'settle_in', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'settle_out', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'meter', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'complaint_advice', ['list', 'show', 'add', 'edit']);
    await acl.allow('ticket_manager', 'parking_apply', ['list', 'show', 'add', 'edit']);

    // 财务总监
    await acl.allow('finace_staff', 'building', ['list', 'show', 'add', 'edit']);
    await acl.allow('finace_staff', 'company', ['list', 'show', 'add', 'edit', 'batchly_charge']);
    await acl.allow('finace_staff', 'user', ['list', 'show', 'add', 'edit']);
    await acl.allow('finace_staff', 'e_card', ['list', 'show', 'add', 'edit']);
    await acl.allow('finace_staff', 'parking_service', ['list', 'show', 'add', 'edit']);
    await acl.allow('finace_staff', 'cms', ['list', 'show']);
    await acl.allow('finace_staff', 'message', ['show', 'add', 'edit']);
    await acl.allow('finace_staff', 'guest_visit', ['list', 'show']);
    await acl.allow('finace_staff', 'batchly_visitor', ['list', 'show']);
    await acl.allow('finace_staff', 'completed_acceptance_check', ['list', 'show']);
    await acl.allow('finace_staff', 'deposit_refund', ['list', 'show']);
    await acl.allow('finace_staff', 'decoration_application', ['list', 'show']);
    await acl.allow('finace_staff', 'goods_letin', ['list', 'show']);
    await acl.allow('finace_staff', 'goods_letout', ['list', 'show']);
    await acl.allow('finace_staff', 'hide_acceptance_check', ['list', 'show']);
    await acl.allow('finace_staff', 'individual_visitor', ['list', 'show']);
    await acl.allow('finace_staff', 'office_handover', ['list', 'show']);
    await acl.allow('finace_staff', 'property_repair', ['list', 'show']);
    await acl.allow('finace_staff', 'reserve_visit', ['list', 'show']);
    await acl.allow('finace_staff', 'settle_in', ['list', 'show']);
    await acl.allow('finace_staff', 'settle_out', ['list', 'show']);
    await acl.allow('finace_staff', 'meter', ['list', 'show']);
    await acl.allow('finace_staff', 'complaint_advice', ['list', 'show']);

    // 管家／客服
    await acl.allow('building_manager', 'building', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_manager', 'company', ['list', 'show', 'add', 'edit', 'batchly_charge']);
    await acl.allow('building_manager', 'user', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_manager', 'e_card', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_manager', 'parking_service', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_manager', 'cms', ['list', 'show']);
    await acl.allow('building_manager', 'ticket_template', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_manager', 'message', ['show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'guest_visit', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'batchly_visitor', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'completed_acceptance_check', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'deposit_refund', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'decoration_application', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'goods_letin', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'goods_letout', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'hide_acceptance_check', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'individual_visitor', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'office_handover', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'property_repair', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'reserve_visit', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'settle_in', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'settle_out', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'meter', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'complaint_advice', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_manager', 'parking_apply', ['list', 'show', 'add', 'edit']);

    await acl.allow('building_service', 'building', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_service', 'company', ['list', 'show', 'add', 'edit', 'batchly_charge']);
    await acl.allow('building_service', 'user', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_service', 'e_card', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_service', 'parking_service', ['list', 'show', 'add', 'edit']);
    await acl.allow('building_service', 'cms', ['list', 'show']);
    await acl.allow('building_service', 'message', ['show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'guest_visit', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'batchly_visitor', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'completed_acceptance_check', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'deposit_refund', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'decoration_application', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'goods_letin', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'goods_letout', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'hide_acceptance_check', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'individual_visitor', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'office_handover', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'property_repair', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'reserve_visit', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'settle_in', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'settle_out', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'meter', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('building_service', 'complaint_advice', ['list', 'show', 'add', 'edit', 'send']);

    // 保安部
    await acl.allow('security_manager', 'building', ['list', 'show']);
    await acl.allow('security_manager', 'company', ['list', 'show']);
    await acl.allow('security_manager', 'user', ['list', 'show']);
    await acl.allow('security_manager', 'e_card', ['list', 'show']);
    await acl.allow('security_manager', 'parking_service', ['list', 'show']);
    await acl.allow('security_manager', 'cms', ['list', 'show']);
    await acl.allow('security_manager', 'message', ['show']);
    await acl.allow('security_manager', 'guest_visit', ['list', 'show']);
    await acl.allow('security_manager', 'batchly_visitor', ['list', 'show']);
    await acl.allow('security_manager', 'completed_acceptance_check', ['list', 'show']);
    await acl.allow('security_manager', 'deposit_refund', ['list', 'show']);
    await acl.allow('security_manager', 'decoration_application', ['list', 'show']);
    await acl.allow('security_manager', 'goods_letin', ['list', 'show']);
    await acl.allow('security_manager', 'goods_letout', ['list', 'show']);
    await acl.allow('security_manager', 'hide_acceptance_check', ['list', 'show']);
    await acl.allow('security_manager', 'individual_visitor', ['list', 'show']);
    await acl.allow('security_manager', 'office_handover', ['list', 'show']);
    await acl.allow('security_manager', 'property_repair', ['list', 'show']);
    await acl.allow('security_manager', 'reserve_visit', ['list', 'show']);
    await acl.allow('security_manager', 'settle_in', ['list', 'show']);
    await acl.allow('security_manager', 'settle_out', ['list', 'show']);
    await acl.allow('security_manager', 'meter', ['list', 'show']);
    await acl.allow('security_manager', 'complaint_advice', ['list', 'show']);

    // 保安
    await acl.allow('security_team', 'guest_visit', ['list', 'show']);
    await acl.allow('security_team', 'batchly_visitor', ['list', 'show']);
    await acl.allow('security_team', 'goods_letin', ['list', 'show']);
    await acl.allow('security_team', 'goods_letout', ['list', 'show']);
    await acl.allow('security_team', 'individual_visitor', ['list', 'show']);
    await acl.allow('security_team', 'message', ['show']);

    // 工程部
    await acl.allow('repair_manager', 'building', ['list', 'show']);
    await acl.allow('repair_manager', 'company', ['list', 'show']);
    await acl.allow('repair_manager', 'user', ['list', 'show']);
    await acl.allow('repair_manager', 'e_card', ['list', 'show']);
    await acl.allow('repair_manager', 'parking_service', ['list', 'show']);
    await acl.allow('repair_manager', 'cms', ['list', 'show']);
    await acl.allow('repair_manager', 'message', ['show', 'add']);
    await acl.allow('repair_manager', 'guest_visit', ['list', 'show']);
    await acl.allow('repair_manager', 'batchly_visitor', ['list', 'show']);
    await acl.allow('repair_manager', 'completed_acceptance_check', ['list', 'show']);
    await acl.allow('repair_manager', 'deposit_refund', ['list', 'show']);
    await acl.allow('repair_manager', 'decoration_application', ['list', 'show']);
    await acl.allow('repair_manager', 'goods_letin', ['list', 'show']);
    await acl.allow('repair_manager', 'goods_letout', ['list', 'show']);
    await acl.allow('repair_manager', 'hide_acceptance_check', ['list', 'show']);
    await acl.allow('repair_manager', 'individual_visitor', ['list', 'show']);
    await acl.allow('repair_manager', 'office_handover', ['list', 'show']);
    await acl.allow('repair_manager', 'property_repair', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('repair_manager', 'reserve_visit', ['list', 'show']);
    await acl.allow('repair_manager', 'settle_in', ['list', 'show']);
    await acl.allow('repair_manager', 'settle_out', ['list', 'show']);
    await acl.allow('repair_manager', 'meter', ['list', 'show', 'add', 'edit']);
    await acl.allow('repair_manager', 'complaint_advice', ['list', 'show']);
    // 维修
    await acl.allow('repair_team', 'property_repair', ['list', 'show', 'add', 'edit', 'send']);
    await acl.allow('repair_team', 'meter', ['list', 'show', 'add']);
    await acl.allow('repair_team', 'company', ['list', 'show', 'meter']);
    await acl.allow('repair_team', 'user', ['show']);
    await acl.allow('repair_team', 'message', ['show']);

    // 费用确认员
    await acl.allow('fee_confirmer', 'settle_in', ['list', 'show']);
    await acl.allow('fee_confirmer', 'settle_out', ['list', 'show']);
    await acl.allow('fee_confirmer', 'goods_letin', ['list', 'show']);
    await acl.allow('fee_confirmer', 'goods_letout', ['list', 'show']);
    await acl.allow('fee_confirmer', 'deposit_refund', ['list', 'show', 'edit']);
    await acl.allow('fee_confirmer', 'message', ['show']);

    //
    await acl.allow('content_manager', 'cms', ['list', 'show', 'add', 'edit']);

    // list all
    await whatResources(acl, 'super_admin');
    await whatResources(acl, 'chief_manager'); // 项目总经理
    await whatResources(acl, 'ticket_manager'); // 工单管理者
    await whatResources(acl, 'finace_staff'); // 财务总监
    await whatResources(acl, 'building_manager'); // 运营服务
    await whatResources(acl, 'building_service'); // 客服
    await whatResources(acl, 'fee_confirmer'); // 商务中心
    await whatResources(acl, 'repair_manager'); // 工程经理
    await whatResources(acl, 'repair_team'); // 维修人员
    await whatResources(acl, 'security_manager'); // 安保经理
    await whatResources(acl, 'security_team'); // 安保人员
    await whatResources(acl, 'content_manager'); // 内容管理员

    //set default user
    await acl.addUserRoles('6055120@qq.com', 'super_admin');
    await acl.addUserRoles('cm@qq.com', 'chief_manager');
    await acl.addUserRoles('fs@qq.com', 'finace_staff');
    await acl.addUserRoles('rt@qq.com', 'repair_team');
    await acl.addUserRoles('bs@qq.com', 'building_service');
    await acl.addUserRoles('admin@gmail.com', 'super_admin');
  } catch (err) {
    console.error('There was an error', err);
  }
  await mongoose.connection.close();
};

series().then(() => {
  process.exit();
});
