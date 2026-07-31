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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4281970649895178, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.023076923076923078, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.09840425531914894, 500, 1500, "Edit_Entitlement"], "isController": true}, {"data": [0.13989637305699482, 500, 1500, "Leave"], "isController": true}, {"data": [0.6082474226804123, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.5211640211640212, 500, 1500, "/web/index.php/leave/viewLeaveEntitlements-1"], "isController": false}, {"data": [0.023076923076923078, 500, 1500, "Launch"], "isController": true}, {"data": [0.5158730158730159, 500, 1500, "/web/index.php/leave/editLeaveEntitlement/136-8"], "isController": false}, {"data": [0.6262886597938144, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.6524064171122995, 500, 1500, "/web/index.php/api/v2/leave/leave-entitlements/136-21"], "isController": false}, {"data": [0.6443298969072165, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.3160621761658031, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5353260869565217, 500, 1500, "/web/index.php/auth/validate-35-2"], "isController": false}, {"data": [0.35405405405405405, 500, 1500, "/web/index.php/auth/login-7-0"], "isController": false}, {"data": [0.5675675675675675, 500, 1500, "/web/index.php/auth/login-7-1"], "isController": false}, {"data": [0.17010309278350516, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.5520833333333334, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.6735751295336787, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.5854922279792746, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3046, 0, 0.0, 1369.897570584373, 0, 22503, 695.0, 2778.4000000000015, 4874.25, 11164.200000000008, 4.272347420671934, 11.726647894788886, 4.367033125332243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/web/index.php/auth/login-7", 195, 0, 0.0, 2807.9641025641035, 1165, 18861, 1874.0, 4520.4000000000015, 9156.199999999995, 17952.839999999993, 0.2804137468884859, 1.1666689210613732, 0.4019502439060341], "isController": false}, {"data": ["Edit_Entitlement", 188, 0, 0.0, 3384.0638297872347, 1287, 22740, 1774.5, 6780.499999999986, 14272.199999999997, 22537.079999999998, 0.28340270167192516, 2.1886967239665225, 0.7257365643753759], "isController": true}, {"data": ["Leave", 193, 0, 0.0, 3353.145077720207, 1237, 22340, 1743.0, 6986.999999999996, 14047.299999999994, 21663.2, 0.27692762431969786, 2.237891097494307, 0.6889645193655631], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 194, 0, 0.0, 1123.7938144329898, 404, 7794, 575.5, 2246.0, 4852.75, 6578.000000000015, 0.28475601253513577, 0.7810235208099401, 0.24109713170699487], "isController": false}, {"data": ["Login", 194, 0, 0.0, 4094.7422680412374, 1578, 27943, 2321.5, 7888.5, 17143.25, 25760.850000000028, 0.2820652995707955, 2.378807109136008, 1.0479676622675143], "isController": true}, {"data": ["/web/index.php/leave/viewLeaveEntitlements-1", 189, 0, 0.0, 1212.132275132275, 414, 9100, 572.0, 2630.0, 5561.0, 7499.79999999999, 0.28702466285991984, 0.8794164211517433, 0.24161646424340905], "isController": false}, {"data": ["Launch", 195, 0, 0.0, 2807.9641025641035, 1165, 18861, 1874.0, 4520.4000000000015, 9156.199999999995, 17952.839999999993, 0.279941542463543, 1.164704301876039, 0.40127337736191704], "isController": true}, {"data": ["/web/index.php/leave/editLeaveEntitlement/136-8", 189, 0, 0.0, 1228.2962962962965, 417, 10214, 622.0, 2605.0, 4529.0, 8356.399999999989, 0.2844102550211953, 0.9511584404010034, 0.24247085218115577], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 194, 0, 0.0, 920.5360824742269, 359, 5606, 563.5, 1534.5, 3486.5, 5013.200000000007, 0.2885908436373157, 0.43403681690249796, 0.29819911038897284], "isController": false}, {"data": ["/web/index.php/api/v2/leave/leave-entitlements/136-21", 187, 0, 0.0, 1017.7326203208559, 388, 8541, 523.0, 2316.4000000000005, 4280.999999999997, 6350.680000000011, 0.2831540024651054, 0.3742436253441003, 0.24665368183483793], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 194, 0, 0.0, 984.9999999999998, 371, 10035, 543.0, 1712.0, 4173.75, 7826.250000000026, 0.2863595435960264, 0.4539840094395324, 0.2690934423295496], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 193, 0, 0.0, 2197.046632124351, 789, 15771, 1098.0, 4530.4, 9661.5, 15330.140000000001, 0.2781793521736185, 1.3408396228471728, 0.4623645091791979], "isController": false}, {"data": ["Debug Sampler", 185, 0, 0.0, 0.27567567567567575, 0, 7, 0.0, 1.0, 1.0, 2.699999999999932, 0.28295595675821184, 0.10992175742032878, 0.0], "isController": false}, {"data": ["/web/index.php/auth/validate-35-2", 184, 0, 0.0, 1121.3858695652175, 409, 8295, 591.0, 2195.5, 4801.0, 8147.950000000001, 0.2805506721780643, 0.7694893139163808, 0.26493408202752755], "isController": false}, {"data": ["/web/index.php/auth/login-7-0", 185, 0, 0.0, 1704.221621621622, 1028, 7909, 1292.0, 2366.0000000000005, 3902.9999999999986, 7503.079999999994, 0.2798065855882971, 0.4259945966134328, 0.2054829612914057], "isController": false}, {"data": ["/web/index.php/auth/login-7-1", 185, 0, 0.0, 1172.3567567567563, 405, 11778, 585.0, 2490.8, 5329.499999999995, 11599.979999999998, 0.2779388654685749, 0.7623277389372819, 0.20546847769503043], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 194, 0, 0.0, 2970.9484536082473, 1166, 22503, 1648.5, 5150.0, 12626.75, 19577.950000000033, 0.28312612101160667, 1.611200497623346, 0.8121918358247946], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 192, 0, 0.0, 1162.1197916666672, 412, 11963, 576.0, 2601.000000000001, 4914.0499999999965, 6946.579999999964, 0.27568342927212397, 0.9037098782793046, 0.22883878406377475], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 193, 0, 0.0, 1010.357512953368, 374, 8436, 509.0, 2020.1999999999998, 4282.499999999995, 7327.7400000000025, 0.28066562834926434, 0.4327842062143442, 0.2335225735874739], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 193, 0, 0.0, 1185.6735751295332, 410, 10738, 570.0, 2327.7999999999997, 5242.7, 9155.980000000003, 0.278364715469434, 0.9124968674955107, 0.23106446108302622], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3046, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
