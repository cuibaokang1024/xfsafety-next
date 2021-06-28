export function openInfo(map, AMap, data) {
  const info = []
  info.push(`<div class='input-card content-window-card'><div>${data.name}</div>`)
  info.push(`<div style="padding:7px 0px 0px 0px;"><h4>${data.address}</h4>`)
  info.push(`<div style="padding:7px 0px 0px 0px;"><h4>查看详情</h4>`)
  const infoWindow = new AMap.InfoWindow({
    content: info.join('') // 使用默认信息窗体框样式，显示信息内容
  })
  infoWindow.open(map, data.lnglat)
}
export function getCenterPoint(path) {
  var x = 0.0
  var y = 0.0
  path.forEach((lnglat) => {
    x = x + parseFloat(lnglat.lng)
    y = y + parseFloat(lnglat.lat)
  })
  x = x / path.length
  y = y / path.length
  return [x, y]
}
