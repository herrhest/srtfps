const Subtitle = require('subtitle')
const fs = require('fs')
var filenameInput = process.argv[2];
var fpsFromInput = process.argv[3];
var fpsToInput = process.argv[4];

if (filenameInput == null) {
    console.log("Enter a valid subtitle to convert.\nExample: $ node srtfps.js <filename> <from fps integer> <to fps integer>")
    return process.exit(22);
}

if (fpsFromInput == '23' && fpsToInput == '25') {
    fpsFromInput = fpsFromInput.toString()
    fpsToInput = fpsToInput.toString()


    fs.readFile(filenameInput, 'utf8', function (err, data) {
        if (err) {
            return console.log(err + "\nEnter a valid subtitle file.");
        }

        //parse the srt to ms
        var subarray = Subtitle.parse(data)

        //speed the shit up  
        subarray.forEach(fpsShift23to25fps)

        //remake the ms to string
        var substring = Subtitle.stringify(subarray)

        //print the string to new file
        fs.writeFile(appendToFilename(filenameInput, "25"), substring, function (err) {
            if (err) return console.log(err);
            console.log("Resynced the file " + filenameInput + " => " + appendToFilename(filenameInput, "25"))

        });

    });


} else if (fpsFromInput == '25' && fpsToInput == '23') {
    console.log("Coming soon...")
} else {
    console.log("Enter the fps you want to convert, ex 23, 25.\nExample: $ node srtfps.js <filename> <from fps integer> <to fps integer>")
}

function fpsShift23to25fps(item, fps) {
    const from23to25fps = 0.959040959040959;
    item.start = (item.start * from23to25fps).toFixed(0)
    item.end = (item.end * from23to25fps).toFixed(0)
}

function appendToFilename(filenameInput, string) {
    var dotIndex = filenameInput.lastIndexOf(".");
    if (dotIndex == -1) return filenameInput + string;
    else return filenameInput.substring(0, dotIndex) + string + filenameInput.substring(dotIndex);
}