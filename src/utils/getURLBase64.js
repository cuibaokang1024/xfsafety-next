export function getURLBase64(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = this.response
        const fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          const { target } = e
          const result = target ? target.result : ''
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      } else {
        reject('图片加载失败')
      }
    }
    xhr.onerror = function() { reject('图片加载失败') }
    xhr.send()
  })
}
