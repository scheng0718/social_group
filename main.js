const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const COUNTRY_CODE = 'https://restcountries.com/v3.1/all'
const FRIENDS_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const totalPage = document.querySelector('#total-page')
const friends = []
let filteredList = []
let countries = []
// render pagination 
function renderPagination(friends) {
  const pages = Math.ceil(friends.length / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= pages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }  
  totalPage.innerHTML = rawHTML
}
// determine which data will be used, and filter data by page 
function getFriendByPage(page) {
  if (!page || page === 0) {
    return
  }
  const data = filteredList.length ? filteredList : friends
  const friendsByPage = data.slice((page - 1) * FRIENDS_PER_PAGE, page * FRIENDS_PER_PAGE)
  return friendsByPage
}
// Check the data from localStorage 
function isExistInFriendList(id) {
  const friendList = JSON.parse(localStorage.getItem('closeFriends')) || []
  const friend = friendList.find(friend => friend.id === id)
  return friend === undefined ? false : true
}
// Render friends information
function renderPeopleList(data) {
  let rawHTML = ''
  data.forEach(item => {
    const id = Number(item.id)
    const countryName = item.region
    let countryCode
    countries.find(country => {  
      if (country.countryName === countryName) {
        countryCode = country.countryCode.toLowerCase()
      }  
    })
    if (isExistInFriendList(id)) {
      rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
              <div class="card text-white bg-dark text-center">
                <i class="fa-solid fa-heart fa-2xl" id="heart${id}" data-id="${id}" style="color: #dc143c;"></i>
                <img src="${item.avatar}" class="card-img-top" alt="avatar">
                <div class="card-body text-center">
                  <h5 class="card-title">${item.name}<br>${item.surname}</h5>
                  <h6 class="card-subtitle"><img class="flag-img" src="https://flagcdn.com/24x18/${countryCode}.png">${item.region}</h6>
                  <button type="button" class="btn btn-warning btn-show-more mx-2" data-bs-toggle="modal" data-bs-target="#friends-modal-message" data-id="${id}">
                    About Me
                  </button> 
                  <button type="button" class="btn btn-light btn-add-friend mx-2" data-id="${id}">Follow</button>            
                </div>
              </div>
            </div>
          </div>
      `
    } else {
      rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
              <div class="card text-white bg-dark text-center">
                <i class="fa-regular fa-heart fa-2xl" id="heart${id}" data-id="${id}" style="color: #dc143c;"></i>
                <img src="${item.avatar}" class="card-img-top" alt="avatar">
                <div class="card-body text-center">
                  <h5 class="card-title">${item.name}<br>${item.surname}</h5>
                  <h6 class="card-subtitle m-3"><img class="flag-img" src="https://flagcdn.com/24x18/${countryCode}.png">${item.region}</h6>
                  <button type="button" class="btn btn-warning btn-show-more mx-2" data-bs-toggle="modal" data-bs-target="#friends-modal-message" data-id="${id}">
                    About Me
                  </button> 
                  <button type="button" class="btn btn-light btn-add-friend mx-2" data-id="${id}">Follow</button>            
                </div>
              </div>
            </div>
          </div>
      `
    }
    dataPanel.innerHTML = rawHTML   
  })
}
// render about me info
function renderModalInfo(event) {
  const id = event.target.dataset.id
  const showURL = INDEX_URL + id
  const modalImg = document.querySelector('#friends-modal-image')
  const modalIntro = document.querySelector('#friends-modal-intro') 
  axios.get(showURL)
    .then(response => {
      const img = response.data.avatar
      const name = `${response.data.name} ${response.data.surname}`
      const age = response.data.age
      const birthday = response.data.birthday
      const region = response.data.region
      const email = response.data.email
      const gender = response.data.gender
      modalImg.innerHTML = `
        <img src="${img}" alt="" class="modal-img">
      `
      modalIntro.innerHTML = `
        <p>Hello, my name is <em><b>${name}</b></em>. My account id is ${id}. Please add me to your favorite friend list. Currently I am <b>${age}</b> years old, <b>${gender}</b> and my birthday is on <b>${birthday}</b>. I am originally from
        <b>${region}</b>. If you want to connect and join our group. Please contact me through <b>${email}</b>. Look forward to talking to you soon.</p>
      `
    })
}
//Add to localStorage
function addToFriend(id) {
  const friendList = JSON.parse(localStorage.getItem('closeFriends') || [])
  const closeFriend = friends.find(friend => friend.id === id)
  if (friendList.some(friend => friend.id === id)) {
    return alert('This friend has been added already')
  }
  friendList.push(closeFriend)
  localStorage.setItem('closeFriends', JSON.stringify(friendList))
}
// Remove from localStorage
function removeFromList(id) {
  const friendList = JSON.parse(localStorage.getItem('closeFriends'))
  const index = friendList.findIndex(friend => friend.id === id)
  friendList.splice(index, 1)
  localStorage.setItem('closeFriends', JSON.stringify(friendList))
}
// search features
searchForm.addEventListener('submit', function searchFromSubmitted(event) {
  event.preventDefault();
  const input = searchInput.value.trim().toLowerCase()
  filteredList = friends.filter(friend => friend.name.toLowerCase().includes(input) || friend.surname.toLowerCase().includes(input))
  if (filteredList.length === 0) {
    alert(`The friend ${input} is not existing`)
    renderPeopleList(friends)
  }
  renderPagination(filteredList)
  renderPeopleList(getFriendByPage(1))  
})
// data-panel click event
dataPanel.addEventListener('click', function onPanelCLicked(event) {
  if (event.target.matches('.btn-show-more')) {
    renderModalInfo(event) 
  } else if (event.target.matches('.fa-regular')) {
    event.target.classList.replace('fa-regular', 'fa-solid')
    addToFriend(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-solid')) {
    event.target.classList.replace('fa-solid', 'fa-regular')
    removeFromList(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-friend')) {
    const id = Number(event.target.dataset.id)
    const icon = document.getElementById("heart" + id)
    icon.classList.replace('fa-regular', 'fa-solid')
    addToFriend(id)
  }
})
//Pagination click event
totalPage.addEventListener('click', function (event) {
  if (event.target.tagName !== 'A') {
    return
  }
  const page = Number(event.target.innerText)
  renderPeopleList(getFriendByPage(page))
})

// Get images and info through API
axios.get(INDEX_URL)
  .then(response => {
    const data = response.data.results
    friends.push(...data)
    renderPagination(friends)
    renderPeopleList(getFriendByPage(1))
})
// Country Code API
axios.get(COUNTRY_CODE)
  .then (response => {
    response.data.forEach(item => {
      const countryObject = {countryName: item.name.common, countryCode: item.cca2}
      countries.push(countryObject)
    }) 
    console.log(countries)
  })