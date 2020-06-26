# OnlineKeyboard
The new version of Transcription.

# Plan (paste from text file)
```KO store the string when entering construction mode. Spaces end construction mode, as do overflows. Enter in construction ends with hanja if found. Spaces in normal mode are just spaces. With invalid characters, either overflow (if possible) or intercept the character.

Also keep track of carat position when entering a sequence so you place it in the right place. Do this escaped sequence for kanji and hanja. Space just returns what you've got while Enter attempts to convert it to kanji/hanja. Not sure what Enter normally does then.

Actually, Enter is how you start a kanji interpreted sequence. Space would list possible selections (selectable by number), or just go ahead if there's no conflict. Enter plugs that sequence back into the main text box.

For Korean, as describes above, Space ends and Enter has Hanja (with a selection if needed). Enter normally toggles whether the IME is brought up, which can be toggled off to spam keks.

Copy exits the keyboard, Clear selects the keyboard, detect backspace for mobile.

Fullwidth commons JSON. Arbitrary number of JSON configs.

Quotes are determined based on whether the previous character is blank or a space.

The kanji replaces at every chance, but has two bars (input output), like Transcription. That's how you'll deal with conjugation and different matching. The original should somehow be kept, as with conjugations, even if it updates live. Maybe show a public face while appending the pure output. Kanji with more specificity rises to the top. [kawaranai] --> [変waranai] --> [変わらない]. So what about inconsistent spelling like chi/ci? Maybe revert backwards for consistency? [cuugoku] --> [ちゅうごく] --> [chuugoku] --> [中国]. But actually, conjugation is a specific issue, not a general one, so just analyse the r groups for example. [かわらない]

Just repeat all five possibilities with kawar. And repeat the more specific Kanji method, ie displaying the result while storing the internal string.```