// custom code for parkland bookstore categories
(function($){

    $.fn.menuify = function(options){

        var defaults = $.extend({
            "fadeInDuration"                 : "500",
            "fadeOutDuration"                : "500",
            "menuBackgroundColor"            : "transparent",
            "menuFontColor"                  : "blue",
            "contentBackgroundColor"         : "#00386F",
            "contentFontColor"               : "yellow",
            "hoverMouseEnter"                : "#c4c4c4",
            "hoverMouseLeave"                : "transparent",
        }, options);

        return this.each(function(i){
            var o = defaults;
            var $menuUl = $(this);
            var $aTags = $("a", $menuUl);
            var state = {
                previouslyShownDiv: "",
                previouslyClickedLink: null
            };

            $aTags.click(linkClickHandler);
         
            function linkClickHandler(e){
                console.log("clicked!");
                
                // e.target is the <a> tag that was clicked
                var $tag = $(e.target);
                var idOfDivToShow = $tag.attr("data-target");
                var storedId = $tag.attr("id");
                var storedPrice = $tag.attr("price");
                var storedProductURL = $tag.attr("productURL");
                var storedImage = $tag.attr("image");
                var storedName = $tag.attr("name");
                var storedSKU = $tag.attr("sku");

                //set sessionStorage values using values from product-list.json file
                console.log("REACHED HERE!");
                sessionStorage.setItem("productId", storedId);
                console.log("SESSION STORAGE FOR PRODUCT ID COMPLETED!");
                sessionStorage.setItem("price", storedPrice);
                console.log("SESSION STORAGE FOR PRICE COMPLETED!");
                sessionStorage.setItem("image", storedImage); 
                console.log("SESSION STORAGE FOR IMAGE COMPLETED!"); 
                sessionStorage.setItem("name", storedName); 
                console.log("SESSION STORAGE FOR NAME COMPLETED!");
                sessionStorage.setItem("sku", storedSKU); 
                console.log("SESSION STORAGE FOR SKU COMPLETED!");
                
                if(state.previouslyShownDiv){
                    $(state.previouslyShownDiv).fadeOut(o.fadeOutDuration);
                }
                if(state.previouslyClickedLink){
                    // un-style the link
                    var $prevTag = state.previouslyClickedLink;
                    $prevTag.css("color", o.menuFontColor);
                    $prevTag.parent().css("background-color", o.menuBackgroundColor); 
                }

                // style the link when clicked
                $tag.css("color", o.contentFontColor);
                $tag.parent().css("background-color", o.contentBackgroundColor);

                //style link when hovering
                $tag.hover(function() { 
                    $(this).css("background-color", o.contentBackgroundColor)//mouseenter
                           .css("color", o.contentFontColor);
                    }, function() {
                    $(this).css("background-color", o.hoverMouseLeave); //mouseleave
                });
          
                // store the things we need to undo on the next click
                state.previouslyShownDiv = idOfDivToShow;
                state.previouslyClickedLink = $tag;
            }
        });
    };
}(jQuery));
// custom code for parkland bookstore
$(document).ready(function(){

    //dyanmically create episode list from JSON file
    $.ajax({
        type: "get",
        url: "https://parkland-csc175.github.io/csc175data/bestbuy/products-list.json",
        //TEST url: "https://parkland-csc175.github.io/csc175data/bestbuy/products-list.jsonXYZ",
        beforeSend: function() {$("#products-list").html("LOADING...");},
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success: function(data) {
            //remove existing data from category
            $("#products-list").empty();

            //loop through json data to create variables for anchor table row/data tag elements
            $.each(data.products, function(i, item) {

                // create anchor and table row/data tag variables, along with price
                var $aTag = $("<a>");
                var $trItem = $("<tr>");
                var $tdModel = $("<td>");
                var $tdSKU = $("<td>");
                var $tdName = $("<td>");
                var $tdPrice = $("<td>");
                var $tdLink = $("<td>");
                var $price = "";
                if (item.onSale === true) {
                    $price = item.salePrice;
                }
                else {
                    $price = item.regularPrice;
                }

                //if image field is null, set item.image equal to item.alternateViewsImage
                if (item.image === null) { 

                    item.image = item.alternateViewsImage;
                }          

                //set table data tag with name, model, SKU, and price info from json file...
                //and append table data to table row item
                $trItem.append($tdName.text(item.name));
                $trItem.append($tdModel.text(item.modelNumber));
                $trItem.append($tdSKU.text(item.sku));
                $trItem.append($tdPrice.text($price));
               
                //add anchor href, data-target, and id attributes
                $aTag.attr({'href': "product-details.html?id={"+ item.productId +"}", 'name': item.name, 'id': item.productId, 'price': $price, 'data-target': i, 'image': item.image, 'sku': item.sku});//

                //set anchor tag text 
                $aTag.text("Click to View");
                
                //append anchor tag to table data link
                $tdLink.append($aTag);

                //append table data with link to table row item
                $trItem.append($tdLink);

                //append list tag data to category
                $("#products-list").append($trItem);
            });
            //use menuify function with products-list
            $("#products-list").menuify(); //must be placed here for completion of session storage
        }//end success
    });//end ajax
});//end document ready