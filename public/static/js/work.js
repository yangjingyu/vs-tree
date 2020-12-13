var list = []
const umap = {}
const infomap = {}
var xhr = new XMLHttpRequest()
xhr.open('GET', '../data.txt', true)
xhr.send()
xhr.onload = function (e) {
  list = xhr.response.split('\r\n').map(v => v && JSON.parse(v))
  var data = list.filter(v => v && v.obj === 'department' && v.data.pdid === '-1')
  list.forEach(v => {
    if (v.obj === 'department_user') {
      if (umap[v.data.did]) {
        umap[v.data.did].push(v.data)
      } else {
        umap[v.data.did] = [v.data]
      }
    } else if (v.obj === 'user') {
      infomap[v.data.uid] = v.data
    }
  })
  postMessage({
    id: 1,
    list: list,
    root: data,
    umap: umap,
    infomap: infomap
  });
  close()
}