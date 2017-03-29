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
    // state/regions. This means we need a mechanism to wait for the responce and then choose the region/state.

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

// Calling pca.load() cannot be done by waiting for the elements to exist in the DOM because that would mean going through all the keys pulled down and
// checking the mappings to see if any exist. The method below relys only the href click events originating from the default elements. This might be an issue for
// one step checkout etc, but then again, with those views the fields would (hopefully) all be on the page. - Need to think about this a little more.

// var loadedBilling = false;
// var loadedShipping = false;

// $(document)
// .off('click.pca.payment')
// .on('click.pca.payment', 'a[href=\'#collapse-payment-address\']', function(event) {
    
//     if ($(this).attr('class').indexOf("collapsed") == -1 && !loadedBilling) {
//         if (pca) {
//             console.log("Load");
//             pca.load();
//             loadedBilling = true;
//         }
//     }
// });

// $(document)
// .off('click.pca.shipping')
// .on('click.pca.shipping', 'a[href=\'#collapse-shipping-address\']', function(event) {
    
//     if ($(this).attr('class').indexOf("collapsed") == -1 && !loadedShipping) {
//         if (pca) {
//             console.log("Load");
//             pca.load();
//             loadedShipping = true;
//         }
//     }
// });