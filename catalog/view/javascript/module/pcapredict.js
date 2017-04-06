// var pca_opencart_util = (function(){
//     return {
//         // Checks the element with the given id for instance reference changes.
//         // When it changes, it calls a function to run.
//         Watcher : function Watcher(id, funcToRun) {
            
//             var elementId = id;
//             var disabled = false;
//             var oldProvinceInstance = document.getElementById(elementId);

//             // does the watching.
//             function watch() 
//             {
//                 var newInstance = document.getElementById(elementId);

//                 if (oldProvinceInstance != newInstance) {

//                     if (console && console.log) { console.log("Call Update Debounce"); };

//                     oldProvinceInstance = newInstance;
                    
//                     funcToRun();
//                 }

//                 if (!disabled) {
//                     setTimeout(watch, 200);
//                 }
//             };

//             function stop(){
//                 disabled = true;
//             }

//             function start(){
//                 disabled = false;
//                 watch();
//             }

//             return {
//                 start : start,
//                 stop : stop
//             };
//         }
//     }
// })();

var pca_tag = (function() {
    
    var account_code = '';
    var isInited = false;
    // var currentFieldCount = null;
    // var watcher = null;

    function init(accountCode) {
            
        if (!isInited) {

            account_code = accountCode;
            isInited = true;

            (function (a, c, b, e) {
                a[b] = a[b] || {};
                a[b].initial = { accountCode: account_code, host: account_code + ".pcapredict.com" };
                a[b].on = a[b].on || function () { (a[b].onq = a[b].onq || []).push(arguments) };
                var d = c.createElement("script");
                d.async = !0;
                d.src = e;
                c = c.getElementsByTagName("script")[0];
                c.parentNode.insertBefore(d, c)
            })(window, document, "pca", "//" + account_code + ".pcapredict.com/js/sensor.js");

            // Fields get re-rendered when we fire a change on the field.
            // We populate the fields here so it persists it to the session.
            pca.on('data', function (source, key, address, variations) {

                switch (source) {
                    case "address":
                        var provinceFieldId = null;
                        var countryFieldId = null;
                        for (var c = 0; c < pca.capturePlus.controls.length; c++) {
                            var cont = pca.capturePlus.controls[c];
                            if (cont.key == key) {
                                for (var f = 0; f < cont.fields.length; f++) {

                                    var element = pca.getElement(cont.fields[f].element);

                                    if (cont.fields[f].field === '{CountryName}')
                                    {
                                        countryFieldId = element.id;
                                    } 
                                    else if (cont.fields[f].field === '{ProvinceName}') 
                                    {
                                        provinceFieldId = element.id;
                                    }
                                    else 
                                    {
                                        pca.fire(element, 'change');
                                    }
                                }

                                // // Start watching for changes.
                                // watcher = new pca_opencart_util.Watcher(provinceFieldId, pca.debounce(
                                //     function() {

                                //         if (console && console.log) { console.log("Updating Province field"); };

                                //         var instance = document.getElementById(provinceFieldId);
                                //         pca.setValue(instance, address.ProvinceName);
                                //         pca.fire(instance, 'change');

                                //         watcher.stop();

                                //         reloadCapturePlusControls();

                                //     }, 1200));
                                // watcher.start();

                                // The province list reloads when a country is selected, listen to the content changed of the selection field.
                                $("#" + provinceFieldId).on('DOMSubtreeModified', function(event) 
                                { 
                                    $("#" + provinceFieldId).off('DOMSubtreeModified');
                                    //watcher.stop();
                                    hasLoadedRegions(pca, provinceFieldId, address.ProvinceName);
                                });

                                // Get the country field to change.
                                var countryField = document.getElementById(countryFieldId);
                                pca.setValue(countryField, address.CountryName);
                                pca.fire(countryField, 'change');
                            }
                        }
                        break;
                }
            });

            // For the default checkout, waits on the loaded spinner that shows when updating the country field.
            function hasLoadedRegions(pca, provinceFieldId, provinceName) {
                setTimeout(function () {
                    if ($('.fa-spin').length > 0) {
                        hasLoadedRegions(pca, provinceFieldId, provinceName);
                    } else {
                        if (provinceFieldId) {
                            var latestInstance = document.getElementById(provinceFieldId);
                            pca.setValue(latestInstance, provinceName);
                            pca.fire(latestInstance, 'change');
                        }
                    }
                }, 500);
            };
        }
    };
    
    // function getVisibleInputElements() {
    //     return $('input[type=text],select').filter(
    //         function (elem) {
    //             return !!($('input[type=text],select')[elem].offsetWidth ||
    //                 $('input[type=text],select')[elem].offsetHeight ||
    //                 $('input[type=text],select')[elem].getClientRects().length);
    //             });
    // };

    // // Poll to see if the amount of input elements has changed.
    // // If so then get the controls on the page and do a reload.
    // function pollInputFieldChange() {
        
    //     setTimeout(function () {
    //         var visibleInputElements = getVisibleInputElements();

    //         if (currentFieldCount == null) {
    //             currentFieldCount = visibleInputElements.length;
    //         }
    //         else if (visibleInputElements.length != currentFieldCount) {
    //             currentFieldCount = visibleInputElements.length;
    //             reloadCapturePlusControls();
    //         }

    //         pollInputFieldChange(currentFieldCount);
    //     }, 1000);
    // };

    // function reloadCapturePlusControls() {
    //     if (pca && pca.capturePlus && pca.capturePlus.controls && pca.capturePlus.controls.length > 0) {
    //         $(".pca").empty();
    //         for (var i = 0; i < pca.capturePlus.controls.length; i++) {
    //             if (console && console.log) { console.log("Reloaded : " + pca.capturePlus.controls[i].key); };
    //             pca.capturePlus.controls[i].reload();
    //         }
    //     }
    // };

    // function getCurrentWatcher() {
    //     return watcher;
    // }

    return {
        init : init

        // getVisibleInputElements : getVisibleInputElements,

        // getCurrentWatcher : getCurrentWatcher
    }
})();

// (function() {
//     // If we load on the checkout page then setup the polling to monitor field change.
//     // This means if One-Step Checkouts are installed we can still load the control
//     // and the user should be setup without the need for futher work.
//     if (document.location.href.indexOf("checkout") > -1) 
//     { 
//         pca_tag.pollInputFieldChange(); 
//     }
// })();