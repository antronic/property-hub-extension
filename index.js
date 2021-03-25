// CONST
const EXT_PREFIX = 'prophub-ext'
const EXT_VERSION = '0.0.1-beta'

const FAV_BUTTON_CLASSES = `${EXT_PREFIX}-favbtn`


removeAllFavoriteButton()
removeListView()
function removeAllFavoriteButton() {
  document.querySelectorAll(`.${FAV_BUTTON_CLASSES}`)
    .forEach((el) => el.parentNode.removeChild(el))
}

function removeListView() {
  document.body.removeChild(
    document.querySelector(`#${EXT_PREFIX}-list-view`)
  )
}

function main() {
  const postElement = document.querySelectorAll('.sc-152o12i-0.iWSTG.i5hg7z-1.dnNQUL')

  // Configure
  const storageName = `${EXT_PREFIX.toUpperCase()}_FAVPOSTS`

  // ================================
  // Setup new localStorage key
  function initialStorage() {
    localStorage.setItem(storageName, JSON.stringify([]))
  }

  // ###################################
  // #### Item handling
  // ================================
  // Add new item into localStorage
  function addItem(newItem) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))
    tempStorage.push(newItem)

    localStorage.setItem(storageName, JSON.stringify(tempStorage))
    renderList()
  }

  function removeItem(itemIndex) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))
    tempStorage.splice(itemIndex, 1)

    localStorage.setItem(storageName, JSON.stringify(tempStorage))
    renderList()
  }

  function searchItemIndex(itemId) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))

    const index = tempStorage.findIndex(item => item.id === itemId)

    return index
  }

  function searchItem(itemId) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))

    const item = tempStorage.find(item => item.id === itemId)

    return item
  }

  function getAllItems() {
    return JSON.parse(localStorage.getItem(storageName))
  }
  // ###################################
  // #### Favorite button

  // ================================
  // Event handler: on favorite button click
  function onFavoriteButtonClick(e) {
    const button = e.target
    const post = e.target.parentNode
    const postId = button.getAttribute('post-id')

    e.stopPropagation()
    e.preventDefault()

    let postIndex = searchItemIndex(parseInt(postId, 10))

    if (postIndex >= 0) {
      // Remove item
      removeItem(postIndex)

      // Reset styling
      button.style = ''
    } else {
      // Add item and styling
      button.style = 'background: rgb(200,200, 0)'

      const postContent = getPostContent(post)

      addItem({
        id: parseInt(postId, 10),
        ...postContent,
      })
    }

    return false
  }

  // ================================
  // Create Favorite button element
  //
  // return button element
  function createFavoriteButton(postId = null) {
    const favoriteButton = document.createElement('button')
    favoriteButton.innerText = 'FAV'

    favoriteButton.className = FAV_BUTTON_CLASSES
    favoriteButton.setAttribute('post-id', postId)

    favoriteButton.addEventListener('click', onFavoriteButtonClick)

    return favoriteButton
  }

  // =================================
  // Register favorite button into the post
  function addFavoriteButton() {

    postElement.forEach((el, index) => {
      const favoriteButton = createFavoriteButton(index)

      el.appendChild(favoriteButton)
    })
  }

  // ===================================
  // Get post content
  function getPostContent(post) {
    const heading = post.querySelector('.sc-152o12i-1')
    const postName = heading.innerText
    const postUrl = heading.href

    const [priceEl, roomTypeEl, sizeEl, floorEl] = post.querySelectorAll('.sc-152o12i-12 > div')

    const price = priceEl.querySelectorAll('span')[1].textContent
    const roomType = roomTypeEl.innerText.split('\n')[1]
    const size = sizeEl.innerText.split('\n')[1]
    const floor = parseInt(floorEl.innerText.split('\n')[1], 10)

    return { postName, postUrl, price, roomType, size, floor }
  }

  // ###################################
  // #### LIST VIEW
  // ===================================

  let listViewContainer = null

  function renderList() {
    const listContainer = document.querySelector(`#${EXT_PREFIX}-list-container`)
    listContainer.innerHTML = ''

    function appendListItem(item) {
      const listItem = document.createElement('li')
      const link = document.createElement('a')
      link.href = item.postUrl
      link.innerText = item.postName

      listItem.appendChild(link)
      listContainer.appendChild(listItem)
    }

    getAllItems().forEach(appendListItem)
  }

  // Create list view
  function createListView() {
    // Create DIV container
    listViewContainer = document.createElement('div')
    listViewContainer.id = `${EXT_PREFIX}-list-view`
    listViewContainer.style = `
      padding: 8px;
      background: rgb(255 255 255);
      box-shadow: 0px 2px 6px 1px rgb(0 0 0 / 25%);
      top: 0px;
      left: 0px;
      position: fixed;
      min-height: 200px;
      z-index: 1024;
    `

    // Add heading text node
    const heading = document.createElement('p')
    heading.style = 'font-size: 1em; font-weight: bold;'
    heading.innerText = 'Favorite list'

    listViewContainer.appendChild(heading)

    // Add list container
    const boxContainer = document.createElement('DIV')
    const listContainer = document.createElement('ul')
    listContainer.id = `${EXT_PREFIX}-list-container`

    boxContainer.appendChild(listContainer)
    listViewContainer.appendChild(boxContainer)

    document.body.appendChild(listViewContainer)
  }

  // Start
  initialStorage()

  addFavoriteButton()

  createListView()
  renderList()
}