class Tree extends HTMLElement {

  constructor() {
    debugger
  }

  set model(data) {
    debugger
    console.log(this)
    this.textContent = JSON.stringify(data)
    return
    $(this).jstree({
      core: { data }
    })
  }

}

module.exports = Tree

require('jstree')
const $ = require(`jquery`)

// require('document-register-element') 
window.document.registerElement('ldap-tree', Tree)
