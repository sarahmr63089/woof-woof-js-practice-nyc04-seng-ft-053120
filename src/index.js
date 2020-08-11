let dogBar = document.querySelector("#dog-bar")
let dogDiv = document.querySelector("#dog-info")
let filterButton = document.querySelector("#good-dog-filter")
let filter = false
let dogArr = []

fetch("http://localhost:3000/pups")
.then(res => res.json())
.then(dogObjArr => {
  dogArr = dogObjArr
  renderDogName()
})


// put dogs names in span and render dogs below

let renderDogName = () => {
  dogBar.innerHTML = ""
  if (filter === true) {
    dogArr.forEach((dog) => {
      if (dog.isGoodDog) {
        dogNameInSpan(dog)
      }
    })
  }
  else {
    dogArr.forEach((dog) => {
      dogNameInSpan(dog)
    })
  }
}


// span HTML and event listener

let dogNameInSpan = (dogObj) => {
  let dogSpan = document.createElement("span")
  dogSpan.innerText = dogObj.name

  dogBar.append(dogSpan)

  dogSpan.addEventListener("click", (evt) => {
    renderDogDiv(dogObj)
  })
}



// dog area HTML and event listener for good/bad dog button

let renderDogDiv = (dogObj) => {
  dogDiv.innerHTML = ""
  let dogImg = document.createElement("img")
  dogImg.src = dogObj.image

  let dogH2 = document.createElement("h2")
  dogH2.innerText = dogObj.name

  let goodDogButton = document.createElement("button")
  if (dogObj.isGoodDog) {
    goodDogButton.innerText = "Good Dog!"
  }
  else {
    goodDogButton.innerText = "Bad Dog!"
  }

  dogDiv.append(dogImg, dogH2, goodDogButton)

  goodDogButton.addEventListener("click", (evt) => {
    // 1. change dog in memory
    dogObj.isGoodDog = !dogObj.isGoodDog
    // 2. change dog in database
    fetch(`http://localhost:3000/pups/${dogObj.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: dogObj.isGoodDog
      })
    })
    .then(res => res.json())
    .then((newDogObj) => {
      // 3. change dog on page, newDogObj is not in dogArr
      renderDogDiv(dogObj) // changes dog area
      // re-render bar
      renderDogName()
    })
  })
}



// filter button event listener

filterButton.addEventListener("click", (evt) => {
  dogBar.innerHTML = ""
  if (filterButton.innerText === "Filter good dogs: OFF") {
    filterButton.innerText = "Filter good dogs: ON"
    filter = true
    renderDogName()
  }
  else {
    filterButton.innerText = "Filter good dogs: OFF"
    filter = false
    renderDogName()
  }
})

