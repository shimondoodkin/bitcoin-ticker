//a correct reverse chars

var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uDC00-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])([\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
	var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

	var reverse = function(string) {
		// Step 1: deal with combining marks and astral symbols (surrogate pairs)
		string = string
			// Swap symbols with their combining marks so the combining marks go first
			.replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
				// Reverse the combining marks so they will end up in the same order
				// later on (after another round of reversing)
				return reverse($2) + $1;
			})
			// Swap high and low surrogates so the low surrogates go first
			.replace(regexSurrogatePair, '$2$1');
		// Step 2: reverse the code units in the string
		var result = '';
		var index = string.length;
		while (index--) {
			result += string.charAt(index);
		}
		return result;
	};

var nonRtlChars = /[^\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]+/g;
var weakChars = /[\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u02B9-\u02FF\u2000-\u2BFF\u2010-\u2029\u202C\u202F-\u2BFF]/g;
var RTLweakChars = /([\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC][\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC ]*)([\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u02B9-\u02FF\u2000-\u2BFF\u2010-\u2029\u202C\u202F-\u2BFF0-9.\- ]+)([\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC ]+)/g;
var numberChars = /-?[0-9.]+/g;
var numberChars2 = /[%$]?[0-9.]+-?/g;
//var numberChars2 = /(-?)([0-9.]+)-?/g;
var swapChars=/[\[\]{}()<>]/g;
var swapCharsDict={'[':']','{':'}','(':')','<':'>',']':'[','}':'{',')':'(','>':'<'};

function revheb(text) {
 var ret= reverse(text)//reverse everything so the positions will be reversed, hebrew will keeped reversed
 .replace(nonRtlChars,reverse) // reverse english and numbers back to original
 .replace(RTLweakChars,function(r0,a,b,c)//find literals of week chars surounded by rtl chars and must start with rtl and end with a space
 {
  return a+( // keep the start
            reverse(b)// reverse the found literal 
            .replace(numberChars2,reverse) // reverse the numbers back keep the minus ath the left
//            .replace(numberChars2,function(r0,a,b){console.log(r0,a,b);return reverse(b)}) // reverse the numbers back keep the minus ath the left
            .replace(swapChars,function(a){return swapCharsDict[a] }) // swap the direction of brackets 
         )+c // keep the end
 })
 return ret;
}
module.exports=revheb;



/*
function FlipText(input_text){
	var len = input_text.length; var nTest = "";
	if (! isHebrew(input_text))
		nTest = input_text;
	else { for ( var i=0 ; i<len ; ++i) {var c = input_text.charAt(i);
			nTest = c + nTest;}	}	return nTest ;}

function isHebrew(input_text){
	var Heb = false;
	var len = input_text.length;
	for ( var i=0 ; i<len ; ++i) {
		var c = input_text.charAt(i);
		if ((c >= 'א') && (c <= 'ת'))
			Heb = true;
		if (Heb)
			break;}
	return Heb;}

function cutEndSpace(line){
	var c = line.charAt(0);
	// if (c == ' ')
	//	return line.substr(1);
	// else
		return line;
}

function StartFlip(val) {
return val;
	var newval="" ;
	var newline="" ;
	var lastLine='';
	var nTest = "";

	var len=val.length;
	for ( var i=0 ; i<len ; ++i) {
		var c=val.charAt(i) ;
		var c0=val.charAt(i+1) ;
		if ( (c=='\r' && c0=='\n')) {
			if ( newval.length==0 )
				newval = FlipText(nTest) + newline;
			else
				if (lastLine.length == 0)
					newval = newval + "\r\n" + FlipText(nTest) + newline;
				else
					newval = newval + "\r\n" + FlipText(nTest) + cutEndSpace(newline);
			lastLine = FlipText(nTest) + newline;
			newline="" ;
			nTest = "";
			++i;
			}
		else {
			if (c != ' ')
				nTest = nTest + c;
			else {
				newline = ' ' + FlipText(nTest) + newline;

				nTest = "";
			}
		}
	}
	if ( newval.length==0 )
		newval = FlipText(nTest) + newline;
	else
		if (lastLine.length == 0)
			newval = newval + "\r\n" + FlipText(nTest) + newline;
		else
			newval = newval + "\r\n" + FlipText(nTest) + cutEndSpace(newline);
 return newval;
}

module.exports=StartFlip;
*/
/*

function invert(word) {
    var len = word.length;
    var newWord = "";
    if (!isHebrew(word)) newWord = word;
    else {
        for (var i = 0; i < len; ++i) {
            var c = word.charAt(i);
            newWord = c + newWord;
        }
    }
    return newWord;
}

function isHebrew(Word) {
    var found = false;
    var len = Word.length;
    for (var i = 0; i < len; ++i) {
        var c = Word.charAt(i);
        if ((c >= 'א') && (c <= 'ת')) found = true;
        if (found) break;
    }
    return found;
}

function cutEndSpace(line) {
    var c = line.charAt(0);
    if (c == ' ') return line.substr(1);
    else return line;
}

function heb1(val) {
    var newval = "";
    var newline = "";
    var lastLine = '';
    var newWord = "";
    var len = val.length;
    for (var i = 0; i < len; ++i) {
        var c = val.charAt(i);
        var c0 = val.charAt(i + 1);
        if ((c == '\r' && c0 == '\n')) {
            if (newval.length == 0) newval = invert(newWord) + newline;
            else if (lastLine.length == 0) newval = newval + "\r\n" + invert(newWord) + newline;
            else newval = newval + "\r\n" + invert(newWord) + cutEndSpace(newline);
            lastLine = invert(newWord) + newline;
            newline = "";
            newWord = "";
            ++i;
        } else {
            if (c != ' ') newWord = newWord + c;
            else {
                newline = ' ' + invert(newWord) + newline;
                newWord = "";
            }
        }
    }
    if (newval.length == 0) newval = invert(newWord) + newline;
    else if (lastLine.length == 0) newval = newval + "\r\n" + invert(newWord) + newline;
    else newval = newval + "\r\n" + invert(newWord) + cutEndSpace(newline);
    return  newval;
}
module.exports=heb1;

*/

