
const BASE_URL = `http://localhost:3000`
let ramenDataArr = []
const ramenMenu = document.getElementById('ramen-menu')
const ramenDetails = document.getElementById('ramen-details')
const deleteRamenBtn= document.getElementById('deleteRamen')
deleteRamenBtn.addEventListener('click', () => deleteRamen(selectedRamenId))

let selectedRamenId = 0
const selectedRamenImg = document.getElementsByClassName('detail-image')
const selectedRamenName = document.getElementsByClassName('name')
const selectedRamenRestaurant = document.getElementsByClassName('restaurant')
const selectedRamenRating = document.getElementById('rating-display')
const selectedRamenComment = document.getElementById('comment-display')

const newRamenForm = document.getElementById('new-ramen')
const newRamenName = document.getElementById('new-name')
const newRamenRestaurant = document.getElementById('new-restaurant')
const newRamenImg = document.getElementById('new-image')
const newRamenRating = document.getElementById('new-rating')
const newRamenComment = document.getElementById('new-comment')
newRamenForm.addEventListener('submit', (event) => {
    event.preventDefault()
    newRamen()
})

const updateRamenForm = document.getElementById('update-ramen')
const updateRamenName = document.getElementById('update-name')
const updateRamenRestaurant = document.getElementById('update-restaurant')
const updateRamenImg = document.getElementById('update-image')
const updateRamenRating = document.getElementById('update-rating')
const updateRamenComment = document.getElementById('update-comment')
updateRamenForm.addEventListener('submit', (event) => {
    event.preventDefault()
    updateRamen(selectedRamenId)
})

getRamenData()
setTimeout(() => setSelectedRamen(ramenDataArr[0]), 500)

function getRamenData(){
    fetch(BASE_URL + '/ramens')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        ramenDataArr = data
        for(item of ramenDataArr){
        renderRamen(item)
        // setSelectedRamen(ramenDataArr[0])
    }
})
.catch((error) => {console.error('Fetch Error:', error)})
}

function renderRamen(ramen){
    const ramenImg = document.createElement('img')
    ramenImg.addEventListener('click', () => setSelectedRamen(ramen))
    ramenImg.src = (ramen.image)
    ramenMenu.appendChild(ramenImg)
}

function setSelectedRamen(ramen){
    selectedRamenId = (ramen.id)
    selectedRamenName[0].textContent = (ramen.name)
    selectedRamenRestaurant[0].textContent = (ramen.restaurant)
    selectedRamenImg[0].src = (ramen.image)
    selectedRamenRating.textContent = (ramen.rating)
    selectedRamenComment.textContent = (ramen.comment)

    updateRamenName.value = (ramen.name)
    updateRamenRestaurant.value = (ramen.restaurant)
    updateRamenImg.value = (ramen.image)
    updateRamenRating.value = (ramen.rating)
    updateRamenComment.value = (ramen.comment)
}

function newRamen(){
    const newRamen = {}
    newRamen.name = newRamenName.value
    newRamen.restaurant = newRamenRestaurant.value
    newRamen.image = newRamenImg.value
    newRamen.rating = newRamenRating.value
    newRamen.comment = newRamenComment.value
    renderRamen(newRamen)
    setSelectedRamen(newRamen)
    ramenDataArr.push(newRamen)
    postRamen(newRamen)
}
function postRamen(ramenObj){
    fetch(BASE_URL + '/ramens',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: ramenObj.name,
            restaurant: ramenObj.restaurant,
            image: ramenObj.image,
            rating: ramenObj.rating,
            comment: ramenObj.comment
        })
    })
}

function deleteRamen(ramenId){
    const index = ramenDataArr.findIndex(ramen => ramen.id === ramenId)
    ramenDataArr.splice(index, 1)
    ramenMenu.children[index].remove()
    setSelectedRamen(ramenDataArr[0])
    deleteRamenFromDb(ramenId)
}
function deleteRamenFromDb(ramenId){
    fetch(`${BASE_URL}/ramens/${ramenId}`,{
        method:'DELETE',
        headers:{
            'Content-Type': 'application/json'
        },
    })
}

function updateRamen(ramenId){
    const index = ramenDataArr.findIndex(ramen => ramen.id === ramenId)
    const updatedRamen = {}
    updatedRamen.name = updateRamenName.value
    updatedRamen.restaurant = updateRamenRestaurant.value
    updatedRamen.image = updateRamenImg.value
    updatedRamen.rating = updateRamenRating.value
    updatedRamen.comment = updateRamenComment.value
    ramenDataArr.splice(index, 1, updateRamen)
    fetch(`${BASE_URL}/ramens/${ramenId}`,{
        method:'PATCH',
        headers:{
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            name: updatedRamen.name,
            restaurant: updatedRamen.restaurant,
            image: updatedRamen.image,
            rating: updatedRamen.rating,
            comment: updatedRamen.comment
        })
    })
    clearRamenFromDom()
    setTimeout(() => getRamenData(), 200)
    setTimeout(() => setSelectedRamen(updatedRamen), 1000)
}

function clearRamenFromDom(){
    ramenMenu.innerHTML = ''
}