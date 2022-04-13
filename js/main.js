class Rover{
  constructor(){
    this.apiKey = "mgmV5vUPYHEJzTCadeshpTHJaUWVhos8j8DDKAt0";
    this.roverName = ''
    this.roverCameras = ''
  }

  getRoverManifest(){
    fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${this.roverName}?api_key=${this.apiKey}`)
      .then(res=> res.json())
      .then(data => {
        console.log(data.photo_manifest, this.roverName)

        this.displayRoverManifest(data.photo_manifest);
      })
      .catch(err => `Error: ${err}`)
  }
  displayRoverManifest(photoManifest){
    const table = document.querySelector('tbody')
    table.deleteRow(-1)
    const tableRow = table.insertRow(-1);
    const properties = ['name','launch_date','landing_date','status','max_date','total_photos']
    for (let i=0; i < properties.length; i++){
      const tableData = tableRow.insertCell(-1)
      tableData.innerText = photoManifest[properties[i]];
    }
    this.displayAvailableRoverCameras();
  }
  setRoverCamers(){
    this.roverCameras = this.roverName === "Curiosity" ? ['FHAZ','RHAZ','MAST','CHEMCAM','MAHLI','MARDI','NAVCAM']:['FHAZ','RHAZ','NAVCAM','PANCAM','MINITES']
  }
  displayAvailableRoverCameras(){
    const selectCamerasElement = document.querySelector('.selectAvailableCameras');
    selectCamerasElement.innerHTML = ' ';
    for (const camera of this.roverCameras){
      selectCamerasElement.innerHTML += `<option value="${camera}">${camera}</option>`
    }
  }
  getImages(){
    console.log("Hello?")
    const selectedCamera = document.querySelector('.selectAvailableCameras').value
    const timePeriod = document.querySelector('input[type="date"]').value

    const images = []
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${this.roverName}/photos?earth_date=${timePeriod}&camera=${selectedCamera}&api_key=${this.apiKey}`)
      .then(res => res.json())
      .then( data => images = data.photos)
      .catch(err => `Error: ${err}`)
    console.log("Kittens?")
    this.displayImages(images)
    console.log("Does thos work?")
  }
  displayImages(images){
    console.log(images)
    document.querySelector('.img-gallery').innerHTML = '';

    for (image of images){
      console.log("why?")
      document.querySelector('.img-gallery').innerHTML += `<img src="${image.img_src}">`;
    }
  }
}

const SELECTED_ROVER = new Rover();
document.querySelector('.roverDetails').addEventListener('click', e => {
  SELECTED_ROVER.roverName = document.querySelector('.roverName').value;
  SELECTED_ROVER.setRoverCamers();
  SELECTED_ROVER.getRoverManifest();
})

document.querySelector('.getImages').addEventListener('click', e => SELECTED_ROVER.getImages())
