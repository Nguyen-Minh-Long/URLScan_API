window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

const API_KEY = [
    "aa7b7d3581c95394318a9b314b0d85e53a2249b68747a626aa20d84f676f68a9",
    "ab1afa16f1c5f34340fc114bb7365f95c98f469110e5d187622a22805862687c",
    "1f6e57636fb97765c4af1c83d80df2ef5a9dec0c53319a0d5c66fd9e6ec78748",
    "e110c829aca0133b88d9e7e535a59b0a67d9344fa05f9340c783fba6eb1cfb02",
    "550484f48b1fdf5a9934de6b629ba77c123f32b57694ab3cbd2b70b1607dc716",
    "4f3d31f53a2f293d50fa2e671920839d6268e425bc20f930a0a7a50f4da9f44b",
    "395876380f824ec69d2cc8e66b60d6ab04dbdd7772f1b26983b344dbdcd7fc87",
    "96a52e4a835caeb3f4b37d110814cf6e353da8c0fa2c22846593c45b8d0c3106",
    "37fc3d62bb3b52c8be2bbfb60631981fb2f97f90d3e7e55d1b4e9d06152e9f73",
    "1c01f663eeff6f50e63746bbb9bd591d5bb91b7994319ad088c6abe406519644"
]

function domain_from_url(url) {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
    }
    return result
}

function Scan_URL() {
    
    const button = document.getElementById('btnSearch')
    button.classList.add("fas", "fa-cog", "fa-spin")

    const URL = document.getElementById("URLinput").value

    domain_name = domain_from_url(URL)

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-apikey': API_KEY[Math.floor(Math.random() * API_KEY.length)]
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
            const status = ["clean", "unrated", "malicious", "malware", "phishing", "suspicious",]

            for (var index in engine) {
                //Get number of type
                for (let count = 0; count < arraytype.length; count++) {
                    //push type name and quantity of that type
                    if (temp[engine[index]].result == arraytype[count].name) {
                        percent.set(arraytype[count].name, arraytype[count].value++)
                    }
                }
            }

            document.getElementById("URLshow").value = URL

            for (let count = 0; count < status.length; count++) {
                document.getElementById(status[count]).innerHTML = "0%"
            }

            for (let count = 0; count < arraytype.length; count++) {
                console.log(URL, arraytype[count].name + " = " + (percent.get(arraytype[count].name) / engine.length * 100).toFixed(2) + "%")
                document.getElementById(arraytype[count].name).innerHTML = (percent.get(arraytype[count].name) / engine.length * 100).toFixed(2) + "%"
            }
            document.getElementById('btnSearch').classList.remove("fas", "fa-cog", "fa-spin")
        })
        .catch(err => console.error(err));

}

// google.charts.load('current', { 'packages': ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);

// // Draw the chart and set the chart values
// function drawChart() {

//     var data = google.visualization.arrayToDataTable([
//         ["Status", "Percent"],
//         ["Clean", 79.78],
//         ["Unrated", 20.22]
//     ]);

//     // Optional; add a title and set the width and height of the chart
//     var options = { 'title': 'Evaluate URL', 'width': 600, 'height': 400 };

//     // Display the chart inside the <div> element with id="piechart"
//     var chart = new google.visualization.PieChart(document.getElementById('piechart'));
//     chart.draw(data, options);
// }