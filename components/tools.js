const fs = require("fs"),
dotenv = require("dotenv").config();

exports.writeLog = fileContent => {
    fs.writeFileSync(process.env.LOG_TXT, fileContent);
    return true;
};

exports.treatNumbers = (string_1, string_2) => {
    let temp_text = [string_1.split(""), string_2.split("")];
    let num_1, num_2;

    temp_text = [...temp_text].map(x => {
        let temp_nan = "";
        [...x].map(y => {
            if (y == "," || y == ".") {
                return false;
            };
            temp_nan += parseInt(y);
        });
        return temp_nan;
    });

    num_1 = temp_text[0];
    num_2 = temp_text[1];

    if (num_1.indexOf("NaN") != -1) {
        num_1 = temp_text[0].replace(/NaN/g, "");
        num_1 = `${num_1}00`;

        if (num_1.indexOf(",") != -1 || num_1.indexOf(".") != -1) {
            num_1 = num_1.replace(",", "");
        };

        num_1 = parseInt(num_1);
    };

    if (num_2.indexOf("NaN") != -1) {
        num_2 = temp_text[1].replace(/NaN/g, "");
        num_2 = `${num_2}00`;

        if (num_2.indexOf(",") != -1 || num_2.indexOf(".") != -1) {
            num_2 = num_2.replace(",", "");
        }

        num_2 = parseInt(num_2);
    };

    temp_text = [num_1, num_2];
    return temp_text;
};