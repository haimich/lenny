const promisify = require(`./src/helpers/promisify`)

const ldap = require(`ldapjs`)
const client = ldap.createClient({
  url: `ldap://ldap.forumsys.com:389`
})

const [bind, search] = promisify(client, `bind`, `search`)

bind(`cn=read-only-admin,dc=example,dc=com`, `password`)
  .then(() => {
    const opts = {
      // filter: `(&(l=Seattle)(email=*@foo.com))`,
      scope: `sub`,
      attributes: [`dn`, `sn`, `cn`]
    }

    return search(`dc=example,dc=com`, opts)
  })
  .then(buildTreeModel)
  .then(model => {
    const Tree = require('./src/tree.component.js')
    const tree = new Tree()
    tree.model = model
    $('#tree').append(tree)
  })
  .catch(console.error)

function buildTreeModel(emitter) {
  const root = []
  return new Promise((resolve, reject) => emitter
    .on(`searchEntry`, onEntry)
    .on(`error`, reject)
    .on(`end`, () => resolve(root[0])))

  function onEntry(entry) {
    entry.dn.split(`,`).reverse().reduce((parent, text, i, parts) => {
      if (i == parts.length - 1) {
        const node = { id: entry.dn, text }

        if (/^(dc|ou)/.test(node.id))
          node.children = []
        else
          node.icon = `jstree-file`

        parent.push(node)
      } else {
        const newParent = parent.find(node => node.text == text)
        return newParent ? newParent.children : parent
      }
    }, root)
  }
}