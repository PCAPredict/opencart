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
                console.log("Init field count " + visibleInputElements.length);
                currentFieldCount = visibleInputElements.length;
            }
            else if (visibleInputElements.length != currentFieldCount) {
                console.log(currentFieldCount + " > " + visibleInputElements.length);
                currentFieldCount = visibleInputElements.length;
                reloadCapturePlusControls();
            }

            pollInputFieldChange(currentFieldCount);
        }, 1000);
    };
        
    // TODO : Do not like waiting on the class, must be another way!
    function hasLoadedRegions(pca, provinceField, provinceName) {
        setTimeout(function () {
            if ($('.fa-spin').length > 0) {
                hasLoadedRegions(pca, provinceField, provinceName);
            } else {
                if (provinceField) {
                    pca.setValue(provinceField, provinceName);
                    pca.fire(provinceField, 'change');
                }

                // Clearing out and reloading will only have elements in the html that relate to the current active controls.
                reloadCapturePlusControls();
            }
        }, 500);
    };

    function reloadCapturePlusControls() {
        if (pca && pca.capturePlus && pca.capturePlus.controls && pca.capturePlus.controls.length > 0) {
            $(".pca").empty();
            for (var i = 0; i < pca.capturePlus.controls.length; i++) {
                pca.capturePlus.controls[i].reload();
                console.log("Control " + pca.capturePlus.controls[i].key + " reloaded.");
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

                // Need to update the state field when the country selector is changed, 
                // so we also need to fire a change on the country so it can make the ajax request to get the state/regions. 
                // This means we need a mechanism to wait for the response and then choose the region/state.
                pca.on('data', function (source, key, address, variations) {
                    switch (source) {
                        case "address":
                            var provinceField = null;
                            for (var c = 0; c < pca.capturePlus.controls.length; c++) {
                                var cont = pca.capturePlus.controls[c];
                                if (cont.key == key) {
                                    for (var f = 0; f < cont.fields.length; f++) {

                                        var element = pca.getElement(cont.fields[f].element);

                                        pca.fire(element, 'change');

                                        if (cont.fields[f].field === '{ProvinceName}') {
                                            provinceField = element;
                                        }
                                        else if (cont.fields[f].field === '{CountryName}') {
                                            pca.fire(element, 'change');
                                        }
                                    }

                                    hasLoadedRegions(pca, provinceField, address.ProvinceName);
                                }
                            }

                            break;
                    }
                })
            }
            else {
                console.log("Already called init");
            }
        },

        pollInputFieldChange : pollInputFieldChange
    }
})();