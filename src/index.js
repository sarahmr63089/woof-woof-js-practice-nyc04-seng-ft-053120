let dogBar = document.querySelector("#dog-bar")
let dogShow = document.querySelector("#dog-info")
let filterDogs = document.querySelector("#good-dog-filter")
let filter = false

let allDogFetch = () => {
  fetch("http://localhost:3000/pups")
  .then(res => res.json())
  .then((pupObjArray) => {
    console.log(pupObjArray)
    pupObjArray.forEach((pupObj) => {
      turnPupIntoHTML(pupObj)
    })
  })
}

allDogFetch()

let turnPupIntoHTML = (pupObj) => {
  // { id: num, name: name, isGoodDog: boolean, image: url }
  console.log("turn pup", pupObj)

  let dogSpan = document.createElement("span")
  dogSpan.innerText = pupObj.name
  dogSpan.className = pupObj.isGoodDog

  dogBar.append(dogSpan)

  let pupImg = document.createElement("img")
  let pupNameH2 = document.createElement("h2")
  let goodPupButton = document.createElement("button")

  dogSpan.addEventListener("click", (evt) => {
    dogShow.innerHTML = ""
    pupImg.src = pupObj.image
    pupNameH2.innerText = pupObj.name
    if (pupObj.isGoodDog) { 
      goodPupButton.innerText = "Good Dog!" 
    }
    else { 
      goodPupButton.innerText = "Bad Dog!" 
    }
    dogShow.append(pupImg, pupNameH2, goodPupButton)
  })

  goodPupButton.addEventListener("click", (evt) => {
    // Update memory, update database, update page
    pupObj.isGoodDog = !pupObj.isGoodDog
    console.log("pup obj", pupObj)

    fetch(`http://localhost:3000/pups/${pupObj.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: pupObj.isGoodDog
      })
    })
    .then(res => res.json())
    .then((updatedPup) => {
      if (updatedPup.isGoodDog) { 
        evt.target.innerText = "Good Dog!" 
      }
      else { 
        evt.target.innerText = "Bad Dog!" 
      }
      if (filter) {
        dogBar.innerHTML = ""

        fetch("http://localhost:3000/pups")
        .then(res => res.json())
        .then((pupObjArray) => {
          let pupArr = pupObjArray.filter((pup) => pup.isGoodDog) 

          pupArr.forEach((pupObj) => { 
            turnPupIntoHTML(pupObj)
          })
        })
      }
    })
  })
}

filterDogs.addEventListener("click", (evt) => {
  filter = !filter
  
  if (filter) {
    evt.target.innerText = "Filter good dogs: ON"

    dogBar.innerHTML = ""
    
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then((pupObjArray) => {
      let pupArr = pupObjArray.filter((pup) => pup.isGoodDog) 

      pupArr.forEach((pupObj) => { 
        turnPupIntoHTML(pupObj)
      })
    })
  }

  if (!filter) {
      
    evt.target.innerText = "Filter good dogs: OFF"

    dogBar.innerHTML = ""
    
    allDogFetch()
  }
})

