const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const COUNTRY_CODE = 'https://restcountries.com/v3.1/all'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const friends = JSON.parse(localStorage.getItem('closeFriends'))
let countries = []

// Render friends information
function renderPeopleList(data) {
  let rawHTML = ''
  if (!data || data.length === 0) {
    return dataPanel.innerHTML = rawHTML
  }
  data.forEach(item => {
    const id = Number(item.id)
    const countryName = item.region
    let countryCode
    countries.find(country => {  
      if (country.countryName === countryName) {
        countryCode = country.countryCode.toLowerCase()
      }  
    })
    rawHTML += `
      <div class="col-sm-3">
          <div class="mb-2">
            <div class="card text-white bg-dark text-center">
              <img src="${item.avatar}" class="card-img-top" alt="avatar">
              <div class="card-body text-center">
                <h5 class="card-title">${item.name}<br>${item.surname}</h5>
                <h6 class="card-subtitle m-3"><img class="flag-img" src="https://flagcdn.com/24x18/${countryCode}.png">${item.region}</h6>
                <button type="button" class="btn btn-warning btn-show-more mx-2" data-bs-toggle="modal" data-bs-target="#friends-modal-message" data-id="${id}">
                  About Me
                </button> 
                <button type="button" class="btn btn-danger btn-remove-friend mx-2" data-id="${id}">Unfollow</button>            
              </div>
            </div>
          </div>
        </div>
    `
    dataPanel.innerHTML = rawHTML    
  })
}
//render about me info
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
// remove friends from localStorage
function removeFriend(id) {
  if (!friends || friends.length === 0) {
    return
  }
  const index = friends.findIndex(friend => friend.id === id)
  if (index === -1) {
    return
  }
  friends.splice(index, 1)
  localStorage.setItem('closeFriends', JSON.stringify(friends))
  renderPeopleList(friends)
}
// data-panel click event
dataPanel.addEventListener('click', function onPanelCLicked(event) {
  if (event.target.matches('.btn-show-more')) {
    renderModalInfo(event) 
  } else if (event.target.matches('.btn-remove-friend')) {
    removeFriend(Number(event.target.dataset.id))
  }
})
// Get Country Code through API 
// axios.get(COUNTRY_CODE)
//   .then (response => {
//     response.data.forEach(item => {
//       const countryObject = {countryName: item.name.common, countryCode: item.cca2}
//       countries.push(countryObject)
//     }) 
//     renderPeopleList(friends)
//   })

axios.get(COUNTRY_CODE)
  .then(response => {
    countries = response.data.map(item => ({
      countryName: item.name.common, 
      countryCode: item.cca2
    }))
    renderPeopleList(friends)
})