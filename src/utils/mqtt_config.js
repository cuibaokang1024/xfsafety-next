export const MQTT_CONNECTION = {
  host: '114.116.109.218',
  port: 61623,
  endpoint: '/mqtt',
  clean: true, // 保留会话
  connectTimeout: 4000, // 超时时间
  reconnectPeriod: 4000, // 重连时间间隔
  // 认证信息
  username: 'admin',
  password: 'password'
}
// export const MQTT_CONNECTION = {
//   host: '127.0.0.1',
//   port: 8083,
//   endpoint: '/mqtt',
//   clean: true, // 保留会话
//   connectTimeout: 4000, // 超时时间
//   reconnectPeriod: 4000, // 重连时间间隔
//   // 认证信息
//   username: 'admin',
//   password: 'password'
// }

