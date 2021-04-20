//Script decompiler: https://github.com/njames93/GTA-V-Script-Decompiler
var fs = require('fs');
var Lazy = require('lazy');
//onst readline = require('readline');

var source = "freemode.c";//Your decompiled ysc.c
var target = "remoteids.txt";

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(source)
});

var TheRemoteIDHashes = [];
var linecounter = 0;
var foundids = 0;
var begin = 0;//Line to start search
var end = 1125129;//Line to end search

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

var foundsearch = false;
lineReader.on('line', function (line) {

    if (linecounter >= begin && linecounter <= end) {
        var ShortetLine = "";
        if (line.startsWith("case")) {
            ShortetLine = line.replace("case ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\tcase ")) {
            ShortetLine = line.replace("\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\tcase ")) {
            ShortetLine = line.replace("\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\t\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\t\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\t\t\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\t\t\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        } else if (line.startsWith("\t\t\t\t\t\t\tcase ")) {
            ShortetLine = line.replace("\t\t\t\t\t\t\t\tcase ", "");
            ShortetLine = ShortetLine.replace(":", "");
        }

        if (ShortetLine.length > 5 && ShortetLine.length < 15) {
            if (isNumeric(ShortetLine)) {
                TheRemoteIDHashes.push(ShortetLine);
                foundids++;
                if (!foundsearch) {
                    foundsearch = true;
                }
            }
        }
    }
    linecounter++;
});

forcpp = () => {
    var theoutput = 'int remotes[' + foundids + '] = {';
    for (var x = 0; x < TheRemoteIDHashes.length; x++) {
        if (x == TheRemoteIDHashes.length - 1) {
            theoutput = theoutput + TheRemoteIDHashes[x].toString();
        } else {
            theoutput = theoutput + TheRemoteIDHashes[x].toString();
            theoutput += ', ';
        }
    }
    theoutput += '};';
    return theoutput;
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
    fs.writeFile(target, forfile, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
})