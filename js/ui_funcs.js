"use strict";

function get_data(inputs_object) {
    let data_object = {};
    for (let key in inputs_object) {
        data_object[key] = inputs_object[key].value;
    }

    return data_object;
}


function prepare_rect_data(data) {
    let new_object = {};

    for (let key in data) {
        let number = parseInt(data[key]); 
        if (!isNaN(number)) {
            new_object[key] = number;
        }
    }
    new_object["color"] = data["color"];

    return new_object;
}

function generate_rect(data) {

    let rect = new Rect(data.x, data.y, data.vel_x, data.vel_y, data.width, data.color, ctx);
    return rect;
}