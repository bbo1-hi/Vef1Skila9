const API_URL = 'https://apis.is/isnic?domain=';
// const API_URL = '/example.json?number=';


/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {

  let input;
  let result;

  function element(type, text) { 
    let el = document.createElement(type);
    
    if(text) {  
    el.appendChild(document.createTextNode(text));
    }
    return el;
  }

  function erase(container) {
    while (container.firstChild) { 
      container.removeChild(container.firstChild)

    }
  }

  function showError(error) {
    erase(result);
    result.appendChild(element('p', error));
  }

  function showLoading() {
    erase(result);
    let loading = element('div');
    loading.classList.add('loading');

    let img = element('img');
    img.setAttribute('src', 'loading.gif');
    img.setAttribute('alt', 'loading gid');

    loading.appendChild(img);
    loading.appendChild(document.createTextNode('Leita að léni… '));
    result.appendChild(loading);
  }

  function ISOdate(date) {
    let SPLIT = date.split(' ');
    let day = SPLIT[0].substring(0, SPLIT[0].length-1);
    if (day.length === 1) day = '0'+ day;
    let month = SPLIT[1]; let year = SPLIT[2];
    let monthISO;
    switch (month) {
      case "January":   monthISO = "01"; break;
      case "February":  monthISO = "02"; break;
      case "March":     monthISO = "03"; break;
      case "April":     monthISO = "04"; break;
      case "May":       monthISO = "05"; break;
      case "june":      monthISO = "06"; break;
      case "July":      monthISO = "07"; break;
      case "August":    monthISO = "08"; break;
      case "September": monthISO = "09"; break;
      case "October":   monthISO = "10"; break;
      case "November":  monthISO = "11"; break;
      case "December":  monthISO = "12"; break;
      default : monthISO = ""; break;
     }
     return year + '-' + monthISO + '-' + day;
  }

  function showResults(data) {
    erase(result);

    let { domain } = data;
    let { registered } = data;
    let { lastChange } = data;
    let { expires } = data;
    let { registrantname } = data;
    let { email } = data;
    let { address } = data;
    let { country } = data;

    let ul = element('dl');
    ul.appendChild(element('dt', 'Lén'));
    ul.appendChild(element('dd', domain));

    ul.appendChild(element('dt', 'Skráð'));
    ul.appendChild(element('dd', ISOdate(registered)));

    ul.appendChild(element('dt', 'Seinast breytt'));
    ul.appendChild(element('dd', ISOdate(lastChange)));

    ul.appendChild(element('dt', 'Rennur út'));
    ul.appendChild(element('dd', ISOdate(expires)));

    ul.appendChild(element('dt', 'Skráningaraðili'));
    ul.appendChild(element('dd', registrantname));

    ul.appendChild(element('dt', 'Netfang'));
    ul.appendChild(element('dd', email));

    ul.appendChild(element('dt', 'Heimilisfang'));
    ul.appendChild(element('dd', address));

    ul.appendChild(element('dt', 'Land'));
    ul.appendChild(element('dd', country));

    result.appendChild(ul);
  }

  function fetchResults(lenleit){
    fetchResults(`${API_URL}${lenleit}`)
      .then( (data) =>{
        if(!data.ok) {
          throw new Error('Non 200 status');
        }
        return data.json();
      })
      .then( (data) => showResults(data.results))
      .catch( (error) => {
        console.error('ERROR', error); /* eslint-disable-line */
        showError('Villa við að sækja gögn');
      });    
  }

  function onSubmit(e) {
    e.preventDefault();

    const lenleit = input.value;
	
	if (lenleit.length === 0) {
      showError('Lén verður að vera strengur.');
    } else {
      search(input.value)
    }
  
  fetchResults(lenleit);
  showLoading();

  }
  
  function search(number) {
    let url = API_URL + number;
    let request = new XMLHttpRequest();

    showLoading();

    request.open('GET', url, true);
    request.onload = function validDATA() {
      let data = JSON.parse(request.response);
      if(data.results.length === 0) {
        showError('Lén er ekki skráð');
        throw new Error('Lén er ekki skráð');
      }
  
      if (request.status >= 200 && request.status < 400) {
        showResults(data.results[0]);
      } else {
        showError('Villa kom upp: ' + data.error);
      }
    };

    request.onerror = function validDATA() {
      showError('Villa við að sækja gögn');
    };

    request.send();
  }

  function init(domains) {
    let form = domains.querySelector('form');
    input = form.querySelector('input');
    result = domains.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
  });