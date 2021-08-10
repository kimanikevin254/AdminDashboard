console.log("JS LOADED")

document.getElementById("cartrack").addEventListener('click', (e) => {
    e.preventDefault();

    getCarTrackingInfo();
})

const mainContent = document.querySelector('.main-content');

//Get car info from the server
async function getCarTrackingInfo(){
    const response = await fetch('/cartracking');

    //returns a promise so we need to convert it json
    const data = await response.json();

    const h2 = document.createElement('h2');
    h2.innerText = 'Car Tracking Information';
    mainContent.appendChild(h2);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.classList.add('table', 'table-striped');
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'carinfo');

    console.log(tbody.id);

      const thead = document.createElement('thead');
      thead.classList.add('bg-info');
      thead.style.color = 'white';
      thead.innerHTML = `<tr>
                      <td>Car Id</td>
                      <td>Car Model</td>
                      <td>Location</td>
                      <td>Carrying capacity</td>
                    </tr>
                  `;
      table.appendChild(thead);

    table.appendChild(tbody);
    mainContent.appendChild(table);

    buildTable(data);

    function buildTable(myArray){
      let tbody = document.querySelector('#carinfo');

      for(var i = 0; i < myArray.length; i++){
        var row = `<tr>
                      <td>${myArray[i].id}</td>
                      <td>${myArray[i].model}</td>
                      <td>${myArray[i].location}</td>
                      <td>${myArray[i].capacity}</td>
                    </tr>
                  `;
        tbody.innerHTML += row;
      }
      
    }

    const h5 = document.createElement('h5');
    h5.innerText = 'Use this form to add a car:';
    mainContent.appendChild(h5);

    const form = document.createElement('form');
    form.style.width = "40%";
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/addCar');
    const inputFieldLabels = ['Model', 'Location', 'Capacity'];

    for (let i = 0; i < 3; i++) {
      const label = document.createElement('label');
      label.innerText = inputFieldLabels[i];
      const input = document.createElement('input');
      input.setAttribute('name', inputFieldLabels[i]);
      input.classList.add('form-control');
      form.appendChild(label);
      form.appendChild(input);
    }

    mainContent.appendChild(form);

    const AddCarButton = document.createElement('button');
    AddCarButton.setAttribute('type', 'submit');
    AddCarButton.innerHTML = 'Add Car';
    AddCarButton.classList.add('btn', 'btn-primary', 'addCarBtn')
    form.appendChild(AddCarButton);

    // AddCarButton.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   // console.log('Clicked' + AddCarButton.type);
    //   addCarToDb();
    // });

    console.log(data);

    // data.forEach((item) => {
    //   let li = document.createElement("li");
    //   const Deletebutton = document.createElement("button")
    //   Deletebutton.className = 'delete-tracking'
    //   Deletebutton.innerHTML = 'delete'
    //   li.innerText = `${item.id}  ${item.model} ${item.location} ${item.capacity}` 
    //   li.appendChild(Deletebutton)
    //   mainContent.appendChild(li)
    // });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.formData);
      console.log(formData);
      addCarToDb(formData);
    })
}

//Function to add a car to the database
async function addCarToDb(data){
  // const formData = new FormData(this.formData);
  const response = await fetch('/addCar', {
    method: 'POST',
    mode: 'cors',
    body: data.stringify
  })
  // const formData = new FormData(this.formData);
  // console.log(formData);
  // console.log(formData);

  // const response = await fetch('/addCar', {
  //   method: 'POST',
  //   body: formData
  // })
  // .then(res => res.text())          // convert to plain text
  // .then(text => console.log(text))

  // const data = await response.json();
  // console.log(data);

// const response = await fetch('/addCar');

//   //returns a promise so we need to convert it json
//   const data = await response.json();
//   console.log(data);

}

const trackAccidents = document.querySelector('.track-accidents')

trackAccidents.addEventListener('click', async (e)=> {
    e.preventDefault()

    const accidentData = await fetch('/accidents')
    const data = await accidentData.json()

 data.forEach((item) => {
     console.log(item);
      let li = document.createElement("li");
      li.innerText = `${item.id} ${item.description} at ${item.location} : Car model ${item.model}`
      
    //   list.appendChild(li);
      mainContent.appendChild(li)
    });

})



// $(function(){
//     $('#jqr').click(function() {
//         $("#content").load("accidents.html");
//     });
// });

    // $(document).ready(function(){
    //     $("#content").load("accidents.html");
    // });


