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
                    $(this).css("background-color", o.hoverMouseEnter); //mouseenter
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

$(document).ready(function(){

    //dyanmically create categorie list from JSON file
    $.ajax({
        type: "get",
        url: "https://parkland-csc175.github.io/csc175data/bestbuy/category-subcategories-abcat0101000.json",//use sample data to pull info
        //TEST url: "https://parkland-csc175.github.io/csc175data/bestbuy/category-subcategories-abcat0101000.jsonXYZ",
        beforeSend: function() {$("#subcategory").html("LOADING...");},
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success: function(data) {
            //remove existing data from category
            $("#subcategory").empty();

            //loop through json data to create variables for anchor and list tag elements
            $.each(data.categories[0].subCategories, function(i, item) {

                // create anchor and list tag variables
                var $aTag = $("<a>");
                var $listItem = $("<li>");

                //add anchor href, data-target, and id attributes
                //when user clicks link, they are redirected to products-list.html
                //$aTag.attr({'href': "#", 'data-target': i, 'id': item.id}); 
                $aTag.attr({'href': "products-list.html", 'data-target': i, 'id': item.id}); 

                //set anchor tag text with name from json file
                $aTag.text(item.name);

                //append anchor tag to list tag variable
                $listItem.append($aTag);

                //append list tag data to category
                $("#subcategory").append($listItem);
                              
            });
            //use menuify function with category
            $("#subcategory").menuify();
        }//end success
    });//end ajax
});//end document ready