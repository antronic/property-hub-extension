// CONST
const FAV_BUTTON_CLASSES = 'prophub-ext-favbtn'

function removeAllFavoriteButton() {
  document.querySelectorAll(`.${FAV_BUTTON_CLASSES}`)
    .forEach((el) => el.parentNode.removeChild(el))
}

function main() {
  const postElement = document.querySelectorAll('.sc-152o12i-0.iWSTG.i5hg7z-1.dnNQUL')

  // Configure
  const storageName = 'PROPHUB_EXT_FAVPOSTS'

  // ================================
  // Setup new localStorage key
  function initialStorage() {
    localStorage.setItem(storageName, JSON.stringify([]))
  }

  // ================================
  // Add new item into localStorage
  function addItem(newItem) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))
    tempStorage.push(newItem)

    localStorage.setItem(storageName, JSON.stringify(tempStorage))
  }

  function removeItem(itemIndex) {
    const tempStorage = JSON.parse(localStorage.getItem(storageName))
    tempStorage.splice(itemIndex, 1)

    localStorage.setItem(storageName, JSON.stringify(tempStorage))
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
        content: postContent,
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
  // Create list view
  function createListView() {
    const listViewContainer = document.createElement('div')
  }

  // Start
  initialStorage()

  addFavoriteButton()
}