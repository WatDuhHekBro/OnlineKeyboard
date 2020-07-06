"use strict";

const App = {
	data: {},
	language: "",
	input: document.getElementById("field"),
	list: document.getElementById("list"),
	initialize()
	{
		window.onerror = (error) => {document.body.append(error)};
		const request = new XMLHttpRequest();
		request.onload = () => {
			const languages = JSON.parse(request.responseText);
			this.list.appendChild(document.createElement("option"));
			
			for(const language in languages)
			{
				this.loadConfig(language);
				let e = document.createElement("option");
				e.value = language;
				e.innerText = languages[language];
				this.list.appendChild(e);
			}
		};
		request.open("GET", "config/languages.json");
		request.send();
	},
	// Detect special keys for certain events.
	handleKeys(KeyboardEvent)
	{
		const code = event.key || event.keyCode;
		
		// [Enter] or [Return] is the magic key to do magic stuff.
		if(code === "Enter" || code === 13)
			event.preventDefault();
		else if(event.ctrlKey)
		{
			if(code === "c")
			{
				event.preventDefault();
				this.copy();
			}
			else if(code === "v")
				this.clear();
			else if(code === "Backspace" || code === "Delete")
			{
				event.preventDefault();
				this.clear();
			}
		}
	},
	// Change the text and adjust their cursor to allow for typing anywhere in it.
	/*
	-= Reasoning behind the logic for fixing cursor position =-
	aaaaaa (x)
	aaabaaa (x+1)
	b --> ee
	aaaeeaaa (x+2)
	y = x + (replace - input)
	*/
	handleText(HTMLInputElement)
	{
		if(!this.language)
			return;
		
		let list = this.data[this.language];
		
		if(this.language === "korean")
			list = list.replace;
		
		for(const token in list)
		{
			if(HTMLInputElement.value.includes(token))
			{
				const replacer = list[token];
				const oldPosition = HTMLInputElement.selectionStart;
				const newPosition = oldPosition + (replacer.length - token.length);
				HTMLInputElement.value = HTMLInputElement.value.split(token).join(replacer);
				HTMLInputElement.setSelectionRange(newPosition, newPosition); // These two arguments are the same because they'll set the cursor without selecting any text.
			}
		}
	},
	setLanguage(language)
	{
		this.language = language;
	},
	copy()
	{
		this.input.select();
		this.input.setSelectionRange(0, 99999);
		document.execCommand("copy");
		this.input.blur();
	},
	clear()
	{
		this.input.value = "";
		this.input.focus();
	},
	loadConfig(target)
	{
		const request = new XMLHttpRequest();
		request.onload = () => {this.data[target] = JSON.parse(request.responseText)};
		request.open("GET", `config/${target}.json`);
		request.send();
	}
};

App.initialize();