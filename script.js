window.onerror = (error) => {document.body.append(error)};
let input = document.getElementById('field');
let setting = document.getElementById('mode');
let enter = false;
let language = '';
let primary = {};
let secondary = {};
let data = {};
let langs = {
	japanese: 'kanji',
	korean: 'hanja'
};
let append = '';
let special = false;
const equals = function(c) {return value => value === c};

for(let lang in langs)
{
	loadConfig(lang);
	
	if(langs[lang])
		loadConfig(langs[lang]);
}

function handleText()
{
	let code = event.key || event.keyCode;
	
	// [Enter] or [Return] is the magic key to do magic stuff.
	if(code === 'Enter' || code === 13)
	{
		event.preventDefault();
		
		if(language === 'korean')
		{
			if(special)
				changeText({enter: input.value.length >= 2 && input.value.indexOf('y') === -1 && input.value.indexOf('w') === -1});
			/*else
			{
				enter = !enter;
				setting.className = enter ? 'activated' : 'deactivated';
			}*/
		}
		else if(language === 'japanese')
		{
			/*let str = input.value;
			
			for(let before in secondary)
				str = str.split("'" + before).join(secondary[before]);
			
			input.value = str.split("'").join('');*/
			
			if(enter)
			{
				input.value = append + replaceText(input.value, secondary, true);
				enter = false;
			}
			else
			{
				append = input.value;
				input.value = '';
				enter = true;
			}
		}
		else
			input.value = replaceText(input.value, secondary);
	}
	else if(code === ' ' || code === 32)
	{
		if(language === 'korean' && special)
		{
			event.preventDefault();
			changeText({space: input.value.length >= 2 && input.value.indexOf('y') === -1 && input.value.indexOf('w') === -1});
		}
	}
	else if(event.ctrlKey)
	{
		if(code === 'c')
		{
			event.preventDefault();
			copyText();
		}
		else if(code === 'v')
			clearText();
		else if(code === 'Backspace' || code === 'Delete')
		{
			event.preventDefault();
			clearText();
		}
	}
	// if it's alphabetic
	else if(event.keyCode >= 65 && event.keyCode <= 90)
	{
		if(language === 'korean' && !special)
		{
			special = true;
			append = input.value;
			input.value = '';
		}
	}
}

// cursor issues
function handlePosition()
{
	//console.log(event.target.selectionStart);
}

function changeText(settings)
{
	if(language === 'korean')
	{
		if(input.value === 'ㅇ')
		{
			input.value = append;
			special = false;
		}
		else if(special)
		{
			input.value = replaceText(input.value, primary.replace);
			let str = input.value;
			let initialChar = primary.initial.findIndex(equals(str[0]));
			let medialChar = primary.medial.findIndex(equals(str[1]));
			let finalChar = primary.final.findIndex(equals(str[2]));
			
			if(settings && settings.enter)
			{
				append += replaceText(String.fromCharCode((588*initialChar + 28*medialChar + Math.max(finalChar, 0)) + 44032), secondary);
				input.value = append;
				special = false;
			}
			else
			{
				if(str.length > 3 || (settings && settings.space))
				{
					append += String.fromCharCode((588*initialChar + 28*medialChar + Math.max(finalChar, 0)) + 44032);
					str = str.substring(3);
				}
				
				if(str.length > 0)
				{
					// Update the indices.
					initialChar = primary.initial.findIndex(equals(str[0]));
					medialChar = primary.medial.findIndex(equals(str[1]));
					finalChar = primary.final.findIndex(equals(str[2]));
					
					if(primary.medial.findIndex(equals(str[0])) !== -1)
						input.value = '\u3147' + str;
					else if(initialChar === -1 && str[0] !== 'y' && str[0] !== 'w')
						input.value = '';
					else if(medialChar === -1 && str[1] !== 'y' && str[1] !== 'w')
						input.value = str.substring(0,1);
					else if(finalChar === -1)
						input.value = str.substring(0,2);
				}
				else
				{
					input.value = append;
					special = false;
				}
			}
		}
	}
	else
		input.value = replaceText(input.value, primary);
	
	//if(enter)
	//	input.value = replaceText(input.value, secondary);
	console.log(append);
}

function replaceText(original, instructions, breakIfFound = false)
{
	for(let before in instructions)
	{
		let split = original.split(before);
		original = split.join(instructions[before]);
		
		if(breakIfFound && split.length > 1)
			return original;
	}
	
	return original;
}

function copyText()
{
	input.select();
	input.setSelectionRange(0, 99999);
	document.execCommand('copy');
	input.blur();
}

function clearText()
{
	input.value = '';
	input.focus();
}

function loadConfig(target)
{
	let request = new XMLHttpRequest();
	request.onload = function() {data[target] = JSON.parse(this.responseText)};
	request.open('GET', 'config/' + target + '.json');
	request.send();
}

function switchLanguage(lang)
{
	primary = data[lang];
	secondary = data[langs[lang]] || {};
	language = lang;
	clearText();
	//setting.style.display = language === 'korean' ? '' : 'none';
}