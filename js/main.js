class Rover{
  constructor(){
    this.apiKey = "mgmV5vUPYHEJzTCadeshpTHJaUWVhos8j8DDKAt0";
    this.roverName = ''
    this.roverCameras = ''
    this.images = []
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
    this.roverCameras = {
      "Perseverance" : {
        // do this for the rest of them later.
        "EDL_DDCAM" : "Descent Stage Down-Look Camera"
      }
       ["EDL_RUCAM","EDL_RDCAM","EDL_DDCAM","EDL_PUCAM1","EDL_PUCAM2","NAVCAM_LEFT","NAVCAM_RIGHT","MCZ_RIGHT","MCZ_LEFT","FRONT_HAZCAM_LEFT_A","FRONT_HAZCAM_RIGHT_A","REAR_HAZCAM_LEFT","REAR_HAZCAM_RIGHT","SKYCAM","SHERLOC_WATSON"],
      "Curiosity":['FHAZ','RHAZ','MAST','CHEMCAM','MAHLI','MARDI','NAVCAM'],
      "Spirit":['FHAZ','RHAZ','NAVCAM','PANCAM','MINITES'],
      "Opportunity": ['FHAZ','RHAZ','NAVCAM','PANCAM','MINITES'],
    }
  }
  displayAvailableRoverCameras(){
    const selectCamerasElement = document.querySelector('.selectAvailableCameras');
    selectCamerasElement.innerHTML = ' ';
    for (const camera of this.roverCameras[this.roverName]){
      // set this to be more human readable.
      selectCamerasElement.innerHTML += `<option value="${camera}">${camera}</option>`
    }
  }
  getImages(){
    const selectedCamera = document.querySelector('.selectAvailableCameras').value
    const timePeriod = document.querySelector('input[type="date"]').value

    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${this.roverName}/photos?earth_date=${timePeriod}&camera=${selectedCamera}&api_key=${this.apiKey}&page=1`)
      .then(res => res.json())
      .then(data => {
        this.images = data.photos;
        this.displayImages(this.images)
      })
      .catch(err => `Error: ${err}`);
  }
  displayImages(images){
    document.querySelector('.img-gallery').innerHTML = '';

    for (let image of images){
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
