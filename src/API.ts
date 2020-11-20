let API = 'https://zeus-proxy.automated.theqrl.org'
if (process.env.NODE_ENV === 'development') {
  API = 'https://cors-anywhere.herokuapp.com/https://zeus-proxy.automated.theqrl.org'
}

export default API