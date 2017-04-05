var pca_tag = (function() {
    
    var account_code = '';
    var isInited = false;
    var currentFieldCount = null;

    function getVisibleInputElements() {
        return $('input[type=text],select').filter(
            function (elem) {
                return !!($('input[type=text],select')[elem].offsetWidth ||
                    $('input[type=text],select')[elem].offsetHeight ||
                    $('input[type=text],select')[elem].getClientRects().length);
                });
    };

    // Poll to see if the amount of input elements has changed.
    // If so then get the controls on the page and do a reload.
    function pollInputFieldChange() {
        
        setTimeout(function () {
            var visibleInputElements = getVisibleInputElements();

            if (currentFieldCount == null) {
                currentFieldCount = visibleInputElements.length;
            }
            else if (visibleInputElements.length != currentFieldCount) {
                currentFieldCount = visibleInputElements.length;
                reloadCapturePlusControls();
            }

            pollInputFieldChange(currentFieldCount);
        }, 1000);
    };
        
    // TODO : Do not like waiting on the class, must be another way!
    // This is for the default checkout.
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

                // Clearing out and reloading will only have elements in the html that relate to the current active controls.
                // TODO - this sets the country selection to what ever the settings specify, so if populated with a usa address, it can reset to uk.
                reloadCapturePlusControls();
            }
        }, 500);
    };

    //var previousCountry = {};

    function reloadCapturePlusControls() {
        if (pca && pca.capturePlus && pca.capturePlus.controls && pca.capturePlus.controls.length > 0) {
            $(".pca").empty();
            for (var i = 0; i < pca.capturePlus.controls.length; i++) {
                console.log("Reloaded : " + pca.capturePlus.controls[i].key);
                //previousCountry[pca.capturePlus.controls[i].key] = pca.capturePlus.controls[i].country;
                pca.capturePlus.controls[i].reload();
            }
        }
    };

    return {
        init : function(accountCode) {
            
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

                // pca.on('load', function (source, key, address, variations) {

                //     var keysFound = Object.keys(previousCountry).filter(function(y) { return y == key; });

                //     if (keysFound.length > 0){
                //         pca.capturePlus.controls.filter(function(x) { return x.key == key; })[0].setCountry(previousCountry[key]);
                //     }
                // });

                // Need to update the state field when the country selector is changed, 
                // so we also need to fire a change on the country so it can make the ajax request to get the state/regions. 
                // This means we need a mechanism to wait for the response and then choose the region/state.
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

                                    // Debounce function that will update the province field when ready.
                                    var updateProvinceField_debounce = pca.debounce(function() {

                                        var d = new Date();
                                        var date = " - " + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
                                        console.log("Updating Province field" + date);

                                        var instance = document.getElementById(provinceFieldId);
                                        pca.setValue(instance, address.ProvinceName);
                                        pca.fire(instance, 'change');

                                        disable_Watcher = true;

                                        // Clearing out and reloading will only have elements in the html that relate to the current active controls.
                                        // TODO - this sets the country selection to what ever the settings specify, so if populated with a usa address, it can reset to uk.
                                        reloadCapturePlusControls();

                                    }, 1200);

                                    var oldProvinceInstance = document.getElementById(provinceFieldId);
                                    var disable_Watcher = false;

                                    // Watches for instance change of the province field.
                                    var watcher = function () {
                                        
                                        var newInstance = document.getElementById(provinceFieldId);

                                        if (oldProvinceInstance != newInstance) {

                                            var d = new Date();
                                            var date = " - " + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
                                            console.log("Call Update Debounce" + date);

                                            oldProvinceInstance = newInstance;
                                            count = 0;
                                            updateProvinceField_debounce();
                                        }

                                        if (!disable_Watcher) {
                                            setTimeout(watcher, 200);
                                        }
                                    };
                                    
                                    // Start watching for changes.
                                    watcher();

                                    // Get the country field to change.
                                    var countryField = document.getElementById(countryFieldId);
                                    pca.setValue(countryField, address.CountryName);
                                    pca.fire(countryField, 'change');

                                    // If the instance does not change and the content of the element changes, this will cover that scenario.
                                    $("#" + provinceFieldId).on('DOMSubtreeModified', function(event) 
                                    { 
                                        $("#" + provinceFieldId).off('DOMSubtreeModified');

                                        disabled_Watcher = true;

                                        hasLoadedRegions(pca, provinceFieldId, address.ProvinceName);
                                    });
                                }
                            }

                            break;
                    }
                });
            }
        },

        pollInputFieldChange : pollInputFieldChange,

        getVisibleInputElements : getVisibleInputElements,

        reloadCapturePlusControls : reloadCapturePlusControls
    }
})();

(function() {
    // If we load on the checkout page then setup the polling to monitor field change.
    // This means if One-Step Checkouts are installed we can still load the control
    // and the user should be setup without the need for futher work.
    if (document.location.href.indexOf("checkout") > -1) 
    { 
        //pca_tag.pollInputFieldChange(); 
    }
})();