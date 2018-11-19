module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true
    },
    "rules": {
        "no-unused-vars": [
            1,
            {
                "argsIgnorePattern": "Promise|res|next|^err"
            }
        ],
        "camelcase": 0,
        "func-names": 0,
        "arrow-body-style": ['warn'],
        "no-param-reassign": 0,
        "prefer-promise-reject-errors": 0,
    }

};