var pca_tag = (function() {
    
    var account_code = '';
    var isInited = false;

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

                                // The province list reloads when a country is selected, listen to the content changed of the selection field.
                                $("#" + provinceFieldId).on('DOMSubtreeModified', function(event) 
                                { 
                                    $("#" + provinceFieldId).off('DOMSubtreeModified');
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

    return {
        init : init
    }
})();