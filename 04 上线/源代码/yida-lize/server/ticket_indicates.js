module.exports = {
  property_repair: [
    {
      progress: '已受理',
      header: '6-1已受理',
      body: '用户发起维修申请',
    },
    {
      progress: '接单或派单',
      header: '6-2接单或派单',
      body: '工程经理受理企业的维修的申请',
    },
    {
      progress: '任务接单',
      header: '6-3任务接单',
      body: '维修人员接单',
    },
    {
      progress: '上门检修',
      header: '6-4上门检修',
      body: '维修人员上门检修',
    },
    {
      progress: '维修施工',
      header: '6-5维修施工',
      body: '维修人员确认难易度，免费的直接施工，收费的场合联系工程经理确认是否施工，并输入处理结果',
    },
    {
      progress: '处理完毕',
      header: '6-6处理完毕',
      body: '维修完成后推送消息通知企业客户',
    }
  ],
  complaint_advice: [
    {
      progress: '已受理',
      header: '3-1受理投诉',
      body: '运营服务经理受理投诉',
    },
    {
      progress: '处理投诉',
      header: '3-2处理投诉',
      body: '运营服务经理处理投诉，并输入处理意见',
    },
    {
      progress: '处理完毕',
      header: '3-3处理完毕',
      body: '处理完毕关闭流程',
    }
  ],
  completed_acceptance_check: [
    {
      progress: '已受理',
      header: '9-1验收申请',
      body: '企业客户发起验收申请',
    },
    {
      progress: '申请审批',
      header: '9-2申请审批',
      body: '由运营服务经理进行申请审批，审批通过时线下沟通会商时间',
    },
    {
      progress: '工程经理初检',
      header: '9-3工程经理初检',
      body: '由工程经理给出验收意见',
    },
    {
      progress: '安保经理初检',
      header: '9-4安保经理初检',
      body: '由安保经理给出验收意见',
    },
    {
      progress: '初检确认',
      header: '9-5初检确认',
      body: '由项目总经理进行初检审批确认',
    },
    {
      progress: '工程经理复检',
      header: '9-6工程经理复检',
      body: '由工程经理给出验收意见',
    },
    {
      progress: '安保经理复检',
      header: '9-7安保经理复检',
      body: '由安保经理给出验收意见',
    },
    {
      progress: '复检确认',
      header: '9-8复检确认',
      body: '由项目总经理进行复检审批确认',
    },
    {
      progress: '处理完毕',
      header: '9-9验收成功',
      body: '推送消息通知企业客户',
    }
  ],
  hide_acceptance_check : [
    {
      progress: '已受理',
      header: '5-1验收申请',
      body: '企业客户发起验收申请',
    },
    {
      progress: '申请审批',
      header: '5-2申请审批',
      body: '由运营服务经理进行申请审批，审批通过时线下沟通会商时间',
    },
    {
      progress: '工程经理初检',
      header: '5-3工程经理初检',
      body: '由工程经理录入验收意见以及结论',
    },
    {
      progress: '工程经理复检',
      header: '5-4工程经理复检',
      body: '由工程经理录入验收结论',
    },
    {
      progress: '处理完毕',
      header: '5-5验收成功',
      body: '验收成功通知',
    }
  ],
  office_handover: [
    {
      progress: '已受理',
      header: '5-1交接申请',
      body: '由运营服务经理创建申请，并开始会商',
    },
    {
      progress: '工程经理录入',
      header: '5-2工程经理录入',
      body: '工程经理进行信息录入',
    },
    {
      progress: '安保经理录入',
      header: '5-3安保经理录入',
      body: '安保经理进行信息录入',
    },
    {
      progress: '运营经理审批',
      header: '5-4运营经理审批',
      body: '运营经理对录入信息进行审批',
    },
    {
      progress: '处理完毕',
      header: '5-5处理完毕',
      body: '运营服务经理关闭流程',
    },
  ],
  batchly_visitor: [
    {
      progress: '已受理',
      header: '3-1访问申请',
      body: '运营服务经理受理申请',
    },
    {
      progress: '信息审批',
      header: '3-2信息审批',
      body: '运营服务经理确认是否允许访问',
    },
    {
      progress: '处理完毕',
      header: '3-3处理完毕',
      body: '处理完毕关闭流程',
    },
  ],
  settle_out: [
    {
      progress: '已受理',
      header: '3-1退租申请',
      body: '运营服务经理提交退租申请',
    },
    {
      progress: '审批意见',
      header: '3-2审批意见',
      body: '由项目总经理，填写审批意见进行审批',
    },
    {
      progress: '处理完毕',
      header: '3-3处理完毕',
      body: '审批意见通过后通知，企业客户，运营服务经理，工程经理及安保经理',
    }
  ],
  deposit_refund: [
    {
      progress: '已受理',
      header: '11-1押金退还申请',
      body: '费用结算审批-提交信息，发起申请',
    },
    {
      progress: '运营经理审批',
      header: '11-2运营经理审批',
      body: '费用结算审批-运营经理确认相关信息并审批',
    },
    {
      progress: '工程经理审批',
      header: '11-3工程经理审批',
      body: '费用结算审批-工程经理确认相关信息并审批',
    },
    {
      progress: '安保经理审批',
      header: '11-4安保经理审批',
      body: '费用结算审批-安保经理确认相关信息并审批',
    },
    {
      progress: '结算确认中',
      header: '11-5结算确认中',
      body: '费用结算明细-费用确认人员填入费用相关信息',
    },
    {
      progress: '工程经理确认',
      header: '11-6工程经理确认',
      body: '费用结算明细-工程经理确认结算信息',
    },
    {
      progress: '安保经理确认',
      header: '11-7安保经理确认',
      body: '费用结算明细-安保经理确认结算信息',
    },
    {
      progress: '运营经理确认',
      header: '11-8运营经理确认',
      body: '费用结算明细-运营经理确认结算信息',
    },
    {
      progress: '财务总监确认',
      header: '11-9财务总监确认',
      body: '费用结算明细-财务总监确认结算信息',
    },
    {
      progress: '项目经理确认',
      header: '11-10项目经理确认',
      body: '费用结算明细-项目经理确认结算信息',
    },
    {
      progress: '处理完毕',
      header: '11-11处理完毕',
      body: '确认完毕，退还押金',
    }
  ],
  parking_apply: [
    {
      progress: '已受理',
      header: '3-1月卡申请',
      body: '运营服务经理受理申请',
    },
    {
      progress: '信息审批',
      header: '3-2信息审批',
      body: '运营服务经理确认是否通过申请',
    },
    {
      progress: '处理完毕',
      header: '3-3处理完毕',
      body: '处理完毕关闭流程',
    }
  ],
  reserve_visit: [
    {
      progress: '已受理',
      header: '2-1提交申请',
      body: '输入预约信息，发起申请',
    },
    {
      progress: '处理完毕',
      header: '2-2处理完毕',
      body: '运营经理受理申请，准备线下接待',
    }
  ],
  settle_in: [
    {
      progress: '已受理',
      header: '7-1入驻申请',
      body: '提交信息，发起申请',
    },
    {
      progress: '运营部审批',
      header: '7-2运营部审批',
      body: '运营服务经理审核并填入确认信息',
    },
    {
      progress: '工程部审批',
      header: '7-3工程部审批',
      body: '由工程经理进行审核并填入确认信息',
    },
    {
      progress: '安保部审批',
      header: '7-4安保部审批',
      body: '由安保经理进行审核并填入确认信息',
    },
    {
      progress: '项目总经理审批',
      header: '7-5项目总经理审批',
      body: '由项目总经理，填写审批意见进行审批',
    },
    {
      progress: '运营服务经理增值意见',
      header: '7-6运营服务经理增值意见',
      body: '由运营服务经理填入增值意见',
    },
    {
      progress: '处理完毕',
      header: '7-7处理完毕',
      body: '审批意见通过后通知，企业客户，运营服务经理，工程经理及安保经理,同时提示企业用户进行物品进场流程',
    }
  ],
  goods_letin: [
    {
      progress: '已受理',
      header: '5-1出入申请',
      body: '企业用户发起物品出入的申请',
    },
    {
      progress: '运营部审批',
      header: '5-2运营部审批',
      body: '运营服务部进行核对',
    },
    {
      progress: '工程经理审批',
      header: '5-3工程经理审批',
      body: '工程经理进行确认',
    },
    {
      progress: '安保经理审批',
      header: '5-4安保经理审批',
      body: '安保经理进行确认',
    },
    {
      progress: '处理完毕',
      header: '5-5处理完毕',
      body: '处理完成',
    }
  ],
  goods_letout: [
    {
      progress: '已受理',
      header: '5-1出入申请',
      body: '企业用户发起物品出入的申请',
    },
    {
      progress: '运营部审批',
      header: '5-2运营部审批',
      body: '运营服务部进行核对',
    },
    {
      progress: '费用确认员审批',
      header: '5-3费用确认员审批',
      body: '费用确认员进行费用确认',
    },
    {
      progress: '安保经理审批',
      header: '5-4安保经理审批',
      body: '安保经理进行确认',
    },
    {
      progress: '处理完毕',
      header: '5-5处理完毕',
      body: '处理完成',
    }
  ],
  decoration_application: [
    {
      progress: '已受理',
      header: '11-1审批申请',
      body: '企业客户提交信息，发起装修申请',
    },
    {
      progress: '审批受理',
      header: '11-2审批受理',
      body: '施工方案审核-运营经理申请并补充信息（企业客户线下提供图纸）',
    },
    {
      progress: '工程经理审图',
      header: '11-3工程经理审图',
      body: '施工方案审核-由工程经理审图，并给出审图意见',
    },
    {
      progress: '安保经理审图',
      header: '11-4安保经理审图',
      body: '施工方案审核-由安保经理审图，并给出审图意见',
    },
    {
      progress: '运营经理审图',
      header: '11-5运营经理审图',
      body: '施工方案审核-由运营经理审图，并给出审图意见',
    },
    {
      progress: '运营经理审批',
      header: '11-6运营经理审批',
      body: '施工许可证审批-由运营经理审批，并给出审批意见',
    },
    {
      progress: '工程经理审批',
      header: '11-7工程经理审批',
      body: '施工许可证审批-由工程经理审批，并给出审批意见',
    },
    {
      progress: '安保经理审批',
      header: '11-8安保经理审批',
      body: '施工许可证审批-由安保经理审批，并给出审批意见',
    },
    {
      progress: '项目总经理审批',
      header: '11-9项目总经理审批',
      body: '施工许可证审批-由项目总经理审批，并给出审批意见',
    },
    {
      progress: '施工许可',
      header: '11-10施工许可',
      body: '由运营服务经理填写确认开工许可证信息',
    },
    {
      progress: '处理完毕',
      header: '11-11处理完毕',
      body: '由运营服务经理开出开工许可证',
    }
  ]
};
