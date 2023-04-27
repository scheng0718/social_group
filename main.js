const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const friends = []

// Render friends information
function renderPeopleList(data) {
  let rawHTML = ''
  data.forEach(item => {
    const id = item.id
    rawHTML += `
      <div class="col-sm-3">
          <div class="mb-2">
            <div class="card text-white bg-dark text-center">
              <img src="${item.avatar}" class="card-img-top" alt="avatar">
              <div class="card-body text-center">
                <h5 class="card-title">${item.name}<br>${item.surname}</h5>
                <p class="card-subtitle"><i class="fa-solid fa-flag fa-sm mx-2" style="color: #008000;"></i>${item.region}</p>
                <p class="card-text"><i class="fa-solid fa-person-half-dress fa-lg mx-2" style="color: #f2c94c;"></i>${item.gender}</p>
                <button type="button" class="btn btn-warning btn-lg" data-bs-toggle="modal" data-bs-target="#friends-modal-message" data-id="${id}">
                  Learn More
                </button>               
              </div>
            </div>
          </div>
        </div>
    `
    if (id !== 200) {
      dataPanel.innerHTML = rawHTML
    }
  })
}
function renderModalInfo(event) {
  console.log(event.target)
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

dataPanel.addEventListener('click', renderModalInfo)
// Get API data
axios.get(INDEX_URL)
  .then(response => {
    const data = response.data.results
    friends.push(...data)
    renderPeopleList(friends)
  })