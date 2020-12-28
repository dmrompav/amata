// -----------------------------------------------------------------
// ! ============= templates =========================
// -----------------------------------------------------------------
const buttons = [
	'о компании','услуги','технологии','наши проекты','контакты','вакансии'
]
const temp = [
	``,
	``,
	``,
	``,
	``,
	``
]



// -----------------------------------------------------------------
// ! ============= var =========================
// -----------------------------------------------------------------
const selBut = document.querySelectorAll(".selector__button"),
	largeBut = document.querySelector(".menu__large-button"),
	menuName = document.querySelector(".menu__name"),
	menuLi = document.querySelectorAll(".menu__li"),
	wrapper = document.querySelector(".wrapper"),
	menu = document.querySelector(".menu"),
	main = document.querySelector(".main"),
	tapfield = document.querySelector(".tapfield")

const CIRCLE = 250


// -----------------------------------------------------------------
// ! ============= view =========================
// -----------------------------------------------------------------
let quantity = selBut.length,															//количество кнопок
	topButQuantity = (quantity % 2 === 0) ? (quantity / 2) : (quantity / 2 + 1),		//количество верхних кнопок
	bottomButQuantity = quantity - topButQuantity											//количество нижних кнопок
const SelButPosition = () => {
	//верхних кнопок
	for (let i = 0; i < topButQuantity; i++) {
		let rotation = (180 / (topButQuantity) * (i + 0.5) - 90)
		menuLi[i].style.transform = 'rotateZ(' + (rotation) + 'deg)'
		selBut[i].style.transform = 'rotateZ(' + -rotation + 'deg)'
		// selBut[i].addEventListener("click", CallPopUp, false)
	}
	//нижних кнопок
	for (let i = topButQuantity; i < quantity; i++) {
		let rotation = (180 / (bottomButQuantity) * (i - topButQuantity + 0.5) + 90)
		menuLi[i].style.transform = 'rotateZ(' + (rotation) + 'deg)'
		selBut[i].style.transform = 'rotateZ(' + -rotation + 'deg)'
		// selBut[i].addEventListener("click", CallPopUp, false)
	}
}
SelButPosition();


// *CANVAS ================================
(() => {
	const config = {
		dotMinRad: 2,
		dotMaxRad: 20,
		sphereRad: 350,
		bigDotRad: 35,
		mouseSize: 120,
		massFactor: 0.003,
		firstColor: "rgba(256, 256, 256, 0.1)",
		secondColor: "rgba(256, 256, 256, 0.6)",
		smooth: 0.85,
	}
	const TWO_PI = 2 * Math.PI;
	const canvas = document.querySelector(`canvas`);
	const ctx = canvas.getContext(`2d`);
	let w, h, mouse, dots;
	class Dot {
		constructor(r) {
			this.pos = { x: mouse.x, y: mouse.y }
			this.vel = { x: 0, y: 0 }
			this.rad = r || random(config.dotMinRad, config.dotMaxRad);
			this.mass = this.rad * config.massFactor;
			this.color = config.defColor;
		}
		draw(x, y) {
			this.pos.x = x || this.pos.x + this.vel.x;
			this.pos.y = y || this.pos.y + this.vel.y;
			createCircle(this.pos.x, this.pos.y, this.rad, true, config.firstColor);
			createCircle(this.pos.x, this.pos.y, this.rad, false, config.secondColor);
		}
	}
	function updateDots() {
		for (let i = 1; i < dots.length; i++) {
			let acc = { x: 0, y: 0 }
			for (let j = 0; j < dots.length; j++) {
				if (i == j) continue;
				let [a, b] = [dots[i], dots[j]];
				let delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y }
				let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
				let force = (dist - config.sphereRad) / dist * b.mass;
				if (j == 0) {
					let alpha = config.mouseSize / dist;
					a.color = `rgba(250, 10, 30, ${alpha})`;
					dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
				}
				acc.x += delta.x * force;
				acc.y += delta.y * force;
			}
			dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
			dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
		}
		dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
	}
	function createCircle(x, y, rad, fill, color) {
		ctx.fillStyle = ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, TWO_PI);
		ctx.closePath();
		fill ? ctx.fill() : ctx.stroke();
	}
	function random(min, max) {
		return Math.random() * (max - min) + min;
	}
	function init() {
		w = canvas.width = innerWidth;
		h = canvas.height = innerHeight;
		document.addEventListener("resize", () => {
			w = canvas.width = window.innerWidth
			h = canvas.height = window.innerHeight
		})
		mouse = { x: w / 2, y: h / 2, down: false }
		dots = [];
		dots.push(new Dot(config.bigDotRad));
	}
	function loop() {
		ctx.clearRect(0, 0, w, h);
		if (dots.length < 40) { dots.push(new Dot()); }
		updateDots();
		window.requestAnimationFrame(loop);
	}
	init();
	loop();
	function setPos(event) {
		[mouse.x, mouse.y] = [event.clientX, event.clientY];
	}
	document.addEventListener(`mousemove`, setPos);
	document.addEventListener(`mousedown`, () => config.sphereRad = 50);
	document.addEventListener(`mouseup`, () => config.sphereRad = 350);

	// setInterval(() => {
	// 	config.sphereRad = Math.random() * (350-150) + 150
	// }, 3000);
	// setInterval(() => {
	// 	config.sphereRad = Math.random() * (950-550) + 550
	// }, 15001);
})();



// -----------------------------------------------------------------
// ! ============= control =========================
// -----------------------------------------------------------------
let isNameOpened = false
largeBut.addEventListener("click", () => {
	if (isNameOpened) {
		menuName.classList.remove("menu__name-opened")
		menuLi.forEach(e => e.classList.remove("menu__li-opened"))
		for (let i = 0; i < quantity; i++) {
			selBut[i].style.top = '0px'
			selBut[i].style.opacity = 0
		}
	} else {
		menuName.classList.add("menu__name-opened")
		menuLi.forEach(e => e.classList.add(`menu__li-opened`))
		for (let i = 0; i < quantity; i++) {
			selBut[i].style.top = - CIRCLE + 'px'
			selBut[i].style.opacity = 1
		}
	}
	isNameOpened = !isNameOpened
})

document.addEventListener("mousemove", (e) => {
	let rotationX = - (e.clientX - window.innerWidth / 2) / window.innerWidth * 40 - 7,
		rotationY = (e.clientY - window.innerHeight / 2) / window.innerHeight * 40 + 7
	menu.style.transform = 'rotateX(' + rotationY + 'deg) rotateY(' + rotationX + 'deg)'
})

selBut.forEach(e => e.addEventListener("click", function () {
	for (let i = 0; i < quantity; i++) {
		if (this == selBut[i]) {
			wrapper.classList.add("wrapper-hidden")
			main.classList.add("main-opened")
		}
	}
}))

tapfield.addEventListener("click", function () {
	wrapper.classList.remove("wrapper-hidden")
	main.classList.remove("main-opened")
})