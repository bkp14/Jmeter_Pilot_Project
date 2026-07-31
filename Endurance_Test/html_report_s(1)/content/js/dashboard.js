/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 77.10843373493977, "KoPercent": 22.89156626506024};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10235507246376811, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Assign_Leave"], "isController": true}, {"data": [0.0375, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.09090909090909091, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0375, 500, 1500, "Launch"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/api/v2/leave/employees/leave-requests-208"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.078125, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/auth/validate-35-2"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/auth/login-7-0"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "/web/index.php/auth/login-7-1"], "isController": false}, {"data": [0.02564102564102564, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.0625, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}, {"data": [0.0625, 500, 1500, "/web/index.php/leave/assignLeave-192"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 415, 95, 22.89156626506024, 23348.481927710865, 0, 97189, 31039.0, 62361.0, 65632.0, 95949.04, 0.5310708435708436, 1.093494062244062, 0.5194186773776617], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Assign_Leave", 31, 14, 45.16129032258065, 45658.51612903228, 1247, 97613, 62530.0, 66273.6, 79169.59999999996, 97613.0, 0.0453306505387036, 0.14118132863405589, 0.08626875190096275], "isController": true}, {"data": ["/web/index.php/auth/login-7", 40, 13, 32.5, 33867.85, 1101, 73310, 33000.0, 68664.2, 71082.25, 73310.0, 0.05721101998666984, 0.14461146834228208, 0.061461340636558406], "isController": false}, {"data": ["Leave", 32, 15, 46.875, 41131.625, 750, 99207, 31762.5, 98179.0, 99103.65, 99207.0, 0.048702978795940606, 0.24170755687594744, 0.10369002114013674], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 33, 14, 42.42424242424242, 12032.999999999996, 372, 33111, 895.0, 32364.0, 33093.5, 33111.0, 0.04756715617594658, 0.08015133382630205, 0.040274144926314155], "isController": false}, {"data": ["Login", 34, 18, 52.94117647058823, 46644.5, 780, 129205, 34530.5, 113085.0, 128744.5, 129205.0, 0.04872917186205631, 0.23048803116588842, 0.13490797755663334], "isController": true}, {"data": ["Launch", 40, 13, 32.5, 33867.85, 1101, 73310, 33000.0, 68664.2, 71082.25, 73310.0, 0.05727975575912144, 0.14478521076086132, 0.061535182926480005], "isController": true}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 35, 13, 37.142857142857146, 23418.000000000004, 441, 35613, 31490.0, 34177.4, 35480.2, 35613.0, 0.051323109769867176, 0.039347240154761175, 0.05012022438463592], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 26, 0, 0.0, 23737.423076923078, 734, 34312, 31600.0, 33315.3, 34228.0, 34312.0, 0.03637828943686408, 0.0561087018267498, 0.038893780379369594], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 26, 0, 0.0, 23310.423076923078, 504, 33072, 31029.5, 32500.100000000002, 33042.6, 33072.0, 0.03490078110632792, 0.06952365635348584, 0.03285319170999061], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 32, 15, 46.875, 23613.75, 370, 67647, 1397.0, 64235.0, 66454.25, 67647.0, 0.04885734875596976, 0.13317384876055013, 0.06346326270901785], "isController": false}, {"data": ["Debug Sampler", 30, 0, 0.0, 0.5, 0, 5, 0.0, 1.0, 2.799999999999997, 5.0, 0.04739156809220503, 0.027173016939326156, 0.0], "isController": false}, {"data": ["/web/index.php/auth/validate-35-2", 16, 2, 12.5, 26449.3125, 1530, 32494, 31940.5, 32404.4, 32494.0, 32494.0, 0.02336486129304063, 0.056803537293969385, 0.022064278193720987], "isController": false}, {"data": ["/web/index.php/auth/login-7-0", 19, 0, 0.0, 32937.36842105264, 31424, 37935, 32348.0, 37417.0, 37935.0, 37935.0, 0.03146841564808374, 0.04790943358922124, 0.0231096177415615], "isController": false}, {"data": ["/web/index.php/auth/login-7-1", 19, 2, 10.526315789473685, 25880.894736842103, 405, 40960, 31027.0, 35015.0, 40960.0, 40960.0, 0.032028913680391895, 0.07945659681834885, 0.02367762466411784], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 39, 15, 38.46153846153846, 42688.38461538462, 367, 97189, 34047.0, 95970.0, 96823.0, 97189.0, 0.05014439012849821, 0.17232990564818695, 0.10382460263785206], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 32, 11, 34.375, 17517.874999999996, 380, 36481, 30926.0, 34169.0, 36109.85, 36481.0, 0.049030949254499745, 0.10968819476472039, 0.04069951842414529], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 18, 0, 0.0, 21544.61111111111, 413, 33726, 31093.5, 33456.9, 33726.0, 33726.0, 0.033577140682623276, 0.051775688611193506, 0.027937230333588896], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 18, 1, 5.555555555555555, 19898.22222222222, 476, 34817, 30990.0, 32945.0, 34817.0, 34817.0, 0.03176900404172329, 0.09880587704512964, 0.026370755308071092], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192", 32, 9, 28.125, 19598.812500000004, 407, 37046, 31137.0, 34512.4, 35822.7, 37046.0, 0.04900722090770562, 0.10768935978574655, 0.04077553927086444], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 4, 4.2105263157894735, 0.963855421686747], "isController": false}, {"data": ["500/Internal Server Error", 91, 95.78947368421052, 21.927710843373493], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 415, 95, "500/Internal Server Error", 91, "400/Bad Request", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["/web/index.php/auth/login-7", 40, 13, "500/Internal Server Error", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/dashboard/index-35", 33, 14, "500/Internal Server Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 35, 13, "500/Internal Server Error", 9, "400/Bad Request", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 32, 15, "500/Internal Server Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/auth/validate-35-2", 16, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/auth/login-7-1", 19, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 39, 15, "500/Internal Server Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 32, 11, "500/Internal Server Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 18, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192", 32, 9, "500/Internal Server Error", 9, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
