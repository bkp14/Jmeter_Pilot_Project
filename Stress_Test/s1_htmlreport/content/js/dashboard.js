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

    var data = {"OkPercent": 94.90931574608409, "KoPercent": 5.090684253915911};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10746168098366178, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Assign_Leave"], "isController": true}, {"data": [0.0, 500, 1500, "/web/index.php/auth/login-7"], "isController": false}, {"data": [0.13345195729537365, 500, 1500, "/web/index.php/dashboard/index-35-0"], "isController": false}, {"data": [0.11921708185053381, 500, 1500, "/web/index.php/dashboard/index-35-1"], "isController": false}, {"data": [0.111328125, 500, 1500, "/web/index.php/leave/assignLeave-192-1"], "isController": false}, {"data": [0.0, 500, 1500, "Leave"], "isController": true}, {"data": [0.042704626334519574, 500, 1500, "/web/index.php/dashboard/index-35"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.006825938566552901, 500, 1500, "Launch"], "isController": true}, {"data": [0.119140625, 500, 1500, "/web/index.php/leave/assignLeave-192-0"], "isController": false}, {"data": [0.0, 500, 1500, "/web/index.php/api/v2/leave/employees/leave-requests-208"], "isController": false}, {"data": [0.12105263157894737, 500, 1500, "/web/index.php/auth/validate-35-0"], "isController": false}, {"data": [0.09824561403508772, 500, 1500, "/web/index.php/auth/validate-35-1"], "isController": false}, {"data": [0.04595588235294118, 500, 1500, "/web/index.php/leave/viewLeaveModule-180"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.12357414448669202, 500, 1500, "/web/index.php/leave/viewLeaveList-181-1"], "isController": false}, {"data": [0.0456140350877193, 500, 1500, "/web/index.php/auth/validate-35"], "isController": false}, {"data": [0.04752851711026616, 500, 1500, "/web/index.php/leave/viewLeaveList-181"], "isController": false}, {"data": [0.13786764705882354, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-0"], "isController": false}, {"data": [0.11213235294117647, 500, 1500, "/web/index.php/leave/viewLeaveModule-180-1"], "isController": false}, {"data": [0.12927756653992395, 500, 1500, "/web/index.php/leave/viewLeaveList-181-0"], "isController": false}, {"data": [0.0625, 500, 1500, "/web/index.php/leave/assignLeave-192"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4852, 247, 5.090684253915911, 5018.365004122007, 0, 28662, 3840.0, 11031.4, 13691.399999999998, 19024.550000000017, 7.264179897744541, 16.17760248237104, 7.78227917480743], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Assign_Leave", 247, 247, 100.0, 12757.506072874503, 1496, 37951, 12518.0, 22336.800000000003, 24637.399999999998, 31202.920000000027, 0.4364435680233524, 1.7335296666772686, 1.1495002958583802], "isController": true}, {"data": ["/web/index.php/auth/login-7", 291, 0, 0.0, 10978.828178694162, 2688, 25767, 10863.0, 15060.8, 17091.199999999997, 21892.279999999995, 0.44204299817562326, 0.9517592926818338, 0.3212134023335617], "isController": false}, {"data": ["/web/index.php/dashboard/index-35-0", 281, 0, 0.0, 3352.523131672597, 409, 11534, 3021.0, 6475.6, 7674.499999999996, 9651.840000000004, 0.4482781174871539, 0.6715416330325138, 0.37954797642711174], "isController": false}, {"data": ["/web/index.php/dashboard/index-35-1", 281, 0, 0.0, 3729.5088967971533, 422, 13005, 3344.0, 7498.0, 8347.8, 11942.960000000006, 0.44915946439731913, 0.9601785693591725, 0.37810103350633695], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192-1", 256, 0, 0.0, 4175.3125, 442, 15978, 3562.5, 8553.800000000003, 11664.649999999992, 13787.31, 0.45141313471155403, 0.9650509002473956, 0.3725040027649055], "isController": false}, {"data": ["Leave", 263, 0, 0.0, 14452.901140684406, 1989, 47945, 12973.0, 28510.199999999997, 34702.399999999994, 40643.160000000025, 0.425345411202272, 3.0931215213254926, 1.405633663582508], "isController": true}, {"data": ["/web/index.php/dashboard/index-35", 281, 0, 0.0, 7082.967971530256, 932, 22185, 6655.0, 13402.000000000002, 14912.999999999998, 21582.52, 0.4444746736432845, 1.6160076797433436, 0.7504850690715225], "isController": false}, {"data": ["Login", 282, 0, 0.0, 13849.4255319149, 2097, 37693, 13760.5, 25059.7, 27869.7, 33505.93, 0.4345836088007804, 3.1756427276786607, 1.6308037066167664], "isController": true}, {"data": ["Launch", 293, 0, 0.0, 10903.887372013653, 0, 25767, 10844.0, 15060.6, 17079.4, 21887.96, 0.44415676156664546, 0.9497827037891271, 0.32054631471159367], "isController": true}, {"data": ["/web/index.php/leave/assignLeave-192-0", 256, 0, 0.0, 3846.972656249999, 436, 19589, 3032.5, 8417.800000000005, 11099.399999999994, 14978.190000000004, 0.4541930355885082, 0.6804024576101285, 0.37790279914200103], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 247, 247, 100.0, 5026.048582995954, 417, 18994, 3818.0, 10940.600000000004, 13175.6, 17185.360000000004, 0.4477939350209303, 0.15043077504609378, 0.43729876466887724], "isController": false}, {"data": ["/web/index.php/auth/validate-35-0", 285, 0, 0.0, 3298.0070175438595, 431, 9556, 3031.0, 6464.000000000006, 7323.7, 8604.379999999988, 0.44866981207819134, 0.6721284098905718, 0.507273309085485], "isController": false}, {"data": ["/web/index.php/auth/validate-35-1", 285, 0, 0.0, 3572.856140350878, 447, 12343, 3365.0, 6509.400000000002, 7460.199999999999, 10233.61999999999, 0.44854129648894464, 0.9806768950476319, 0.42138352267809054], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180", 272, 0, 0.0, 7050.981617647056, 891, 28390, 6373.5, 12944.900000000001, 16156.749999999953, 24043.769999999953, 0.4505496871826896, 1.6379547140624509, 0.7449029496096616], "isController": false}, {"data": ["Debug Sampler", 243, 0, 0.0, 0.25925925925925936, 0, 5, 0.0, 1.0, 1.0, 1.0, 0.446430211751219, 0.3685123229895025, 0.0], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-1", 263, 0, 0.0, 4088.3307984790863, 430, 18844, 3304.0, 8705.4, 10904.4, 17743.560000000016, 0.44442041157047696, 0.9503621714795313, 0.3649976231745812], "isController": false}, {"data": ["/web/index.php/auth/validate-35", 285, 0, 0.0, 6871.968421052634, 886, 19488, 6842.0, 12292.6, 14598.999999999998, 17246.339999999997, 0.4438111700263951, 1.6351850283805565, 0.9187198407924755], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181", 263, 0, 0.0, 7743.049429657793, 851, 28057, 6584.0, 16069.199999999999, 19704.799999999992, 26989.000000000022, 0.4376353050218235, 1.5914508936371488, 0.7226965828045934], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-0", 272, 0, 0.0, 3253.6029411764707, 424, 13320, 2823.0, 6013.700000000002, 7822.749999999987, 10767.529999999972, 0.45740807695218233, 0.6852187402779764, 0.3805778140266205], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveModule-180-1", 272, 0, 0.0, 3796.393382352942, 431, 19088, 3204.0, 7514.300000000001, 9058.449999999999, 17554.68999999997, 0.45738423302381426, 0.9776184012445223, 0.3756446679424099], "isController": false}, {"data": ["/web/index.php/leave/viewLeaveList-181-0", 263, 0, 0.0, 3653.6463878327013, 420, 18718, 3013.0, 6656.999999999999, 9986.0, 16752.480000000043, 0.4444519552506168, 0.6658098626508263, 0.3689298456670159], "isController": false}, {"data": ["/web/index.php/leave/assignLeave-192", 256, 0, 0.0, 8023.304687500001, 904, 28662, 6885.0, 16581.5, 18577.399999999998, 24524.660000000014, 0.4484894140731073, 1.6306586065950721, 0.7432485700020147], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 247, 100.0, 5.090684253915911], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4852, 247, "401/Unauthorized", 247, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/index.php/api/v2/leave/employees/leave-requests-208", 247, 247, "401/Unauthorized", 247, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
