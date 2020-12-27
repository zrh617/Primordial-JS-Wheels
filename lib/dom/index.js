let dom = {
  //事件委托
  on: function(element, eventType, selector, fn) {
    element.addEventListener(eventType, e => {
      let el = e.target
      while (!el.matches(selector)) {
        if (element === el) {
          el = null
          break
        }
        el = el.parentNode
      }
      el && fn.call(el, e, el)
    })
    return element
  },

  //一个可拖曳的区域
  onSwipe: function(element, fn) {
    let x0, y0
    element.addEventListener('touchstart', function(e) {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    })
    element.addEventListener('touchmove', function(e) {
      if (!x0 || !y0) {
        return
      }
      let xDiff = e.touches[0].clientX - x0
      let yDiff = e.touches[0].clientY - y0

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          fn.call(element, e, 'right')
        } else {
          fn.call(element, e, 'left')
        }
      } else {
        if (yDiff > 0) {
          fn.call(element, e, 'down')
        } else {
          fn.call(element, e, 'up')
        }
      }
      x0 = undefined
      y0 = undefined
    })
  },

  //获取当前元素是第几个节点
  index: function(element) {
    let siblings = element.parentNode.children
    for (let index = 0; index < siblings.length; index++) {
      if (siblings[index] === element) {
        return index
      }
    }
    return -1
  },

  //去除重复类名
  uniqueClass: function(element, className) {
    dom.every(element.parentNode.children, el => {
      el.classList.remove(className)
    })
    element.classList.add(className)
    return element
  },

  every: function(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i], i)
    }
    return nodeList
  },

  //自定义创建节点
  create: function(html, children) {
    let template = document.createElement('template')
    template.innerHTML = html.innerHTML.trim()
    let node = template.content.firstChild
    if (children) {
      dom.append(node, children)
    }
    return node
  },

  //父节点添加子节点
  append: function(parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = 0; i < children.length; i++) {
      parent.appendChild(children[i])
    }
    return parent
  },

  //将节点作为父节点的子节点
  prepend: function(parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = children.length - 1; i >= 0; i--) {
      if (parent.firstChild) {
        parent.insertBefore(children[i], parent.firstChild)
      } else {
        parent.appendChild(children[i])
      }
    }
    return parent
  },

  //移除节点
  removeChildren: function(element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild)
    }
    return this
  },

  //自定义事件
  dispatchEvent: function(element, eventType, detail) {
    let event = new CustomEvent(eventType, { detail })
    element.dispatchEvent(event)
    return this
  },
}

export default dom