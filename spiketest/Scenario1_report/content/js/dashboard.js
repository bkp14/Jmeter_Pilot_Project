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

    var data = {"OkPercent": 97.98657718120805, "KoPercent": 2.0134228187919465};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05808080808080808, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Assign_Leave"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "Launch"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/api/v2/leave/employees/leave-requests-208"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/assignLeave-192"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 298, 6, 2.0134228187919465, 5969.647651006715, 0, 19075, 5391.0, 10819.300000000008, 13086.850000000006, 17601.92, 1.0931206761208154, 2.875116006514706, 1.0598024759825249], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Assign_Leave", 24, 4, 16.666666666666668, 11612.708333333334, 5123, 19118, 11046.5, 16145.0, 18417.5, 19118.0, 0.11063272700452673, 0.4608436494509851, 0.20909297297795643], "isController": true}, {"data": ["/web/index.php/auth/login-7", 25, 0, 0.0, 4824.6, 2668, 9596, 4625.0, 7415.800000000003, 9162.8, 9596.0, 0.10310383793726338, 0.23568892953471302, 0.07108526326533979], "isController": false}, {"data": ["Leave", 24, 0, 0.0, 14516.041666666668, 8971, 18908, 14451.5, 18519.0, 18831.5, 18908.0, 0.10493638231821957, 0.8502938355340824, 0.26152114030868784], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 25, 0, 0.0, 5050.76, 2762, 8159, 4683.0, 7227.6, 7883.9, 8159.0, 0.10299934080421885, 0.2828176821543342, 0.08720744968482201], "isController": false}, {"data": ["Login", 25, 0, 0.0, 18295.0, 12630, 25496, 18543.0, 24833.600000000002, 25416.8, 25496.0, 0.09699471572788713, 0.6891398775344719, 0.28345947900258395], "isController": true}, {"data": ["Launch", 25, 0, 0.0, 4824.6, 2668, 9596, 4625.0, 7415.800000000003, 9162.8, 9596.0, 0.10315020733191674, 0.23579492707280342, 0.0711172327893879], "isController": true}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 27, 4, 14.814814814814815, 5730.851851851853, 338, 8321, 6197.0, 7868.6, 8160.199999999999, 8321.0, 0.1273578898212744, 0.13607320838109255, 0.11976653412012207], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 25, 0, 0.0, 8492.84, 2458, 14104, 8770.0, 11639.400000000001, 13502.499999999998, 14104.0, 0.10206414527402181, 0.16465817186785553, 0.11547601186393625], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 25, 0, 0.0, 4750.48, 1693, 7812, 4857.0, 6882.6, 7563.599999999999, 7812.0, 0.10302395925196363, 0.28288527998821406, 0.09728922714516487], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 25, 1, 4.0, 9526.88, 4626, 13772, 9426.0, 13174.800000000001, 13696.7, 13772.0, 0.10358615260312003, 0.5026841761793284, 0.16873213138867596], "isController": false}, {"data": ["Debug Sampler", 23, 0, 0.0, 0.21739130434782608, 0, 3, 0.0, 1.0, 2.5999999999999943, 3.0, 0.11866313084931847, 0.09649440735505041, 0.0], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 25, 0, 0.0, 13244.240000000002, 8941, 19075, 12230.0, 17754.8, 18749.5, 19075.0, 0.09970646416948503, 0.4346306037525525, 0.20696491404305725], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 24, 0, 0.0, 4784.958333333332, 2081, 6743, 4843.0, 6465.5, 6718.25, 6743.0, 0.10986194016186326, 0.36039955557412023, 0.09119399329842165], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 25, 0, 0.0, 4001.96, 1731, 7488, 3560.0, 6398.400000000001, 7219.799999999999, 7488.0, 0.1041163437671792, 0.16054658868005464, 0.08662805165003581], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 25, 1, 4.0, 5524.48, 1228, 8296, 5599.0, 7723.200000000001, 8163.4, 8296.0, 0.10591155961126221, 0.35065414288952157, 0.08439827406522457], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192", 24, 0, 0.0, 5165.5, 2059, 8484, 4986.0, 8025.0, 8462.25, 8484.0, 0.1113146726652907, 0.32988567055495005, 0.09261728624104265], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 3, 50.0, 1.0067114093959733], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 50.0, 1.0067114093959733], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 298, 6, "400/Bad Request", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 27, 4, "400/Bad Request", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 25, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 25, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
