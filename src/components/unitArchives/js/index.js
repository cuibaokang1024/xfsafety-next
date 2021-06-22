export function createFormOption(type) {
  let options = {}
  switch (type) {
    case 'buildPlan':
      options = {
        config: [
          {
            type: 'text',
            label: '部门名称:',
            name: 'name',
            placeholder: '请输入部门名称'
          },
          {
            type: 'text',
            label: '登录名:',
            name: 'loginName',
            placeholder: '请输入登录名'
          }
        ]
      }
    case ''
  }
  return options
}
