console.log("JS LOADED")

setInterval(myFunction, 1000);

function myFunction() {
  let d = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
  document.getElementById("date").innerHTML=
  days[d.getDay()] + ", " +
  d.getDate() + " " +
  months[d.getMonth()] + " " +
  d.getFullYear();
  document.getElementById("time").innerHTML=
  d.getHours() + ":" +
  d.getMinutes() + ":" +
  d.getSeconds();
}

const mainContent = document.querySelector('.main-content');

//CAR TRACKING: READ FROM THE DATABASE, ADD TO THE DATABASE AND DELETE FROM THE DATABASE
//Logic to clear the main-content area if it already has content on the click of track cars button
document.getElementById("cartrack").addEventListener('click', (e) => {
    e.preventDefault();

    if(document.querySelector('.main-content') !== null){
      document.querySelector('.main-content').innerHTML = "";
    }

    getCarTrackingInfo();
})

//Get car info from the server
async function getCarTrackingInfo(){
    const response = await fetch('/cartracking');

    //returns a promise so we need to convert it json
    const data = await response.json();

    const carTrackh2 = document.createElement('h2');
    carTrackh2.innerText = 'Car Tracking Information';
    mainContent.appendChild(carTrackh2);

    const carsTable = document.createElement('table');
    carsTable.style.width = '100%';
    carsTable.classList.add('table', 'table-striped');
    const carTracktbody = document.createElement('tbody');
    carTracktbody.setAttribute('id', 'carinfo');

      const carTrackthead = document.createElement('thead');
      carTrackthead.classList.add('bg-success');
      carTrackthead.style.color = 'white';
      carTrackthead.innerHTML = `<tr>
                      <td>Car Id</td>
                      <td>Car Model</td>
                      <td>Location</td>
                      <td>Carrying capacity</td>
                    </tr>
                  `;
      carsTable.appendChild(carTrackthead);

      carsTable.appendChild(carTracktbody);
    mainContent.appendChild(carsTable);

    buildTable(data);

    function buildTable(myArray){
      let carTracktbody = document.querySelector('#carinfo');

      for(var i = 0; i < myArray.length; i++){
        var row = `<tr>
                      <td>${myArray[i].id}</td>
                      <td>${myArray[i].model}</td>
                      <td>${myArray[i].location}</td>
                      <td>${myArray[i].capacity}</td>
                    </tr>
                  `;
        carTracktbody.innerHTML += row;
      }
      
    }

    const addCarDeleteCarDiv = document.createElement('div');
    addCarDeleteCarDiv.classList.add('addCarDeleteCarDiv');

    const editCarInfoButton = document.createElement('button');
    editCarInfoButton.innerHTML = '<i class="fas fa-edit"></i> Edit'
    editCarInfoButton.classList.add('btn', 'btn-danger')

    editCarInfoButton.addEventListener('click', (e) => {
      console.log('clicked')
      e.preventDefault();
      addCarDeleteCarDiv.classList.toggle('addCarDeleteCarDivShow');
    })

    mainContent.appendChild(editCarInfoButton);

    const addCarDiv = document.createElement('div');
    addCarDiv.classList.add('addCarDiv');

    const deleteCarDiv = document.createElement('div');
    deleteCarDiv.classList.add('deleteCarDiv');

    const addCarh5 = document.createElement('h5');
    addCarh5.innerText = 'Use this form to add a car:';
    addCarDiv.appendChild(addCarh5);

    const addCarform = document.createElement('form');
    addCarform.style.width = "40%";

    const inputFieldLabels = ['Model', 'Location', 'Capacity'];

    for (let i = 0; i < 3; i++) {
      const addCarlabel = document.createElement('label');
      addCarlabel.innerText = inputFieldLabels[i];
      const addCarinput = document.createElement('input');
      addCarinput.setAttribute('name', inputFieldLabels[i]);
      addCarinput.setAttribute('id', inputFieldLabels[i]);
      addCarinput.classList.add('form-control');
      addCarform.appendChild(addCarlabel);
      addCarform.appendChild(addCarinput);
    }

    //Create the submit button
    const AddCarButton = document.createElement('button');
    AddCarButton.setAttribute('type', 'submit');
    AddCarButton.innerHTML = 'Add Car';
    AddCarButton.classList.add('btn', 'btn-success', 'addCarBtn')
    addCarform.appendChild(AddCarButton);

    addCarDiv.appendChild(addCarform);

    

    //Call the addcar function on form submit
    addCarform.addEventListener("submit", (e) => {
      e.preventDefault(); //prevent the form from submitting

      //Convert the user input into an object
      let carData = {
        Model: document.getElementById('Model').value,
        Location: document.getElementById('Location').value,
        Capacity: document.getElementById('Capacity').value
      }
      addCarToDb(carData);
    });

    // create a form to delete a car from the database
    const deleteH5 = document.createElement('h5');
    deleteH5.innerText = 'Delete a car from the database:';
    deleteCarDiv.appendChild(deleteH5);

    const deleteForm = document.createElement('form');
    deleteForm.style.width = "40%";

    const deleteCarlabel = document.createElement('label');
    deleteCarlabel.innerHTML = "Enter the car id";
    deleteForm.appendChild(deleteCarlabel);

    const deleteCarInput = document.createElement('input');
    deleteForm.appendChild(deleteCarInput);
    deleteCarInput.setAttribute('name', 'id');
    deleteCarInput.setAttribute('id', 'id');
    deleteCarInput.setAttribute('type', 'text');
    deleteCarInput.classList.add('form-control');

    const deleteCarBtn = document.createElement('button');
    deleteCarBtn.innerHTML = 'Delete Car';
    deleteCarBtn.classList.add('btn', 'btn-danger', 'deleteCarBtn')
    deleteForm.appendChild(deleteCarBtn);

    deleteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let deleteCarData = {
        id: document.getElementById('id').value,
      }

      deleteCarFromDb(deleteCarData);
    })
    
    deleteForm.appendChild(deleteCarBtn);


    deleteCarDiv.appendChild(deleteForm);

    addCarDeleteCarDiv.appendChild(addCarDiv);
    addCarDeleteCarDiv.appendChild(deleteCarDiv);

    mainContent.appendChild(addCarDeleteCarDiv);
  }

// Function to add a car to the database
function addCarToDb(carData) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(carData)
  }
  fetch('/addCar', options)
}

//Function to delete car data from the database
function deleteCarFromDb(deleteCarData){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(deleteCarData)
  }
  fetch('/removeCar', options)
}



//ACCIDENT TRACKING: READ FROM THE DATABASE, POST TO DATABASE AND DELETE FROM THE DATABASE, POST
document.querySelector('#accidenttrack').addEventListener('click', (e) => {
  e.preventDefault();
  if(document.querySelector('.main-content') !== null){
    document.querySelector('.main-content').innerHTML = "";
  }

  getAccidentTrackingInfo();
})

//Get accidents data from the database
async function getAccidentTrackingInfo() {
  const response = await fetch('/accidentsTracking');

  //returns a promise so we need to convert it json
  const data = await response.json();
  console.log(data);

  const accidentTrackh2 = document.createElement('h2');
  accidentTrackh2.innerText = 'Accident Tracking Information';
    mainContent.appendChild(accidentTrackh2);

  for (let i = 0; i < data.length; i++) {
    const accidentDiv = document.createElement('div');
    accidentDiv.classList.add('card', 'text-white', 'bg-success', 'mb-3');
    const accidentHeaderDiv = document.createElement('div');
    accidentHeaderDiv.classList.add('card-header');
    accidentHeaderDiv.innerHTML = "Accident ID:" + " " + data[i].id;
    const accidentBodyDiv = document.createElement('div');
    accidentBodyDiv.classList.add('card-body');
    const accidentH5 = document.createElement('h5');
    accidentH5.classList.add('card-title');
    accidentH5.innerHTML = "Location:" + " " + data[i].location;
    const accidentH52 = document.createElement('h5');
    accidentH52.classList.add('card-title');
    accidentH52.innerHTML = "Car involved:" + " " + "Car Model: " + data[i].model + ", " + "Car ID: " + data[i].vehicleId;
    const accidentP = document.createElement('p');
    accidentP.classList.add('card-text');
    accidentP.innerHTML = "Accident Description: " +data[i].description;

    accidentDiv.appendChild(accidentHeaderDiv);
    accidentBodyDiv.appendChild(accidentH5);
    accidentBodyDiv.appendChild(accidentH52);
    accidentBodyDiv.appendChild(accidentP);
    accidentDiv.appendChild(accidentBodyDiv);
    mainContent.appendChild(accidentDiv);
  }

  const editAccidentButton = document.createElement('button');
    editAccidentButton.innerHTML = '<i class="fas fa-edit"></i> Edit'
    editAccidentButton.classList.add('btn', 'btn-danger')

    editAccidentButton.addEventListener('click', (e) => {
      console.log('clicked')
      e.preventDefault();
      addAccidentDeleteAccidentDiv.classList.toggle('addAccidentDeleteAccidentDivShow');
    })

    mainContent.appendChild(editAccidentButton);

  const addAccidentDeleteAccidentDiv = document.createElement('div');
  addAccidentDeleteAccidentDiv.classList.add('addAccidentDeleteAccidentDiv');

    const addAccidentDiv = document.createElement('div');
    addAccidentDiv.classList.add('addAccidentDiv');

    const deleteAccidentDiv = document.createElement('div');
    deleteAccidentDiv.classList.add('deleteAccidentDiv');

    const addAccidenth5 = document.createElement('h5');
    addAccidenth5.innerText = 'Use this form to add an accident:';
    addAccidentDiv.appendChild(addAccidenth5);

    const addAccidentForm = document.createElement('form');
    addAccidentForm.style.width = "40%";

    const inputFieldLabels = ['Location', 'Description', 'VehicleId'];
    const AccidentInputTypes = ['input', 'textarea', 'input']

    for (let i = 0; i < 3; i++) {
      const addAccidentlabel = document.createElement('label');
      addAccidentlabel.innerText = inputFieldLabels[i];
      const addAccidentinput = document.createElement(AccidentInputTypes[i]);
      addAccidentinput.setAttribute('name', inputFieldLabels[i]);
      addAccidentinput.setAttribute('id', inputFieldLabels[i]);
      addAccidentinput.classList.add('form-control');
      addAccidentForm.appendChild(addAccidentlabel);
      addAccidentForm.appendChild(addAccidentinput);
    }

    //Create the submit button
    const AddAccidentButton = document.createElement('button');
    AddAccidentButton.setAttribute('type', 'submit');
    AddAccidentButton.innerHTML = 'Add Accident';
    AddAccidentButton.classList.add('btn', 'btn-success', 'addCarBtn')
    addAccidentForm.appendChild(AddAccidentButton);

    addAccidentDiv.appendChild(addAccidentForm);

    

    // Call the addAccident function on form submit
    addAccidentForm.addEventListener("submit", (e) => {
      e.preventDefault(); //prevent the form from submitting

      //Convert the user input into an object
      let accidentData = {
        location: document.getElementById('Location').value,
        description: document.getElementById('Description').value,
        vehicleId: document.getElementById('VehicleId').value
      }
      addAccidentToDb(accidentData);
    });

    // create a form to delete a car from the database
    const deleteH53 = document.createElement('h5');
    deleteH53.innerText = 'Delete an accident from the database:';
    deleteAccidentDiv.appendChild(deleteH53);

    const deleteAccidentForm = document.createElement('form');
    deleteAccidentForm.style.width = "40%";

    const deleteAccidentlabel = document.createElement('label');
    deleteAccidentlabel.innerHTML = "Enter the accident id";
    deleteAccidentForm.appendChild(deleteAccidentlabel);

    const deleteAccidentInput = document.createElement('input');
    deleteAccidentForm.appendChild(deleteAccidentInput);
    deleteAccidentInput.setAttribute('name', 'id');
    deleteAccidentInput.setAttribute('id', 'id');
    deleteAccidentInput.setAttribute('type', 'text');
    deleteAccidentInput.classList.add('form-control');

    const deleteAccidentBtn = document.createElement('button');
    deleteAccidentBtn.innerHTML = 'Delete Accident';
    deleteAccidentBtn.classList.add('btn', 'btn-danger', 'deleteCarBtn')
    deleteAccidentForm.appendChild(deleteAccidentBtn);

    deleteAccidentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let deleteAccidentData = {
        id: document.getElementById('id').value,
      }

      deleteAccidentFromDb(deleteAccidentData);
    })
    
    deleteAccidentForm.appendChild(deleteAccidentBtn);


    deleteAccidentDiv.appendChild(deleteAccidentForm);

    addAccidentDeleteAccidentDiv.appendChild(addAccidentDiv);
    addAccidentDeleteAccidentDiv.appendChild(deleteAccidentDiv);

    mainContent.appendChild(addAccidentDeleteAccidentDiv);
  }

  function addAccidentToDb(accidentData){
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(accidentData)
    }
    fetch('/addAccident', options)
  };

//Function to delete accident data from the database
function deleteAccidentFromDb(deleteAccidentData){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(deleteAccidentData)
  }
  fetch('/removeAccident', options)
}

//VIEW ROOMS: READ FROM THE DATABASE
document.querySelector('#viewRooms').addEventListener('click', (e) => {
  e.preventDefault();
  if(document.querySelector('.main-content') !== null){
    document.querySelector('.main-content').innerHTML = "";
  }

  getRoomsInfo();
})

async function getRoomsInfo(){
  const response = await fetch('/roomsInfo');

  //returns a promise so we need to convert it json
  const data = await response.json();

  const roomsh2 = document.createElement('h2');
  roomsh2.innerText = 'Rooms Information';
    mainContent.appendChild(roomsh2);

  for (let i = 0; i < data.length; i++) {
    const roomsDiv = document.createElement('div');
    roomsDiv.classList.add('card', 'text-white', 'bg-success', 'mb-3');
    const roomsHeaderDiv = document.createElement('div');
    roomsHeaderDiv.classList.add('card-header');
    roomsHeaderDiv.innerHTML = "Room ID:" + " " + data[i].roomId;
    const roomsBodyDiv = document.createElement('div');
    roomsBodyDiv.classList.add('card-body');
    const roomsH5 = document.createElement('h5');
    roomsH5.classList.add('card-title');
    roomsH5.innerHTML = "Room Location:" + " " + data[i].roomLocation;
    const roomsP = document.createElement('p');
    roomsP.classList.add('card-text');
    roomsP.innerHTML = "Room Status: " +data[i].roomStatus;

    roomsDiv.appendChild(roomsHeaderDiv);
    roomsBodyDiv.appendChild(roomsH5);
    roomsBodyDiv.appendChild(roomsP);
    roomsDiv.appendChild(roomsBodyDiv);
    mainContent.appendChild(roomsDiv);
  }


  const updateAddDeleteRoomsDiv = document.createElement('div');
  updateAddDeleteRoomsDiv.classList.add('updateAddDeleteRoomsDiv');

    const updateRoomStatusDiv = document.createElement('div');
    updateRoomStatusDiv.classList.add('updateRoomStatusDiv');

    const addRoomDiv = document.createElement('div');
    addRoomDiv.classList.add('addRoomDiv');
    
    const deleteRoomDiv = document.createElement('div');
    deleteRoomDiv.classList.add('deleteRoomDiv');

    const updateRoomStatusH5 = document.createElement('h5');
    updateRoomStatusH5.innerHTML = 'Update rooms status';
    updateRoomStatusDiv.appendChild(updateRoomStatusH5);

    const updateRoomStatusForm = document.createElement('form');
    updateRoomStatusForm.style.width = "70%";

    const inputRoomStatusFieldLabels = ['RoomID', 'Status'];

    for (let i = 0; i < 2; i++) {
      const updateRoomStatuslabel = document.createElement('label');
      updateRoomStatuslabel.innerText = inputRoomStatusFieldLabels[i];
      const updateRoomStatusinput = document.createElement('input');
      updateRoomStatusinput.setAttribute('name', inputRoomStatusFieldLabels[i]);
      updateRoomStatusinput.setAttribute('id', inputRoomStatusFieldLabels[i]);
      updateRoomStatusinput.classList.add('form-control');
      updateRoomStatusForm.appendChild(updateRoomStatuslabel);
      updateRoomStatusForm.appendChild(updateRoomStatusinput);
    }

    //Create the submit button
    const updateRoomStatusButton = document.createElement('button');
    updateRoomStatusButton.setAttribute('type', 'submit');
    updateRoomStatusButton.innerHTML = 'Update status';
    updateRoomStatusButton.classList.add('btn', 'btn-success', 'addCarBtn')
    updateRoomStatusForm.appendChild(updateRoomStatusButton);

    updateRoomStatusDiv.appendChild(updateRoomStatusForm);
    mainContent.appendChild(updateRoomStatusDiv)

    //ADD ROOM SECTION
    const addRoomH5 = document.createElement('h5');
    addRoomH5.innerHTML = 'Add a room';
    addRoomDiv.appendChild(addRoomH5);

    const addRoomForm = document.createElement('form');
    addRoomForm.style.width = "70%";

    const inputaddFieldLabels = ['Location', 'Status'];
    const addRoomId = ['addLocation', 'addStatus'];

    for (let i = 0; i < 2; i++) {
      const addRoomlabel = document.createElement('label');
      addRoomlabel.innerText = inputaddFieldLabels[i];
      const addRoominput = document.createElement('input');
      addRoominput.setAttribute('name', inputaddFieldLabels[i]);
      addRoominput.setAttribute('id', addRoomId[i]);
      addRoominput.classList.add('form-control');
      addRoomForm.appendChild(addRoomlabel);
      addRoomForm.appendChild(addRoominput);
    }

    //Create the submit button
    const addRoomButton = document.createElement('button');
    addRoomButton.setAttribute('type', 'submit');
    addRoomButton.innerHTML = 'Add room';
    addRoomButton.classList.add('btn', 'btn-success', 'addCarBtn')
    addRoomForm.appendChild(addRoomButton);

    addRoomDiv.appendChild(addRoomForm);
    mainContent.appendChild(addRoomDiv)

    //DELETE ROOM SECTION
    const deleteRoomH5 = document.createElement('h5');
    deleteRoomH5.innerHTML = 'Delete a room';
    deleteRoomDiv.appendChild(deleteRoomH5);

    const deleteRoomForm = document.createElement('form');
    deleteRoomForm.style.width = "70%";

      const deleteRoomlabel = document.createElement('label');
      deleteRoomlabel.innerText = 'RoomID';
      const deleteRoominput = document.createElement('input');
      deleteRoominput.setAttribute('name', 'roomId');
      deleteRoominput.setAttribute('id', 'deleteRoomId');
      deleteRoominput.classList.add('form-control');
      deleteRoomForm.appendChild(deleteRoomlabel);
      deleteRoomForm.appendChild(deleteRoominput);

    //Create the submit button
    const deleteRoomButton = document.createElement('button');
    deleteRoomButton.setAttribute('type', 'submit');
    deleteRoomButton.innerHTML = 'Delete room';
    deleteRoomButton.classList.add('btn', 'btn-danger', 'addCarBtn')
    deleteRoomForm.appendChild(deleteRoomButton);

    deleteRoomDiv.appendChild(deleteRoomForm);

    updateAddDeleteRoomsDiv.appendChild(updateRoomStatusDiv)
    updateAddDeleteRoomsDiv.appendChild(addRoomDiv)
    updateAddDeleteRoomsDiv.appendChild(deleteRoomDiv)

    mainContent.appendChild(updateAddDeleteRoomsDiv)

    // Call events on form submit
    updateRoomStatusForm.addEventListener('submit', (e) => {
      e.preventDefault();
        let updateRoomData = {
          roomId : document.querySelector('#RoomID').value,
          roomStatus : document.querySelector('#Status').value
        }

        updateRoomInfo(updateRoomData)
    })

    addRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();
        let addRoomData = {
          roomLocation : document.querySelector('#addLocation').value,
          roomStatus : document.querySelector('#addStatus').value
        }

        addRoomInfo(addRoomData)
    })

    deleteRoomForm.addEventListener('submit', (e) => {
      e.preventDefault();
        let deleteRoomData = {
          roomId : document.querySelector('#deleteRoomId').value
        }

        deleteRoomInfo(deleteRoomData)
    })
}

function updateRoomInfo(updateRoomData) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(updateRoomData)
  }
  fetch('/updateRoomInfo', options)
}

function addRoomInfo(addRoomData) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(addRoomData)
  }
  fetch('/addRoomInfo', options)
}

function deleteRoomInfo(addRoomData) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(addRoomData)
  }
  fetch('/deleteRoomInfo', options)
}

//ASSET MANAGEMENT

//TRACKING OFFICE SPACE
document.querySelector('#trackOffices').addEventListener('click', (e) => {
  e.preventDefault();
  if(document.querySelector('.main-content') !== null){
    document.querySelector('.main-content').innerHTML = "";
  }

  getOfficeInfo();
})

async function getOfficeInfo(){
  const response = await fetch('/officeInfo');

  //returns a promise so we need to convert it json
  const data = await response.json();
  console.log(data)

  const officeTrackh2 = document.createElement('h2');
  officeTrackh2.innerText = 'Office Management Information';
  mainContent.appendChild(officeTrackh2);

  //create bootstrap cards
const officeInfoDiv = document.createElement('div');
officeInfoDiv.classList.add('container-fluid', 'd-flex', 'flex-wrap');

for (let i = 0; i < data.length; i++) {
const officeCardsDiv = document.createElement('div');
officeCardsDiv.classList.add('card', 'text-white', 'bg-success', 'mb-3', 'ms-3')
officeCardsDiv.style.maxWidth = '18rem';
const officeCardsHeaderDiv = document.createElement('div');
officeCardsHeaderDiv.innerHTML = 'Office No: ' + data[i].officeNo;
officeCardsHeaderDiv.classList.add('card-header')
const officeCardsBodyDiv = document.createElement('div');
officeCardsBodyDiv.classList.add('card-body')
const totalSpaceh5 = document.createElement('h6');
totalSpaceh5.innerHTML= 'Total Space: ' + data[i].totalSpace + ' Sq. ft'
totalSpaceh5.classList.add('card-text')
const usedSpaceh5 = document.createElement('h6');
usedSpaceh5.innerHTML= 'Used Space: ' + data[i].spaceUsed + ' Sq. ft'
usedSpaceh5.classList.add('card-text')
const freeSpaceh5 = document.createElement('h6');
freeSpaceh5.innerHTML= 'Free Space: ' + (data[i].totalSpace - data[i].spaceUsed) + ' Sq. ft'
freeSpaceh5.classList.add('card-text')

officeCardsDiv.appendChild(officeCardsHeaderDiv)
officeCardsBodyDiv.appendChild(totalSpaceh5)
officeCardsBodyDiv.appendChild(usedSpaceh5)
officeCardsBodyDiv.appendChild(freeSpaceh5)
officeCardsDiv.appendChild(officeCardsBodyDiv)
officeInfoDiv.appendChild(officeCardsDiv)
mainContent.appendChild(officeInfoDiv);
}

const modifyOfficeInfoDiv = document.createElement('div');
modifyOfficeInfoDiv.classList.add('container-fluid', 'd-flex', 'justify-content-around');

const updateOfficeInfoDiv = document.createElement('div');
updateOfficeInfoDiv.classList.add('d-flex', 'flex-column');
const addOfficeDiv = document.createElement('div');
const deleteOfficeDiv = document.createElement('div');

const updateOfficeInfoh5 = document.createElement('h5');
updateOfficeInfoh5.style.fontWeight = 'bold';
updateOfficeInfoh5.innerHTML = 'Update office info:'
updateOfficeInfoDiv.appendChild(updateOfficeInfoh5)

const updateOfficeForm = document.createElement('form');
const officeIdLabel = document.createElement('label')
officeIdLabel.innerHTML = 'Office Id';
const officeIdInput = document.createElement('input')
officeIdInput.classList.add('form-control')
officeIdInput.type = 'text';
officeIdInput.setAttribute('id', 'officeIdInput')
const totalSpaceLabel = document.createElement('label')
totalSpaceLabel.innerHTML = 'Total Space';
const totalSpaceInput = document.createElement('input')
totalSpaceInput.classList.add('form-control')
totalSpaceInput.type = 'text';
totalSpaceInput.setAttribute('id', 'updateTotalSpace')
const usedSpaceLabel = document.createElement('label')
usedSpaceLabel.innerHTML = 'Used Space';
const usedSpaceInput = document.createElement('input')
usedSpaceInput.classList.add('form-control')
usedSpaceInput.type = 'text';
usedSpaceInput.setAttribute('id', 'updateUsedSpace')

const updateOfficeBtn = document.createElement('button')
updateOfficeBtn.classList.add('btn', 'btn-success', 'addCarBtn')
updateOfficeBtn.innerHTML = 'Update'


updateOfficeForm.appendChild(officeIdLabel)
updateOfficeForm.appendChild(officeIdInput)
updateOfficeForm.appendChild(totalSpaceLabel);
updateOfficeForm.appendChild(totalSpaceInput);
updateOfficeForm.appendChild(usedSpaceLabel);
updateOfficeForm.appendChild(usedSpaceInput);

updateOfficeForm.appendChild(updateOfficeBtn)

updateOfficeInfoDiv.appendChild(updateOfficeForm)

const addOfficeInfoh5 = document.createElement('h5');
addOfficeInfoh5.style.fontWeight = 'bold';
addOfficeInfoh5.innerHTML = 'Add a new office:'
addOfficeDiv.appendChild(addOfficeInfoh5)

const addOfficeForm = document.createElement('form');
const addtotalSpaceLabel = document.createElement('label')
addtotalSpaceLabel.innerHTML = 'Total Space';
const addtotalSpaceInput = document.createElement('input')
addtotalSpaceInput.classList.add('form-control')
addtotalSpaceInput.type = 'text';
addtotalSpaceInput.setAttribute('id', 'addTotalSpace')
const addusedSpaceLabel = document.createElement('label')
addusedSpaceLabel.innerHTML = 'Used Space';
const addusedSpaceInput = document.createElement('input')
addusedSpaceInput.classList.add('form-control')
addusedSpaceInput.type = 'text';
addusedSpaceInput.setAttribute('id', 'addusedSpace')

const addOfficeBtn = document.createElement('button')
addOfficeBtn.classList.add('btn', 'btn-success', 'addCarBtn')
addOfficeBtn.innerHTML = 'Add'

addOfficeForm.appendChild(addtotalSpaceLabel);
addOfficeForm.appendChild(addtotalSpaceInput);
addOfficeForm.appendChild(addusedSpaceLabel);
addOfficeForm.appendChild(addusedSpaceInput);

addOfficeForm.appendChild(addOfficeBtn)

addOfficeDiv.appendChild(addOfficeForm)

const deleteOfficeInfoh5 = document.createElement('h5');
deleteOfficeInfoh5.style.fontWeight = 'bold';
deleteOfficeInfoh5.innerHTML = 'Delete new office:'
deleteOfficeDiv.appendChild(deleteOfficeInfoh5)

const deleteOfficeForm = document.createElement('form');
const deleteOfficeIdLabel = document.createElement('label')
deleteOfficeIdLabel.innerHTML = 'Office id';
const deleteOfficeIdInput = document.createElement('input')
deleteOfficeIdInput.classList.add('form-control')
deleteOfficeIdInput.type = 'text';
deleteOfficeIdInput.setAttribute('id', 'deleteOfficeId')

const deleteOfficeBtn = document.createElement('button')
deleteOfficeBtn.classList.add('btn', 'btn-danger', 'addCarBtn')
deleteOfficeBtn.innerHTML = 'Delete'


deleteOfficeForm.appendChild(deleteOfficeIdLabel);
deleteOfficeForm.appendChild(deleteOfficeIdInput);

deleteOfficeForm.appendChild(deleteOfficeBtn);

deleteOfficeDiv.appendChild(deleteOfficeForm)

modifyOfficeInfoDiv.appendChild(updateOfficeInfoDiv)
modifyOfficeInfoDiv.appendChild(addOfficeDiv)
modifyOfficeInfoDiv.appendChild(deleteOfficeDiv)


mainContent.appendChild(modifyOfficeInfoDiv);

updateOfficeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let updateOfficeInfo = {
    officeId: document.getElementById('officeIdInput').value,
    totalSpace : document.getElementById('updateTotalSpace').value,
    usedSpace : document.getElementById('updateUsedSpace').value
  };
  updateOffice(updateOfficeInfo);
})
addOfficeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let addOfficeInfo = {
    totalSpace : document.getElementById('addTotalSpace').value,
    usedSpace : document.getElementById('addusedSpace').value
  };
  addOffice(addOfficeInfo);
})
deleteOfficeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let deleteOfficeInfo = {
    deleteOfficeId : document.getElementById('deleteOfficeId').value
  };
  deleteOffice(deleteOfficeInfo);
})

}

async function updateOffice(updateOfficeInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(updateOfficeInfo)
  }
  fetch('/updateOffice', options)
}
async function addOffice(addOfficeInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(addOfficeInfo)
  }
  fetch('/addOffice', options)
}

async function deleteOffice(deleteOfficeInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(deleteOfficeInfo)
  }
  fetch('/deleteOffice', options)
}

//TRACKING STAFF HOUSES
document.querySelector('#trackStaffHouses').addEventListener('click', (e) => {
  e.preventDefault();
  if(document.querySelector('.main-content') !== null){
    document.querySelector('.main-content').innerHTML = "";
  }

  getStaffHousesInfo();
})

async function getStaffHousesInfo(){
  const response = await fetch('/getStaffHouses')
  const data = await response.json()
  console.log(data)

    //create bootstrap cards
const staffInfoDiv = document.createElement('div');
staffInfoDiv.classList.add('container-fluid', 'd-flex', 'flex-wrap');

for (let i = 0; i < data.length; i++) {
const staffCardsDiv = document.createElement('div');
staffCardsDiv.classList.add('card', 'text-white', 'bg-success', 'mb-3', 'ms-3')
staffCardsDiv.style.maxWidth = '18rem';
const staffCardsHeaderDiv = document.createElement('div');
staffCardsHeaderDiv.innerHTML = 'Office No: ' + data[i].houseNo;
staffCardsHeaderDiv.classList.add('card-header')
const staffCardsBodyDiv = document.createElement('div');
staffCardsBodyDiv.classList.add('card-body')
const houseRateh5 = document.createElement('h6');
houseRateh5.innerHTML= 'House Rate: ' + 'Kshs.' + data[i].rate
houseRateh5.classList.add('card-text')
const houseStatush5 = document.createElement('h6');
houseStatush5.innerHTML= 'House Status: ' + data[i].status
houseStatush5.classList.add('card-text')
const houseDescriptionp = document.createElement('p')
houseDescriptionp.innerHTML= 'HouseDescription: <hr>' + data[i].houseDescription
houseDescriptionp.classList.add('card-text')
const vacationDateh5 = document.createElement('h6');
vacationDateh5.innerHTML= 'Vacation Date: ' + new Date(data[i].expectedVacationDate).getDate() + '-' + (new Date(data[i].expectedVacationDate).getMonth() + 1) + '-' + new Date(data[i].expectedVacationDate).getFullYear() + '<br><br>'
vacationDateh5.classList.add('card-text')

staffCardsDiv.appendChild(staffCardsHeaderDiv)
staffCardsBodyDiv.appendChild(houseRateh5)
staffCardsBodyDiv.appendChild(houseStatush5)
staffCardsBodyDiv.appendChild(vacationDateh5)
staffCardsBodyDiv.appendChild(houseDescriptionp)
staffCardsDiv.appendChild(staffCardsBodyDiv)
staffInfoDiv.appendChild(staffCardsDiv)
mainContent.appendChild(staffInfoDiv);
}

const modifyHouseInfoDiv = document.createElement('div');
modifyHouseInfoDiv.classList.add('container-fluid', 'd-flex', 'justify-content-around');

const updateHouseInfoDiv = document.createElement('div');
updateHouseInfoDiv.classList.add('d-flex', 'flex-column');
const addHouseDiv = document.createElement('div');
const deleteHouseDiv = document.createElement('div');

const updateHouseInfoh5 = document.createElement('h5');
updateHouseInfoh5.style.fontWeight = 'bold';
updateHouseInfoh5.innerHTML = 'Update house info:'
updateHouseInfoDiv.appendChild(updateHouseInfoh5)

const updateHouseForm = document.createElement('form');
const houseIdLabel = document.createElement('label')
houseIdLabel.innerHTML = 'House Id';
const houseIdInput = document.createElement('input')
houseIdInput.classList.add('form-control')
houseIdInput.type = 'text';
houseIdInput.setAttribute('id', 'houseIdInput')
const rateLabel = document.createElement('label')
rateLabel.innerHTML = 'House Rate';
const rateInput = document.createElement('input')
rateInput.classList.add('form-control')
rateInput.type = 'text';
rateInput.setAttribute('id', 'updateRate')
const statusLabel = document.createElement('label')
statusLabel.innerHTML = 'House Status';
const statusInput = document.createElement('input')
statusInput.classList.add('form-control')
statusInput.type = 'text';
statusInput.setAttribute('id', 'updateStatus')
const vacationDateLabel = document.createElement('label')
vacationDateLabel.innerHTML = 'Expected Vacation Date';
const vacationDateInput = document.createElement('input')
vacationDateInput.classList.add('form-control')
vacationDateInput.type = 'text';
vacationDateInput.setAttribute('id', 'updateVacation')
const houseDescriptionLabel = document.createElement('label')
houseDescriptionLabel.innerHTML = 'House Description';
const houseDescriptionInput = document.createElement('input')
houseDescriptionInput.classList.add('form-control')
houseDescriptionInput.type = 'text-area';
houseDescriptionInput.setAttribute('id', 'updateDescription')

const updateHouseBtn = document.createElement('button')
updateHouseBtn.classList.add('btn', 'btn-success', 'addCarBtn')
updateHouseBtn.innerHTML = 'Update'


updateHouseForm.appendChild(houseIdLabel)
updateHouseForm.appendChild(houseIdInput)
updateHouseForm.appendChild(rateLabel);
updateHouseForm.appendChild(rateInput);
updateHouseForm.appendChild(statusLabel);
updateHouseForm.appendChild(statusInput);
updateHouseForm.appendChild(vacationDateLabel);
updateHouseForm.appendChild(vacationDateInput);
updateHouseForm.appendChild(houseDescriptionLabel);
updateHouseForm.appendChild(houseDescriptionInput);

updateHouseForm.appendChild(updateHouseBtn)

updateHouseInfoDiv.appendChild(updateHouseForm)


//add house
const addHouseInfoh5 = document.createElement('h5');
addHouseInfoh5.style.fontWeight = 'bold';
addHouseInfoh5.innerHTML = 'Add a house:'
addHouseDiv.appendChild(addHouseInfoh5)

const addHouseForm = document.createElement('form');
const addrateLabel = document.createElement('label')
addrateLabel.innerHTML = 'House Rate';
const addrateInput = document.createElement('input')
addrateInput.classList.add('form-control')
addrateInput.type = 'text';
addrateInput.setAttribute('id', 'addRate')
const addstatusLabel = document.createElement('label')
addstatusLabel.innerHTML = 'House Status';
const addstatusInput = document.createElement('input')
addstatusInput.classList.add('form-control')
addstatusInput.type = 'text';
addstatusInput.setAttribute('id', 'addStatus')
const addvacationDateLabel = document.createElement('label')
addvacationDateLabel.innerHTML = 'Expected Vacation Date';
const addvacationDateInput = document.createElement('input')
addvacationDateInput.classList.add('form-control')
addvacationDateInput.type = 'text';
addvacationDateInput.setAttribute('id', 'addVacation')
const addhouseDescriptionLabel = document.createElement('label')
addhouseDescriptionLabel.innerHTML = 'House Description';
const addhouseDescriptionInput = document.createElement('input')
addhouseDescriptionInput.classList.add('form-control')
addhouseDescriptionInput.type = 'text-area';
addhouseDescriptionInput.setAttribute('id', 'addDescription')

const addHouseBtn = document.createElement('button')
addHouseBtn.classList.add('btn', 'btn-success', 'addCarBtn')
addHouseBtn.innerHTML = 'Add'

addHouseForm.appendChild(addrateLabel);
addHouseForm.appendChild(addrateInput);
addHouseForm.appendChild(addstatusLabel);
addHouseForm.appendChild(addstatusInput);
addHouseForm.appendChild(addvacationDateLabel);
addHouseForm.appendChild(addvacationDateInput);
addHouseForm.appendChild(addhouseDescriptionLabel);
addHouseForm.appendChild(addhouseDescriptionInput);

addHouseForm.appendChild(addHouseBtn)

addHouseDiv.appendChild(addHouseForm)

//delete house
const deleteHouseInfoh5 = document.createElement('h5');
deleteHouseInfoh5.style.fontWeight = 'bold';
deleteHouseInfoh5.innerHTML = 'Delete a house:'
deleteHouseDiv.appendChild(deleteHouseInfoh5)

const deleteHouseForm = document.createElement('form');
const deletehouseIdLabel = document.createElement('label')
deletehouseIdLabel.innerHTML = 'House Id';
const deletehouseIdInput = document.createElement('input')
deletehouseIdInput.classList.add('form-control')
deletehouseIdInput.type = 'text';
deletehouseIdInput.setAttribute('id', 'deletehouseIdInput')

const deleteHouseBtn = document.createElement('button')
deleteHouseBtn.classList.add('btn', 'btn-success', 'addCarBtn')
deleteHouseBtn.innerHTML = 'Delete'

deleteHouseForm.appendChild(deletehouseIdLabel)
deleteHouseForm.appendChild(deletehouseIdInput)
deleteHouseForm.appendChild(deleteHouseBtn)

deleteHouseDiv.appendChild(deleteHouseForm)

modifyHouseInfoDiv.appendChild(updateHouseInfoDiv)
modifyHouseInfoDiv.appendChild(addHouseDiv)
modifyHouseInfoDiv.appendChild(deleteHouseDiv)


mainContent.appendChild(modifyHouseInfoDiv);

updateHouseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let updateHouseInfo = {
    houseId : document.getElementById('houseIdInput').value,
    rate : document.getElementById('updateRate').value,
    status : document.getElementById('updateStatus').value,
    expectedVacationDate : document.getElementById('updateVacation').value,
    description : document.getElementById('updateDescription').value
  };
  updateHouse(updateHouseInfo);
})
addHouseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let addHouseInfo = {
    rate : document.getElementById('addRate').value,
    status : document.getElementById('addStatus').value,
    expectedVacationDate : document.getElementById('addVacation').value,
    description : document.getElementById('addDescription').value
  };
  addHouse(addHouseInfo);
})
deleteHouseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let deleteHouseInfo = {
    deleteHouseId : document.getElementById('deletehouseIdInput').value
  };
  deleteHouse(deleteHouseInfo);
})
}

async function updateHouse(updateHouseInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(updateHouseInfo)
  }
  fetch('/updateHouse', options)
}

async function addHouse(addHouseInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(addHouseInfo)
  }
  fetch('/addHouse', options)
}

async function deleteHouse(deleteHouseInfo){
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(deleteHouseInfo)
  }
  fetch('/deleteHouse', options)
}