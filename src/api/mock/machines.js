let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    disabled: i % 6 === 0,
    href: 'jvl.com',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    no: `TradeCode ${i}`,
    title: `Machine serial ${i}`,
    owner: 'owner',
    description: 'some info',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}

let dataSource = [...tableListDataSource];
let pageSize = 10;

const result = {
  list: dataSource,
  pagination: {
    total: dataSource.length,
    pageSize,
    current: parseInt(1, 10) || 1,
  },
};


module.exports = result;
