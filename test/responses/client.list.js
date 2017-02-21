const errored = {
    "status": false,
    "error_code": 42,
    "error_message": "Failed to do something",
    "data":{
        "Something bad happened": "the other day",
    }
};

const all = {
    "status": true,
    "error_code": null,
    "error_message": "",
    "data": {
        "12345":{"clientid":"12345","first":"","last":"","checkname":""},
        "12346":{"clientid":"12346","first":"","last":"","checkname":""},
        "12347":{"clientid":"12347","first":"","last":"","checkname":""},
        "12348":{"clientid":"12348","first":"","last":"","checkname":""},
        "12349":{"clientid":"12349","first":"","last":"","checkname":""}
    }
};

const filtered = {
    "status": true,
    "error_code": null,
    "error_message": "",
    "data": {
        "12345":{"clientid":"12345","first":"","last":"","checkname":""}
    }
};

module.exports = {
    all: all,
    filtered: filtered,
    errored: errored
};
