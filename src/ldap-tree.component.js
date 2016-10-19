require(`jstree`)
const $ = require(`jquery`)

class Tree extends HTMLElement {

  constructor(data) {
    super()

    $(this).jstree({
      core: { data }
    })
  }

}

customElements.define(`ldap-tree`, Tree)
module.exports = Tree
