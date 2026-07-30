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

    var data = {"OkPercent": 99.68553459119497, "KoPercent": 0.31446540880503143};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12620192307692307, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Edit_Entitlement"], "isController": true}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.16, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.0625, 500, 1500, "/web/index.php/leave/viewLeaveEntitlements-1"], "isController": false}, {"data": [0.06, 500, 1500, "Launch"], "isController": true}, {"data": [0.10416666666666667, 500, 1500, "/web/index.php/leave/editLeaveEntitlement/136-8"], "isController": false}, {"data": [0.02, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "/web/index.php/api/v2/leave/leave-entitlements/136-21"], "isController": false}, {"data": [0.14, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.02, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.125, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 318, 1, 0.31446540880503143, 2568.4308176100617, 0, 9434, 2265.0, 4616.000000000004, 6093.550000000002, 8522.66, 1.0877149776300128, 2.9476183360355184, 1.0380945288022139], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/web/index.php/auth/login-7", 25, 0, 0.0, 2379.9600000000005, 1147, 5258, 2265.0, 3652.0000000000005, 4804.0999999999985, 5258.0, 0.08849620174302118, 0.2026632157572797, 0.06101398284235641], "isController": false}, {"data": ["Edit_Entitlement", 24, 0, 0.0, 7121.958333333334, 2798, 11193, 6891.5, 10498.0, 11042.0, 11193.0, 0.10395505676379245, 0.8048776105172197, 0.26668938878758086], "isController": true}, {"data": ["Leave", 24, 0, 0.0, 6189.083333333332, 2946, 10431, 5855.0, 9467.5, 10291.75, 10431.0, 0.10187968009780449, 0.8264126785016895, 0.2539032652437471], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 25, 0, 0.0, 2209.68, 422, 6429, 1857.0, 3975.6000000000013, 5792.699999999999, 6429.0, 0.09254563425224979, 0.2544643435553071, 0.07835650868818414], "isController": false}, {"data": ["Login", 25, 0, 0.0, 7931.640000000001, 1687, 13271, 8091.0, 11940.800000000003, 13049.599999999999, 13271.0, 0.08871477136429123, 0.6309838113285214, 0.2593139697819746], "isController": true}, {"data": ["/web/index.php/leave/viewLeaveEntitlements-1", 24, 0, 0.0, 2560.125, 1004, 4751, 2500.0, 4083.5, 4586.25, 4751.0, 0.10296982126155192, 0.3161034409618239, 0.08667967375728297], "isController": false}, {"data": ["Launch", 25, 0, 0.0, 2379.9600000000005, 1147, 5258, 2265.0, 3652.0000000000005, 4804.0999999999985, 5258.0, 0.08872988493508523, 0.20319836852360568, 0.06117509644938492], "isController": true}, {"data": ["/web/index.php/leave/editLeaveEntitlement/136-8", 24, 0, 0.0, 2375.875, 761, 4444, 2424.0, 3834.0, 4307.75, 4444.0, 0.10366140728998847, 0.3473517614880595, 0.08837539898843744], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 25, 0, 0.0, 3365.2, 803, 5718, 3551.0, 5130.6, 5556.0, 5718.0, 0.0889167099394655, 0.14344766095702835, 0.10065302098967856], "isController": false}, {"data": ["/web/index.php/api/v2/leave/leave-entitlements/136-21", 24, 0, 0.0, 2185.958333333333, 811, 5281, 2003.5, 3608.5, 4917.5, 5281.0, 0.10443273444061041, 0.13804532108714476, 0.09097070226662547], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 25, 0, 0.0, 2355.76, 461, 5020, 2473.0, 3873.400000000001, 4747.299999999999, 5020.0, 0.08995491459680408, 0.24734087650269687, 0.08494765860850542], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 25, 1, 4.0, 3859.6799999999994, 31, 7091, 3670.0, 6167.200000000001, 6850.4, 7091.0, 0.09301252692712655, 0.4442220153210234, 0.14841311327809628], "isController": false}, {"data": ["Debug Sampler", 24, 0, 0.0, 0.20833333333333331, 0, 2, 0.0, 1.0, 1.75, 2.0, 0.10500616911243535, 0.07751981307808084, 0.0], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 25, 0, 0.0, 5721.92, 1265, 9434, 6025.0, 8625.6, 9221.9, 9434.0, 0.08877084339402892, 0.3872974804171519, 0.18431739881899267], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 24, 0, 0.0, 2169.8749999999995, 928, 4601, 1990.5, 3965.0, 4537.0, 4601.0, 0.10407361473682385, 0.34186420778297183, 0.08638923098271512], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 24, 0, 0.0, 1945.5833333333333, 722, 4212, 1718.5, 3311.0, 4080.25, 4212.0, 0.10297556475661296, 0.15878751635809754, 0.08567888786390063], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 24, 0, 0.0, 2073.041666666666, 1079, 3915, 1929.5, 3340.5, 3861.25, 3915.0, 0.10305692606953766, 0.33852455760667466, 0.08554529996006544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 100.0, 0.31446540880503143], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 318, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 25, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
