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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27985948477751754, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5571428571428572, 500, 1500, "MyPersonalInformation /identity"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "MyAccount /my-account"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "KPI_08_Logout"], "isController": false}, {"data": [0.0, 500, 1500, "KPI_05_AddToCart /cart"], "isController": false}, {"data": [0.0, 500, 1500, "KPI_03_Search /module/mijorasearch/search"], "isController": false}, {"data": [0.5857142857142857, 500, 1500, "MyWishlist /module/blockwishlist/mywishlist"], "isController": false}, {"data": [0.25, 500, 1500, "KPI_04_ClickProduct /nutitelefon-xiaomi-13-pro-5g-12gb-256gb-dual-sim-keraamiline-valge-1531592.html"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "KPI_01_Launch"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "KPI_02_Login /login"], "isController": false}, {"data": [0.0, 500, 1500, "KPI_06_ViewCart /quick-order"], "isController": false}, {"data": [0.0, 500, 1500, "KPI_07_ViewCart /quick-order"], "isController": false}, {"data": [0.5571428571428572, 500, 1500, "MyAddress /address"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 427, 0, 0.0, 4222.845433255269, 383, 246820, 1375.0, 8390.0, 14833.399999999996, 45838.599999999176, 0.11675084849431051, 6.548518425836963, 0.2458238074529695], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyPersonalInformation /identity", 35, 0, 0.0, 638.6285714285711, 408, 1157, 603.0, 866.3999999999999, 983.3999999999991, 1157.0, 0.010062195870129825, 0.32372026926579894, 0.013899531058548756], "isController": false}, {"data": ["MyAccount /my-account", 36, 0, 0.0, 1001.0277777777779, 647, 2048, 916.0, 1259.7000000000005, 1876.2999999999997, 2048.0, 0.010133762854748554, 0.35514957275633563, 0.019442837977177076], "isController": false}, {"data": ["KPI_08_Logout", 35, 0, 0.0, 1282.6285714285714, 907, 1618, 1298.0, 1579.2, 1602.8, 1618.0, 0.010066719339577193, 0.36807650366946304, 0.03929363007840824], "isController": false}, {"data": ["KPI_05_AddToCart /cart", 36, 0, 0.0, 7774.388888888889, 6232, 10409, 7467.5, 9408.500000000005, 10301.9, 10409.0, 0.01009426642862891, 0.6663574012423238, 0.04511203899695518], "isController": false}, {"data": ["KPI_03_Search /module/mijorasearch/search", 36, 0, 0.0, 15249.166666666664, 2966, 64720, 14821.0, 23615.2, 31592.949999999946, 64720.0, 0.010084129652775404, 1.84872810675928, 0.013747778427721721], "isController": false}, {"data": ["MyWishlist /module/blockwishlist/mywishlist", 35, 0, 0.0, 622.485714285714, 408, 1105, 614.0, 809.4, 1040.9999999999995, 1105.0, 0.010063040636858216, 0.33535700631297666, 0.01413655050180071], "isController": false}, {"data": ["KPI_04_ClickProduct /nutitelefon-xiaomi-13-pro-5g-12gb-256gb-dual-sim-keraamiline-valge-1531592.html", 36, 0, 0.0, 1550.7222222222226, 1067, 2502, 1486.0, 1961.2000000000003, 2118.649999999999, 2502.0, 0.010119511429988159, 0.40261787280701755, 0.02965826102450496], "isController": false}, {"data": ["KPI_01_Launch", 36, 0, 0.0, 1017.8055555555554, 584, 2723, 946.0, 1301.7000000000003, 1704.6999999999982, 2723.0, 0.010133508980822334, 0.40094983174152793, 0.006867827375674511], "isController": false}, {"data": ["KPI_02_Login /login", 36, 0, 0.0, 11623.222222222223, 1327, 246820, 1982.5, 5078.70000000001, 120656.1999999998, 246820.0, 0.010130785628354943, 0.3778999593713285, 0.026266831878205443], "isController": false}, {"data": ["KPI_06_ViewCart /quick-order", 36, 0, 0.0, 5041.416666666667, 2601, 53652, 3588.5, 4838.200000000001, 12950.599999999933, 53652.0, 0.009968262160864492, 0.6464295246807249, 0.014051399059439086], "isController": false}, {"data": ["KPI_07_ViewCart /quick-order", 35, 0, 0.0, 3806.4857142857145, 2752, 5799, 3525.0, 4970.0, 5785.4, 5799.0, 0.010055867526874306, 0.673087416644041, 0.014155934272695016], "isController": false}, {"data": ["MyAddress /address", 35, 0, 0.0, 674.8, 383, 1285, 626.0, 1016.5999999999999, 1245.7999999999997, 1285.0, 0.010061756184674048, 0.36315752857969974, 0.01800616401151295], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 427, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
