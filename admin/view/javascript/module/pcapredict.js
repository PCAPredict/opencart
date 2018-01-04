var pca_tag = (function () {
    
        var account_code = '';
        var isInitialised = false;
    
        var currentPopulatedCountry = {};
    
        function init(accountCode) {
    
            if (!isInitialised) {
    
                account_code = accountCode;
                isInitialised = true;
    
                // Our standard script but loading in the account code at runtime.
                (function (a, c, b, e) {
                    a[b] = a[b] || {};
                    a[b].initial = {
                        accountCode: account_code,
                        host: account_code + ".pcapredict.com"
                    };
                    a[b].on = a[b].on || function () {
                        (a[b].onq = a[b].onq || []).push(arguments)
                    };
                    var d = c.createElement("script");
                    d.async = !0;
                    d.src = e;
                    c = c.getElementsByTagName("script")[0];
                    c.parentNode.insertBefore(d, c)
                })(window, document, "pca", "//" + account_code + ".pcapredict.com/js/sensor.js");
    
                // This is a way of knowing when our control has loaded all the controls for the page.
                pca.on('ready', function (p1, p2) {
    
                    pca.sourceString = 'PCAPredict-OpenCart-BackEnd-v1.0.0.1';
    
                    if (p2.controls.length > 0) {
    
                        for (var i = 0; i < p2.controls.length; i++) {
    
                            // Listen for the prepopulate so that we can store the country that relates to the last searched address.
                            // Store it under the related key in case we have more than one fieldset on the page.
                            p2.controls[i].listen('prepopulate', function (address) {
    
                                var self = this;
    
                                for (var j = 0; j < self.fields.length; j++) {
                                    if (self.fields[j].field == "{CountryName}") {
                                        var current = document.getElementById(self.fields[j].element);
                                        currentPopulatedCountry[self.key] = current.options[current.selectedIndex].text;
                                    }
                                }
                            });
    
                            // This gets called when the control is populating the data into the fields.
                            pca.on('data', function (source, key, address, variations) {
                                switch (source) {
                                    // Capture plus address service.
                                    case "address":
                                        // We only want to fire a change on the country field if the address we are returning is now in a different country.
                                        if (currentPopulatedCountry[key] != address.CountryName) {
                                            currentPopulatedCountry[key] = address.CountryName;
                                            
                                            // When this gets called we can get a reference to the controls that have been setup through the captureplus property.
                                            for (var i = 0; i < pca.capturePlus.controls.length; i++) {
                                                if (pca.capturePlus.controls[i].key == key) {
                                                    var fields = pca.capturePlus.controls[i].fields;
    
                                                    var country = null;
                                                    var provinceId = null;
                                                    
                                                    if (fields.length > 0){
                                                        for (var j = 0; j < fields.length; j++) {
                                                            if (fields[j].field == "{CountryName}") {
                                                                country = document.getElementById(fields[j].element);
                                                            }
                                                            if (fields[j].field == "{ProvinceName}") {
                                                                provinceId = fields[j].element;
                                                            }
                                                        }
                                                        
                                                        // Now we have got to the main reason for this.
                                                        // The checkout has a selection list for the province, because our control trys to populate all the fields,
                                                        // if the new address is a different country than the current one, we need to let the country change, update the province list
                                                        // and then set the province list. 
                                                        // We make a hash of the current province list and then have a timer check for the province field update.
                                                        // When the list changes we can set the province field to what the control fetched earlier.
                                                        var prevHash = hashCode(document.getElementById(provinceId).innerHTML);
                                                        countyChangeCheck(provinceId, address.ProvinceName, prevHash);
                                                        // Let the province checker start first, now fire a change on the country field so it fetches the related province list.
                                                        pca.fire(country, 'change');
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                }
                            });
    
                            // Checks to see the county list has changed content. If so we can try and set the county.
                            function countyChangeCheck(provinceFieldId, countyValue, previousHash) {
                                if (previousHash != hashCode(document.getElementById(provinceFieldId).innerHTML)) {
                                    pca.setValue(provinceFieldId, countyValue);
                                } else {
                                    setTimeout(function () {
                                        countyChangeCheck(provinceFieldId, countyValue, previousHash);
                                    }, 500);
                                }
                            };
    
                            // A basic function to sum up the county list.
                            function hashCode(val) {
                                var hash = 0;
                                for (var i = 0; i < val.length; i++) {
                                    var character = val.charCodeAt(i);
                                    hash = ((hash << 5) - hash) + character;
                                    hash = hash & hash; // Convert to 32bit integer
                                }
                                return hash;
                            }
                        }
                    } 
                    else {
                        console.log("No PCA controls found.")
                    }
                });
            }
        };
    
        return {
            init: init
        }
    })();
    