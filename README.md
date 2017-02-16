# js-ubersmithclient

Rewrite of python-ubersmithclient in everyone's favorite language

## Usage

```javascript
const UbersmithClient = require('UbersmithClient');
const ubClient = new UbersmithClient(url, user, password, timeout, use_http_get);

ubClient.client.list({client_id: 12345})  // returns a Promise
    .then(res => {
        console.log(res);
        // {
        //     "12345": {"clientid": "12345", "first":"", "last":"", ...}
        // }
    })
    .catch(err => {
        console.log(err);
    });

```

## Constructor args

- url: Ubersmith Base URL, e.g. `http://ubersmith.com`
- user: Ubersmith API username
- password: Ubersmith API password
- timeout: Request timeout length, in seconds (default: 60)
- use_http_get: Whether to GET or POST to Ubersmith (default: false, i.e. use POST)

# UB API method args

They must be passed in an Object, e.g. `client.list({client_id: 12345, brand_id: 6789})`

## TODO

- Wayyyyy moar tests
- Probably separate things into more than one file