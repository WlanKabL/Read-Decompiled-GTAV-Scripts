//Script decompiler: https://github.com/njames93/GTA-V-Script-Decompiler
var fs = require('fs')
var Lazy = require('lazy');
//onst readline = require('readline');

var source = "freemode.ysc.c";//Your decompiled ysc.c
var target = "remoteids.txt";

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(source)
});

var TheRemoteIDHashes = [];
var linecounter = 0;
var foundids = 0;
var begin = 0;//Line to start search
var end = 0;//Line to end search

function findid(currentline, ammountoftabs) {
    spaces = ammountoftabs * 4;
    var beginparse = false;
    currentlinelenght = currentline.lenght
    currentlinelenght = currentlinelenght - 1

    currentremote = currentline.substr(spaces + 5, currentline.lenght)

    var hashlenght = 0;
    correcthash = "";

    for (var x = 0; x <= currentremote.length - 1; x++) {
        if (currentremote[x] != ":") {
            hashlenght++;
            correcthash += currentremote[x]
        } else {
            correcthash = correcthash
        }
    }

    if (Number(correcthash) == NaN || Number(correcthash).toString() == "NaN") {
        //console.log("Not a Number!")
        return;
    } else {
        correcthash = correcthash.toString()
        var adouble = false;
        if (hashlenght >= 6 && hashlenght <= 15) {
            for (var x = 0; x < foundids + 1; x++) {
                if (correcthash == TheRemoteIDHashes[x]) {
                    adouble = true;
                }
            }
            if (!adouble) {
                TheRemoteIDHashes.push(correcthash)
                foundids++;
            }

        }
    }


}

var foundsearch = false
lineReader.on('line', function (line) {

    if (linecounter >= begin && linecounter <= end) {
        if (line.substr(0, 5) == "case ") {
            findid(line, 0)
        } else if (line.substr(0, 9) == "    case ") {
            findid(line, 1)
        } else if (line.substr(0, 13) == "        case ") {
            findid(line, 2)
        } else if (line.substr(0, 17) == "            case ") {
            findid(line, 3)
        } else if (line.substr(0, 21) == "                case ") {
            findid(line, 4)
        }
        if (!foundsearch) {
            foundsearch = true
        }

    } else {
        //console.log("NICHT im searchbereich")
    }
    linecounter++;


});

forcpp = () => {
    var theoutput = 'int remotes[] = {';
    for (var x = 0; x < TheRemoteIDHashes.length; x++) {
        if (x == TheRemoteIDHashes.length - 1) {
            theoutput = theoutput + TheRemoteIDHashes[x].toString()
        } else {
            theoutput = theoutput + TheRemoteIDHashes[x].toString()
            theoutput += ', '
        }
    }
    theoutput += '};'
    return theoutput
}

lineReader.on("close", function () {
    console.log("File searched: " + source)
    if (foundsearch) {
        console.log("Searched Lines: " + linecounter)
        console.log("Searched between: " + begin + " and " + end)
        console.log("Found RemoteHashID's: " + foundids)
    } else {
        console.log("ERROR: Searchrequest not found!")
    }

    var forfile = forcpp();
    fs.writeFile(target, forfile, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
})