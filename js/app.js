const requestResourceButton = document.getElementById('requestResourceButton');
const resourceType = document.getElementById('resourceType');
const resourceId = document.getElementById('resourceId');
const contentContainer = document.getElementById('contentContainer');
const baseUrl = 'https://swapi.co/api/';

requestResourceButton.addEventListener('click', function() {
  // console.log(this);
  // console.log(resourceType.value);
  let type = resourceType.value;
  let id = resourceId.value;

  let request = new XMLHttpRequest();
  let requestUrl = new URL(`${type}/${id}/`, baseUrl);

  // request.onreadystatechange = function() {
  //   if (request.status) {
  //     if (request.readyState === 4 && request.status !== 200) {
  //       clear(contentContainer);

  //       let errorResponse = document.createElement('h2');
  //       let errorURL = document.createElement('h2');
  //       let errorStatus = document.createElement('h2');

  //       contentContainer.appendChild(errorResponse);
  //       contentContainer.appendChild(errorURL);
  //       contentContainer.appendChild(errorStatus);

  //       errorResponse.innerText = request.response;
  //       errorURL.innerText = request.responseURL;
  //       errorStatus.innerText = request.status;
  //     }
  //   }
  // };

  request.addEventListener('load', function() {
    clear(contentContainer);

    if (this.readyState === 4 && this.status !== 200) {
      appendFields(request, contentContainer, [
        'response',
        'responseURL',
        'status'
      ]);
    }
    if (this.readyState === 4 && this.status === 200) {
      // clear(contentContainer);

      let response = JSON.parse(this.response);

      if (type === 'people') {
        appendFields(response, contentContainer, ['name', 'gender']);

        let personSpecies = document.createElement('p');
        let speciesRequest = new XMLHttpRequest();
        speciesRequest.addEventListener('load', function() {
          let speciesResponse = JSON.parse(this.response);
          personSpecies.innerText = speciesResponse.name;
          contentContainer.appendChild(personSpecies);
        });
        speciesRequest.open('GET', response.species[0]);
        speciesRequest.send();
      }
      if (type === 'planets') {
        appendFields(response, contentContainer, [
          'name',
          'terrain',
          'population'
        ]);

        appendFilms(response, contentContainer);
      }
      if (type === 'starships') {
        appendFields(response, contentContainer, [
          'name',
          'manufacturer',
          'starship_class'
        ]);

        appendFilms(response, contentContainer);
      }
    }
  });
  request.open('GET', requestUrl.href);
  request.send();
});

function clear(element) {
  element.innerText = '';
}

function appendFields(response, parentContainer, fields) {
  fields.forEach(function(elem) {
    let element = null;
    if (elem === 'name') {
      element = document.createElement('h2');
    } else {
      element = document.createElement('p');
    }
    if (elem.includes('https://swapi.co/api')) {
      appendXHR(elem);
    } else {
      parentContainer.appendChild(element);
      element.innerText = response[elem];
    }
  });
}

function appendXHR(parentContainer, targetElement, url) {
  let personSpecies = document.createElement('p');
  let speciesRequest = new XMLHttpRequest();
  speciesRequest.addEventListener('load', function() {
    let speciesResponse = JSON.parse(this.response);
    personSpecies.innerText = speciesResponse.name;
    contentContainer.appendChild(personSpecies);
  });
  speciesRequest.open('GET', response.species[0]);
  speciesRequest.send();
}

function appendFilms(response, parentContainer) {
  let filmsList = document.createElement('ul');
  parentContainer.appendChild(filmsList);

  response.films.forEach(function(elem) {
    let filmsRequest = new XMLHttpRequest();

    filmsRequest.addEventListener('load', function() {
      let filmResponse = JSON.parse(this.response);
      let filmItem = document.createElement('li');
      filmItem.innerText = filmResponse.title;
      filmsList.appendChild(filmItem);
    });
    filmsRequest.open('GET', elem);
    filmsRequest.send();
  });
}

// function createElement(tag) {
//   return document.createElement(tag);
// }
