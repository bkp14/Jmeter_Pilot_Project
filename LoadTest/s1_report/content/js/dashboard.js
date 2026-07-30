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

    var data = {"OkPercent": 97.4074074074074, "KoPercent": 2.5925925925925926};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14595375722543352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02631578947368421, 500, 1500, "Assign_Leave"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/web/index.php/dashboard/index-35-0"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/web/index.php/dashboard/index-35-1"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "/web/index.php/leave/assignLeave-192-1"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.15789473684210525, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "Launch"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "/web/index.php/leave/assignLeave-192-0"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "/web/index.php/api/v2/leave/employees/leave-requests-208"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.07894736842105263, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/web/index.php/leave/viewLeaveList-181-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.18421052631578946, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "/web/index.php/leave/viewLeaveList-181-0"], "isController": false}, {"data": [0.07894736842105263, 500, 1500, "/web/index.php/leave/assignLeave-192"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 270, 7, 2.5925925925925926, 2956.3111111111093, 0, 13942, 2372.0, 6020.6, 7761.549999999998, 12630.740000000018, 1.2947342677798184, 3.154575462028321, 1.3116115185794368], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Assign_Leave", 19, 7, 36.8421052631579, 4921.263157894737, 1316, 7577, 5409.0, 7171.0, 7577.0, 7577.0, 0.10781609978096308, 0.4325278690431605, 0.22777370216369888], "isController": true}, {"data": ["/web/index.php/auth/login-7", 19, 0, 0.0, 8346.0, 1645, 13942, 7984.0, 13274.0, 13942.0, 13942.0, 0.1044811411540217, 0.23311710205057987, 0.07203484927220637], "isController": false}, {"data": ["/web/index.php/dashboard/index-35-0", 7, 0, 0.0, 2056.8571428571427, 714, 3865, 1694.0, 3865.0, 3865.0, 3865.0, 0.04059689027820469, 0.06081604461598242, 0.034372562374222135], "isController": false}, {"data": ["/web/index.php/dashboard/index-35-1", 7, 0, 0.0, 2061.714285714286, 763, 3175, 2587.0, 3175.0, 3175.0, 3175.0, 0.040663866668990314, 0.08697801391866065, 0.034230715887372705], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192-1", 7, 0, 0.0, 1586.0, 512, 2666, 1637.0, 2666.0, 2666.0, 2666.0, 0.041204101573996676, 0.0881163048308866, 0.03400143147463593], "isController": false}, {"data": ["Leave", 19, 0, 0.0, 6665.631578947368, 2054, 12865, 7258.0, 9147.0, 12865.0, 12865.0, 0.10894308010756695, 0.8521425143919543, 0.304117833408829], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 19, 0, 0.0, 2918.6315789473683, 482, 6661, 2650.0, 6384.0, 6661.0, 6661.0, 0.10933301108866908, 0.33729368788877956, 0.12647810858206593], "isController": false}, {"data": ["Login", 19, 0, 0.0, 8457.263157894738, 2393, 13510, 8869.0, 13115.0, 13510.0, 13510.0, 0.10724465893376231, 0.7729762421330398, 0.3463513003414896], "isController": true}, {"data": ["Launch", 19, 0, 0.0, 8346.0, 1645, 13942, 7984.0, 13274.0, 13942.0, 13942.0, 0.10477555972206903, 0.23377400532149553, 0.07223783707400463], "isController": true}, {"data": ["/web/index.php/leave/assignLeave-192-0", 7, 0, 0.0, 1843.142857142857, 624, 4008, 1432.0, 4008.0, 4008.0, 4008.0, 0.040935911905917576, 0.061323914905935126, 0.03405995795297049], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 19, 7, 36.8421052631579, 2160.105263157894, 484, 3293, 2335.0, 3223.0, 3293.0, 3293.0, 0.110658124635993, 0.08733892690739663, 0.10806457483983693], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 19, 0, 0.0, 3047.8421052631575, 824, 7561, 3382.0, 4922.0, 7561.0, 7561.0, 0.10905939144859572, 0.17131338000883953, 0.12325796456430772], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 19, 0, 0.0, 2489.0, 507, 5219, 2369.0, 5118.0, 5219.0, 5219.0, 0.10844563163872764, 0.27672698776562044, 0.10221402102132954], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 19, 0, 0.0, 4085.052631578948, 1004, 7699, 4357.0, 6017.0, 7699.0, 7699.0, 0.10832197852944363, 0.4763639393995542, 0.1796922212704458], "isController": false}, {"data": ["Debug Sampler", 19, 0, 0.0, 0.6315789473684211, 0, 5, 0.0, 1.0, 5.0, 5.0, 0.11217182361866303, 0.0908916940454473, 0.0], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-1", 7, 0, 0.0, 1756.0, 462, 3573, 1850.0, 3573.0, 3573.0, 3573.0, 0.04082656292831439, 0.08741714394862853, 0.03353040959249258], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 19, 0, 0.0, 5538.631578947368, 1337, 11105, 5776.0, 10042.0, 11105.0, 11105.0, 0.10793430777183824, 0.4449682818704448, 0.22371848424727184], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 19, 0, 0.0, 2580.5789473684213, 654, 5166, 2463.0, 4184.0, 5166.0, 5166.0, 0.1071454753593603, 0.3668917485295693, 0.1213592126076389], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 19, 0, 0.0, 1892.7894736842104, 423, 3244, 2091.0, 2943.0, 3244.0, 3244.0, 0.1089993287936069, 0.16631137307601843, 0.09069084778530576], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 19, 0, 0.0, 2190.6842105263154, 486, 5357, 2044.0, 4094.0, 5357.0, 5357.0, 0.10863474710974397, 0.3119842976334778, 0.08982355966048783], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-0", 7, 0, 0.0, 1552.4285714285713, 465, 2240, 1702.0, 2240.0, 2240.0, 2240.0, 0.04053318509768498, 0.060720611269383544, 0.03364571028616428], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192", 19, 0, 0.0, 2761.1578947368425, 715, 5645, 2552.0, 4750.0, 5645.0, 5645.0, 0.1088500847884871, 0.35076402733855816, 0.12365920148437143], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 7, 100.0, 2.5925925925925926], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 270, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 19, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
