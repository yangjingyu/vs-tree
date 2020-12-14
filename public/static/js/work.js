let list = []
let umap = {}
let infomap = {}
const depts = []
const root = []
var xhr = new XMLHttpRequest()
xhr.open('GET', typeof window === 'object' ? './static/data.txt' : '../data.txt', true)
xhr.send()
xhr.onload = function (e) {
  list = xhr.response.split('\r\n').map(v => v && JSON.parse(v))
  list.forEach(v => {
    if (v.obj === 'department_user') {
      if (umap[v.data.did]) {
        umap[v.data.did].push(v.data)
      } else {
        umap[v.data.did] = [v.data]
      }
    } else if (v.obj === 'user') {
      infomap[v.data.uid] = v.data
    } else if (v.obj === 'department'){
      if (v.data.pdid === '-1') {
        root.push(v)
      } else {
        depts.push(v)
      }
    }
  })
  console.log(infomap['100002955460']);
  postMessage && postMessage({
    id: 1,
    list: list,
    depts: depts,
    root: root,
    umap: umap,
    infomap: infomap
  });
  typeof window !== 'object' && close()
}