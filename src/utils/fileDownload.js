export default function download(data, name) {
  const blob = new Blob([data])
  const href = window.URL.createObjectURL(blob)
  console.log(blob.text())
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = name
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
