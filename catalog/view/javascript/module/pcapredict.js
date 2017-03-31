var init;
var accountcode = '';

function init_pca_tag(accountCode) {

    accountcode = accountCode;

    (function (a, c, b, e) { 
        a[b] = a[b] || {}; 
        a[b].initial = { accountCode: accountCode, host: accountCode + ".pcapredict.com" }; 
        a[b].on = a[b].on || function () { (a[b].onq = a[b].onq || []).push(arguments) };
        var d = c.createElement("script");
        d.async = !0; 
        d.src = e; 
        c = c.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(d, c)
    })(window, document, "pca", "//"+ accountCode + ".pcapredict.com/js/sensor.js");

    // Need to update the state field when the country selector is changed, so we also need to fire a change on the country so it can make the ajax request to get the 
    // state/regions. This means we need a mechanism to wait for the response and then choose the region/state.
    
    pca.on('data', function(source, key, address, variations) {
        switch (source) {
            case "address":
                var provinceField = null;
                for(var c = 0; c < pca.capturePlus.controls.length; c++){
                    var cont = pca.capturePlus.controls[c];
                    if(cont.key == key){
                        for(var f = 0; f < cont.fields.length; f++){
                            
                            var element = pca.getElement(cont.fields[f].element);
                            
                            if(cont.fields[f].field === '{ProvinceName}')
                            {
                                provinceField = element;
                            } 
                            else if(cont.fields[f].field === '{CountryName}')
                            {
                                pca.fire(element, 'change');
                            }
                        }

                        hasLoadedRegions(pca, provinceField, address.ProvinceName);
                    }
                }
                break;
        }
    });

    // Do not like waiting on the class, must be another way!
    function hasLoadedRegions(pca, provinceField, provinceName) {
        setTimeout(function()
        {
            if ($('.fa-spin').length > 0) {
                hasLoadedRegions(pca, provinceField, provinceName);
            } else {
                if(provinceField){
                    pca.setValue(provinceField, provinceName);
                    pca.fire(provinceField, 'change');
                }
            }
        }, 500);
    }
};