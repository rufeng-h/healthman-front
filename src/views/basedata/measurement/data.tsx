export const cardList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 12; i++) {
    result.push({
      createdAdminName: '龙傲天',
      title: '这是标题',
      icon: 'logos:vue',
      color: '#1890ff',
      active: '100',
      new: '1,799',
      classes:['计算机2018-01班','计算机2018-02班'],
      percente: Math.ceil(Math.random() * 100),
      download: 'bx:bx-download',
      createdTime: '2000-11-23',
      msDesp: '这是备注信息sfddddddasdfa信息是放假撒放假撒发生纠纷的萨拉飞机爱上了'
    });
  }
  return result;
})();
