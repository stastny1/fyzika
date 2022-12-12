import { InputIds } from "./interfaces";
import { get_data, prepare_rect_data, generate_rect } from "./ui_funcs";

const inputs: InputIds = {
  x: "#x",
  y: "#y",
  vel_x: "#vel_x",
  vel_y: "#vel_y",
  width: "#width",
  color: "#color",
};

const button: HTMLElement | null = document.querySelector("#button");
const checkbox: HTMLElement | null = document.querySelector("#vectors");

for (let key in inputs) {
  let element = document.querySelector(inputs[key]);
  inputs[key] = element;
}

button.addEventListener("click", () => {
  let form_data = get_data(inputs);
  let rect_data = prepare_rect_data(form_data);
  let rect = generate_rect(rect_data);

  console.log(rect);
  if (physics._num_of_objects == 0) {
    physics.addObject(rect);
    physics.loop(150);
  } else {
    physics.addObject(rect);
  }
});

checkbox.addEventListener("change", () => {
  console.log(checkbox.checked);
  physics.drawVectors = checkbox.checked;
});
