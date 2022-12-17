document.addEventListener("DOMContentLoaded",() => {
	const phone = new BrickPhone("#phone");
});

class BrickPhone {
	constructor(el) {
		this.el = document.querySelector(el);
		this.isCalling = false;
		this.isDialing = false;
		this.isCycling = false;
		this.cycleTimer = null;
		this.callEndTimer = null;
		this.cycleOption = 0;
		this.charGroup = "";
		this.lock = false;
		this.memory = "";
		this.power = true;

		if (this.el) {
			this.el.addEventListener("click",this.buttonAction.bind(this));
			window.addEventListener("keydown",this.kbdInput.bind(this));
		}
	}
	buttonAction(e) {
		let tar = e.target || e;

		if (tar) {
			let val = tar.value;

			if (val) {
				// power
				if (val == "pwr")
					this.togglePower();

				if (this.power) {
					// key lock
					if (val == "lock")
						this.toggleLock();

					if (!this.isCalling && !this.lock) {
						// memory (RCL)
						if (val == "rcl") {
							if (this.memory) {
								this.isDialing = true;
								this.updateScreen(this.memory);
							}

						// memory (STO)
						} else if (val == "sto") {
							if (this.isDialing)
								this.memory = this.el.number.value;

						// clear
						} else if (val == "clr") {
							this.isDialing = false;
							this.charGroup = "";
							this.updateScreen("Ready");

						// send
						} else if (val == "snd") {
							if (this.isDialing) {
								this.isCalling = true;
								this.isDialing = false;
								this.charGroup = "";
								this.updateScreen("Calling " + this.el.number.value);
							}

						// power on
						} else if (val == "pwr") {
							this.updateScreen("Ready");

						// enter number or letter
						} else if (val != "lock" && val != "end") {
							if (!this.isDialing) {
								this.isDialing = true;
								this.updateScreen("");
							}

							let number = this.el.number.value,
								maxLen = this.el.number.maxLength;

							if (number.length < maxLen) {
								clearTimeout(this.cycleTimer);

								// type character of different group
								if (val != this.charGroup || val.length == 1) {
									this.charGroup = val;
									this.isCycling = false;
									this.cycleOption = 0;
								}

								// start the new cycle or loop though the current
								if (!this.isCycling) {
									this.isCycling = true;

								} else {
									number = number.split("");
									number.pop();
									number = number.join("");
								}

								number += val[this.cycleOption];

								// next option
								++this.cycleOption;

								if (this.cycleOption >= val.length)
									this.cycleOption = 0;

								// delay for typing the next number or letter
								this.cycleTimer = setTimeout(() => {
									this.isCycling = false;
									this.cycleOption = 0;
								},500);

								this.updateScreen(number);
							}
						}

					} else if (val == "end") {
						if (this.isCalling) {
							this.updateScreen("Call Ended");

							this.callEndTimer = setTimeout(() => {
								this.isCalling = false;
								this.updateScreen("Ready");
							},2e3);
						}
					}

				} else {
					this.isCalling = false;
					this.charGroup = "";
					this.lock = false;
					this.memory = "";
					this.power = false;
					this.updateScreen("");
				}
			}
		}
	}
	kbdInput(e) {
		let c = e.code,
			r = "";

		switch (c) {
			// 1
			case "Digit1":
			case "Numpad1":
				r = "1";
				break;
			// 2
			case "Digit2":
			case "Numpad2":
				r = "2abc";
				break;
			// 3
			case "Digit3":
			case "Numpad3":
				r = "3def";
				break;
			// 4
			case "Digit4":
			case "Numpad4":
				r = "4ghi";
				break;
			// 5
			case "Digit5":
			case "Numpad5":
				r = "5jkl";
				break;
			// 6
			case "Digit6":
			case "Numpad6":
				r = "6mno";
				break;
			// 7
			case "Digit7":
			case "Numpad7":
				r = "7pqrs";
				break;
			// 8
			case "Digit8":
			case "Numpad8":
				r = "8tuv";
				break;
			// 9
			case "Digit9":
			case "Numpad9":
				r = "9wxy";
				break;
			// 0
			case "Digit0":
			case "Numpad0":
				r = "0opr";
				break;
			// memory (RCL)
			case "KeyR":
				r = "rcl";
				break;
			// clear
			case "KeyC":
			case "NumLock":
				r = "clr";
				break;
			// send
			case "Enter":
			case "NumpadEnter":
				r = "snd";
				break;
			// memory (STO)
			case "KeyS":
				r = "sto";
				break;
			// lock
			case "KeyL":
				r = "lock";
				break;
			// end
			case "Escape":
			case "KeyE":
				r = "end";
				break;
			// power
			case "KeyP":
				r = "pwr";
				break;
			// nothing
			default:
				break;
		}

		this.buttonAction({ value: r });
	}
	toggleLock() {
		this.lock = !this.lock;

		let lock = this.el.querySelector(".phone__lock");

		if (lock)
			lock.textContent = this.lock ? "Lock" : "";
	}
	togglePower() {
		this.power = !this.power;
		this.lock = false;

		let lock = this.el.querySelector(".phone__lock"),
			battery = this.el.querySelector(".phone__battery"),
			hideClass = "phone__hide";

		if (lock) {
			lock.textContent = "";

			if (this.power) {
				lock.classList.remove(hideClass);
				battery.classList.remove(hideClass);
				
			} else {
				lock.classList.add(hideClass);
				battery.classList.add(hideClass);
			}
		}
	}
	updateScreen(input) {
		this.el.number.value = input;
	}
}
