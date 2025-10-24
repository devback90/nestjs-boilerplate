module.exports = {
    // ...
    "rules": {
        "no-restricted-paths": [
            "error",
            {

                "target": "libs/storage/**/*",


                "from": ["app/core-api/**/*"],

                "message": "Data 레이어에서는 Presentation에 의존할수 없습니다."
            }
        ]
    }
};