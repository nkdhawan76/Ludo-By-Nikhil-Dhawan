const axios = require('axios');
let apiUrl = "https://api.psludo.com"
axios.get(apiUrl + '/dummychallenge/createDummychallenge/xJ874GVDy761209LoKm')
    .then(response => {
        console.log(response.data);
        console.log(response);

    })
    .catch(error => {
        console.log(error);
    });