console.log("JS LOADED")

const mainContent = document.querySelector('.main-content');

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
      carTrackthead.classList.add('bg-info');
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
    AddCarButton.classList.add('btn', 'btn-primary', 'addCarBtn')
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