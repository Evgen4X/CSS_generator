const div = document.getElementById("object");
const properties = ["background-color", "margin", "padding", "color", "border-color", "border-width", "border-style", "border-radius", "width", "height", "z-index", "!innerHTML", '"font-family', "font-size", "letter-spacing", "text-transform", "overflow", "text-decoration-line", "text-decoration-thickness", "text-decoration-color", "text-align", "#4box-shadow", "display", "opacity", "position", "top", "left", "filter", "backdrop-filter"];
const code_html = document.getElementById("code-html");
const code_css = document.getElementById("code-css");
const code_div = document.getElementById("code-div");
const defaults = {
	"background-color": "",
	margin: "0",
	padding: "0",
	color: "#000000",
	"border-color": "#000000",
	"border-width": "0",
	"border-style": "",
	"border-radius": "0",
	width: "0",
	height: "0",
	"z-index": "0",
	"font-family": "",
	"font-size": "",
	"letter-spacing": "0",
	"text-transform": "none",
	overflow: "visible",
	"text-decoration-line": "none",
	"text-decoration-thickness": "1",
	"text-decoration-color": "#000000",
	"text-align": "unset",
	"box-shadow": "0px 0px 0px #000000",
	display: "block",
	opacity: "1",
	position: "static",
	top: "0",
	left: "0",
	filter: "none",
	"backdrop-filter": "none",
};
const units = {
	blur: "px",
	brightness: "%",
	contrast: "%",
	grayscale: "%",
	hue_rotate: "deg",
	invert: "%",
	opacity: "%",
	saturate: "%",
	sepia: "%",
};

function get_listed_value(name, iters) {
	code = "";
	for (let i = 1; i < parseInt(iters) + 1; ++i) {
		code += document.getElementById("input-" + name + i).value;
		let input_unit = document.getElementById("input-" + name + i + "-unit");
		if (input_unit != null) {
			code += input_unit.value;
		}
		if (i != iters) {
			code += " ";
		}
	}

	return code;
}

function generate() {
	let selector = document.getElementById("input-selector").value;
	let code = `${selector}{\n`;
	for (property of properties) {
		let current_value = "";
		if (property[0] == "!") {
			continue;
		} else if (property[0] == '"') {
			current_value += "\t" + property.slice(1) + ": ";
			current_value += '"' + document.getElementById("input-" + property.slice(1)).value + '"';
		} else if (property[0] == "#") {
			current_value += "\t" + property.slice(2) + ": ";
			current_value += get_listed_value(property.slice(2), property[1]);
		} else {
			current_value += "\t" + property + ": ";
			let value = document.getElementById("input-" + property).value;
			if (value == defaults[property]) {
				continue;
			}
			let input_unit = document.getElementById("input-" + property + "-unit");
			if (input_unit != null) {
				value += input_unit.value;
			}
			let input_value = document.getElementById("input-" + property + "-value");
			if (input_value != null) {
				if (value != "none") {
					let function_value = input_value.value;
					value += `(${function_value}${units[value.replace("-", "_")]})`;
				} else {
					continue;
				}
			}
			current_value += value;
			if (property == "background-color" && trnasparent_bg.checked) {
				current_value = "\tbackground-color: transparent";
			}
		}
		code += current_value;
		code += `;\n`;
	}

	if (document.getElementById("input-additional").value.length != 0) {
		code += "\t" + document.getElementById("input-additional").value.split("\n").join("\n\t");
		code += "\n";
	}

	code += "}";

	code_css.textContent = code;

	code = `<div`;
	let new_selector = selector.split(" ");
	new_selector = new_selector[new_selector.length - 1];
	for (let i = 0; i < new_selector.length; ++i) {
		if (new_selector[i] == "#" || new_selector[i] == ".") {
			if (new_selector[i] == "#") {
				code += ' id="';
			} else {
				code += ' class="';
			}
			let j = i + 1;
			while (new_selector[j].match(/[A-Za-z_\-]/)) {
				code += new_selector[j];
				++j;
				if (new_selector.length == j) {
					break;
				}
			}
			console.log(new_selector[j]);
			code += '"';
		}
		if (new_selector[i] == "[" && new_selector.indexOf("]", i) > i) {
			let attribute = new_selector.slice(i + 1, new_selector.indexOf("]", i));
			let name = attribute.split("=")[0];
			let value = attribute.split("=")[1];
			if ("~^$|".includes(name[name.length - 1])) {
				name = name.slice(0, name.length - 1);
			}

			code += ` ${name}=${value}`;
		}
	}

	code += `>${document.getElementById("input-innerHTML").value}</div>`;
	code_html.textContent = code;
	code_div.style.display = "flex";
}

function code_close() {
	code_div.style.display = "none";
}

function update() {
	for (property of properties) {
		let current_value = "";
		let current_property = "";
		if (property[0] == "!") {
			div[property.slice(1)] = document.getElementById("input-" + property.slice(1)).value;
		} else if (property[0] == '"') {
			current_property = property.slice(1);
			current_value = '"' + document.getElementById("input-" + property.slice(1)).value + '"';
		} else if (property[0] == "#") {
			current_property = property.slice(2);
			current_value = get_listed_value(property.slice(2), property[1]);
		} else {
			current_property = property;
			let value = document.getElementById("input-" + property).value;
			let input_unit = document.getElementById("input-" + property + "-unit");
			if (value == defaults[current_property]) {
				continue;
			}
			if (input_unit != null) {
				value += input_unit.value;
			}
			let input_value = document.getElementById("input-" + property + "-value");
			if (input_value != null) {
				if (value != "none") {
					let function_value = input_value.value;
					value += `(${function_value}${units[value.replace("-", "_")]})`;
				} else {
					continue;
				}
			}
			current_value = value;
		}
		div.style[current_property] = current_value;
	}

	if (trnasparent_bg.checked) {
		div.style.backgroundColor = "transparent";
	}
}

document.querySelectorAll("input").forEach((input) => {
	input.onchange = update;
	if (input.type == "number") {
		input.onwheel = (event) => {
			input.value = parseFloat(input.value) + (event.deltaY > 0 ? -1 : 1) * parseFloat(input.getAttribute("wheelstep"));
			if (input.value < parseFloat(input.getAttribute("min"))) {
				input.value = input.getAttribute("min");
			} else if (input.value > parseFloat(input.getAttribute("max"))) {
				input.value = input.getAttribute("max");
			}
			update();
		};
	}
});

document.querySelectorAll("select").forEach((input) => {
	input.onchange = update;
});

document.querySelectorAll("textarea").forEach((input) => {
	input.onchange = update;
});

["aside1", "aside2", "main", "header"].forEach((id) => {
	document.getElementById(id).onclick = code_close;
});

["background-color"].forEach((body_property) => {
	document.getElementById("input-main-" + body_property).onchange = () => {
		document.getElementById("main").style[body_property] = document.getElementById("input-main-" + body_property).value;
	};
});

const trnasparent_bg = document.getElementById("transparent-background-color");

update();
