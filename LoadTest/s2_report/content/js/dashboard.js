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

    var data = {"OkPercent": 97.42765273311898, "KoPercent": 2.572347266881029};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34366925064599485, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02631578947368421, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.0, 500, 1500, "Edit_Entitlement"], "isController": true}, {"data": [0.5, 500, 1500, "/web/index.php/dashboard/index-35-0"], "isController": false}, {"data": [0.4375, 500, 1500, "/web/index.php/dashboard/index-35-1"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.39473684210526316, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.375, 500, 1500, "/web/index.php/leave/viewLeaveList-181-1"], "isController": false}, {"data": [0.5625, 500, 1500, "/web/index.php/leave/viewLeaveList-181-0"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.39473684210526316, 500, 1500, "/web/index.php/leave/viewLeaveEntitlements-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "Launch"], "isController": true}, {"data": [0.42105263157894735, 500, 1500, "/web/index.php/leave/editLeaveEntitlement/136-8"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "/web/index.php/api/v2/leave/leave-entitlements/136-21"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.5, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.5625, 500, 1500, "/web/index.php/leave/editLeaveEntitlement/136-8-1"], "isController": false}, {"data": [0.5625, 500, 1500, "/web/index.php/leave/editLeaveEntitlement/136-8-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.4375, 500, 1500, "/web/index.php/leave/viewLeaveEntitlements-1-0"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}, {"data": [0.375, 500, 1500, "/web/index.php/leave/viewLeaveEntitlements-1-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 311, 8, 2.572347266881029, 1581.0289389067523, 0, 12626, 924.0, 3235.2000000000007, 6135.999999999994, 10945.88, 1.5555133193954005, 3.820572312300559, 1.577620224048936], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/web/index.php/auth/login-7", 19, 0, 0.0, 8195.210526315792, 1065, 12626, 10087.0, 12137.0, 12626.0, 12626.0, 0.10938336566859143, 0.243700696527366, 0.07541470328322808], "isController": false}, {"data": ["Edit_Entitlement", 19, 8, 42.10526315789474, 3283.4736842105262, 1598, 7503, 2830.0, 7121.0, 7503.0, 7503.0, 0.12194026210738446, 0.93969086338519, 0.3979667363811981], "isController": true}, {"data": ["/web/index.php/dashboard/index-35-0", 8, 0, 0.0, 889.75, 499, 2573, 663.0, 2573.0, 2573.0, 2573.0, 0.050130338881090836, 0.07509759750350913, 0.04244433965811109], "isController": false}, {"data": ["/web/index.php/dashboard/index-35-1", 8, 0, 0.0, 909.75, 424, 2245, 559.0, 2245.0, 2245.0, 2245.0, 0.05066658222236296, 0.10837156417239303, 0.04265097058171569], "isController": false}, {"data": ["Leave", 19, 0, 0.0, 3050.3684210526317, 1597, 7008, 2486.0, 5652.0, 7008.0, 7008.0, 0.11964961554689321, 0.9308759768761374, 0.33912203945918373], "isController": true}, {"data": ["/web/index.php/auth/validate-35-0", 19, 0, 0.0, 1326.4736842105262, 419, 3641, 991.0, 2752.0, 3641.0, 3641.0, 0.11745360582569886, 0.18378688197767146, 0.13223793357380415], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 19, 0, 0.0, 1215.6315789473686, 450, 2661, 733.0, 2658.0, 2661.0, 2661.0, 0.1178835558643967, 0.29729607502047456, 0.11107931895877798], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-1", 8, 0, 0.0, 1117.75, 651, 2231, 858.0, 2231.0, 2231.0, 2231.0, 0.05204876969720628, 0.11155667704389012, 0.04274708526889696], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-0", 8, 0, 0.0, 940.625, 420, 2108, 674.5, 2108.0, 2108.0, 2108.0, 0.05156998369099266, 0.07725425291209252, 0.042807115368499765], "isController": false}, {"data": ["/web/index.php/dashboard/index-35", 19, 0, 0.0, 1348.0, 485, 4159, 1012.0, 3151.0, 4159.0, 4159.0, 0.11840219355642799, 0.37070670335576744, 0.14221529919922726], "isController": false}, {"data": ["Login", 19, 0, 0.0, 3891.8947368421054, 1902, 8531, 2965.0, 8357.0, 8531.0, 8531.0, 0.11570056693277797, 0.8350826383687437, 0.3782568853255144], "isController": true}, {"data": ["/web/index.php/leave/viewLeaveEntitlements-1", 19, 0, 0.0, 1322.6842105263158, 481, 4572, 1031.0, 2645.0, 4572.0, 4572.0, 0.12293517434148804, 0.4079304510426844, 0.14620035279159901], "isController": false}, {"data": ["Launch", 19, 0, 0.0, 8195.210526315792, 1065, 12626, 10087.0, 12137.0, 12626.0, 12626.0, 0.10877219095816851, 0.242339029680496, 0.07499332696920602], "isController": true}, {"data": ["/web/index.php/leave/editLeaveEntitlement/136-8", 19, 0, 0.0, 1225.1052631578948, 492, 3252, 1082.0, 2208.0, 3252.0, 3252.0, 0.12454769521212439, 0.43356117913891656, 0.1498656503192354], "isController": false}, {"data": ["/web/index.php/api/v2/leave/leave-entitlements/136-21", 19, 8, 42.10526315789474, 735.6315789473683, 427, 1801, 626.0, 1234.0, 1801.0, 1801.0, 0.126585651849483, 0.11478981576790853, 0.11026797016576058], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 19, 0, 0.0, 1746.7894736842106, 893, 3673, 1383.0, 3259.0, 3673.0, 3673.0, 0.12016494219433833, 0.5211512038629866, 0.1992825876255407], "isController": false}, {"data": ["Debug Sampler", 19, 0, 0.0, 0.9473684210526317, 0, 6, 1.0, 1.0, 6.0, 6.0, 0.12765900264724458, 0.09182052236048215, 0.0], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 19, 0, 0.0, 2543.8947368421054, 890, 6304, 1688.0, 4891.0, 6304.0, 6304.0, 0.11664313340290994, 0.47668648129105534, 0.24123593759592366], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 19, 0, 0.0, 1303.5789473684213, 467, 3490, 1154.0, 3335.0, 3490.0, 3490.0, 0.1219418273303725, 0.4198519289271686, 0.14338944930428976], "isController": false}, {"data": ["/web/index.php/leave/editLeaveEntitlement/136-8-1", 8, 0, 0.0, 717.5, 439, 1402, 517.5, 1402.0, 1402.0, 1402.0, 0.053084896019959915, 0.11353765419503391, 0.04422013311037677], "isController": false}, {"data": ["/web/index.php/leave/editLeaveEntitlement/136-8-0", 8, 0, 0.0, 834.375, 476, 1848, 683.5, 1848.0, 1848.0, 1848.0, 0.05261738609980203, 0.07882331081747687, 0.04485837701672575], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 19, 0, 0.0, 895.6315789473684, 404, 2194, 669.0, 2030.0, 2194.0, 2194.0, 0.12090359529112314, 0.18419528515749284, 0.10059556951956729], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveEntitlements-1-0", 8, 0, 0.0, 936.0, 447, 1920, 743.5, 1920.0, 1920.0, 1920.0, 0.0522445567702415, 0.07826479500542037, 0.04397930462494939], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 19, 0, 0.0, 849.842105263158, 458, 2092, 714.0, 1477.0, 2092.0, 2092.0, 0.12185736275012828, 0.34284283406554644, 0.10070017877757825], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveEntitlements-1-1", 8, 0, 0.0, 1181.875, 508, 2650, 1058.0, 2650.0, 2650.0, 2650.0, 0.05229475941142248, 0.11202645665418129, 0.04315339033462109], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 8, 100.0, 2.572347266881029], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 311, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/api/v2/leave/leave-entitlements/136-21", 19, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
