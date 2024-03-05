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
    // "aa7b7d3581c95394318a9b314b0d85e53a2249b68747a626aa20d84f676f68a9",
    // "ab1afa16f1c5f34340fc114bb7365f95c98f469110e5d187622a22805862687c",
    // "1f6e57636fb97765c4af1c83d80df2ef5a9dec0c53319a0d5c66fd9e6ec78748",
    // "e110c829aca0133b88d9e7e535a59b0a67d9344fa05f9340c783fba6eb1cfb02",
    // "550484f48b1fdf5a9934de6b629ba77c123f32b57694ab3cbd2b70b1607dc716",
    // "4f3d31f53a2f293d50fa2e671920839d6268e425bc20f930a0a7a50f4da9f44b",
    // "395876380f824ec69d2cc8e66b60d6ab04dbdd7772f1b26983b344dbdcd7fc87",
    // "96a52e4a835caeb3f4b37d110814cf6e353da8c0fa2c22846593c45b8d0c3106",
    // "37fc3d62bb3b52c8be2bbfb60631981fb2f97f90d3e7e55d1b4e9d06152e9f73",
    // "1c01f663eeff6f50e63746bbb9bd591d5bb91b7994319ad088c6abe406519644"

    "697ed8c8b39ac9313d3ab811c53fe80583f1b2cc0d79d0a0bc51df52b8ab74d2",
    "0ba1162dc29c16e0e99c3eb7d1c336f27fa34a46db4d4d13b9765a7dcc6a58d5",
    "ae77719a085cc34e7fe20e20e7e23f3734592f1e9d3d8e8f229d03186e0f617d",
    "404f55b932eff70c7b94bff1729829696e39bbc71124f019271b91dabf303f23",
    "404fc1b6594a256f837e9220ec713e03e4af8bdcb0b54f0921d29deed6eefddb",
    "5a276a5031e26b3ed827ef8c324bd93bb130a0824e9e8882dc723786d82fd682",
    "49abb96fc539e88343a4e52044b48a10cb8686f54e11decaebb70aefd65e9f1a",
    "f6af1739e053aec6fbc02d386bd8a5e6b25e41c96bf443d972451f643dd3665b",

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
            // 'x-apikey': "49abb96fc539e88343a4e52044b48a10cb8686f54e11decaebb70aefd65e9f1a"
        }
    };

    //Scan Domain
    fetch('https://www.virustotal.com/api/v3/domains/' + domain_name, options)
        .then(response => response.json())
        .then(response => {
            const Engine_Result = response.data.attributes.last_analysis_results

            const Engine_Result_Value = new Array();
        
            //Get all result in JSON Response Ex:['clean','clean','malware']
            for (let Engine in Engine_Result) {
                Engine_Result_Value.push(Engine_Result[Engine].result)
            }
        
            //Amount of each result Ex:{ clean: 80, unrated: 11, malware: 2, malicious: 1 }
            const occurrences = Engine_Result_Value.sort().reduce(function (acc, curr) {
                return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
            }, {});
        
            console.log(occurrences)
            //Prepare possible results
            const results = ["clean", "malicious", "malware", "phishing", "suspicious", "unrated"]
        
            const chart_point = new Array()
            //JS --> HTML 
            for (let index in results) {
                Object.keys(occurrences).includes(results[index]) ?
                    (document.getElementById(results[index]).innerHTML = (100 * occurrences[results[index]] / Engine_Result_Value.length).toFixed(2) + "%",
                        chart_point.push({ "y": occurrences[results[index]], "name": results[index] })) :
                    document.getElementById(results[index]).innerHTML = '0%'
            }
        
            document.getElementById("URLshow").value = URL
        
            document.getElementById('btnSearch').classList.remove("fas", "fa-cog", "fa-spin")
        
            drawChart(chart_point)
        })
        .catch(err => console.error(err));

}

function drawChart(chart_point) {

    var sample_data = [
        { y: 61, name: "clean" },
        { y: 1, name: "malicious" },
        { y: 2, name: "malware" },
        { y: 3, name: "phishing" },
        { y: 23, name: "unrated" },
    ]

    chart_point !== undefined ? sample_data = chart_point : sample_data

    var chart = new CanvasJS.Chart("chartContainer", {
        theme: "dark2",
        exportFileName: "Doughnut Chart",
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "URL Scan Result"
        },
        legend: {
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            type: "doughnut",
            innerRadius: 90,
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
            indexLabel: "{name} - #percent%",
            dataPoints: 
                sample_data
        }]
    });
    chart.render();
}
function explodePie(e) {
    if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
        e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
}