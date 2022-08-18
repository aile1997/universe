export default {
  image: {
    require: (name) => {
      return new URL(`../../assets/img/${name}`, import.meta.url).href
    },
  },
  timeOut: {
    set: (setTime, fun, num, name) => {
      name = setTimeout(() => {
        fun.show()
      }, num)
      setTime.push(name)
    },
  },
  dispose: {
    css3d: (childs) => {
      let child = document.getElementsByClassName(childs)
      child.removeNode = []
      if (child.length != undefined) {
        let len = child.length
        for (let i = 0; i < len; i++) {
          child.removeNode.push({
            parent: child[i].parentNode,
            inner: child[i].outerHTML,
            next: child[i].nextSibling,
          })
        }
        for (let i = 0; i < len; i++) {
          child[0].parentNode.removeChild(child[0])
        }
      } else {
        child.removeNode.push({
          parent: child.parentNode,
          inner: child.outerHTML,
          next: child.nextSibling,
        })
        child.parentNode.removeChild(child)
      }
    },
  },
}
