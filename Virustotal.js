function domain_from_url(url) {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        // if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
        //     result = match[1]
        // }
    }
    return result
}

domain_name = domain_from_url("https://u.to/8ShmIA")

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'x-apikey': 'a8e2b4e7207642d1b5679337b8139d5a746c4ac8602d6ad6a966fa0da6a041cb'
    }
};

//Scan Domain
fetch('https://www.virustotal.com/api/v3/domains/' + domain_name, options)
    .then(response => response.json())
    .then(response => {
        const temp = response.data.attributes.last_analysis_results

        var engine = [];
        for (var k in temp) engine.push(k);

        //Get all type
        const type = new Map();
        for (var k in engine) type.set(temp[engine[k]].result, 1);

        //Convert Map to Array
        let arraytype = Array.from(type, ([name, value]) => ({ name, value }));

        //Get result for each engine
        const percent = new Map();
        for (var index in engine) {
            //Get number of type
            for (let count = 0; count < arraytype.length; count++) {
                //push type name and quantity of that type
                if (temp[engine[index]].result == arraytype[count].name) {
                    percent.set(arraytype[count].name, arraytype[count].value++)
                }
            }
        }
        for (let count = 0; count < arraytype.length; count++) {
            console.log(arraytype[count].name + " = " + (percent.get(arraytype[count].name) / engine.length * 100).toFixed(2) + "%")
            // }
        }})
    .catch(err => console.error(err));

