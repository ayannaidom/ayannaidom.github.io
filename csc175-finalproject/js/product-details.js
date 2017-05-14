// custom code for parkland bookstore subcategories
$(document).ready(function(){

    //retrieve variables from session storage set in product-list.js to display product-details
    var getId = sessionStorage.getItem("productId");
    console.log("ID RETRIEVED FROM SESSION STORAGE!");
    var getPrice = sessionStorage.getItem("price");
    console.log("PRICE RETRIEVED FROM SESSION STORAGE!");
    var getImage = sessionStorage.getItem("image"); 
    console.log("PRODUCT URL RETRIEVED FROM SESSION STORAGE!"); 
    var getName = sessionStorage.getItem("name"); 
    console.log("NAME RETRIEVED FROM SESSION STORAGE!"); 
    var getSKU = sessionStorage.getItem("sku"); 
    console.log("SKU RETRIEVED FROM SESSION STORAGE!"); 

    //automatically set product id form field to getId value
    $("#product").val(getId);

    //remove existing data from product-details section
    $("#product-details").empty();

    //create tag variables
    var $imgTag = $("<img>");
    var $headerFourPrice = $("<h4>");
    var $headerFourName = $("<h4>");
    var $divCaption = $("<div>");

    //set attribute values using session storage values
    $imgTag.attr({'class': "img-responsive", 'src': getImage, 'alt': getName});
    $divCaption.attr({'class': "caption-full"});
    $headerFourPrice.attr({'class': "pull-right"}).text(getPrice);
    $headerFourName.attr({'class': "pull-left"}).text(getName);

    //append price and name to divCaption
    $divCaption.append($headerFourPrice);
    $divCaption.append($headerFourName);
  
    //append image tag data and spacing to product-details
    $("#product-details").append("<br>");
    $("#product-details").append($imgTag);
    $("#product-details").append("<br>");
    $("#product-details").append("<br>");
    $("#product-details").append($divCaption);
    $("#product-details").append("<br>");
    $("#product-details").append("<br>");   
    $("#product-details").append("<br>");  
    $("#product-details").append("<br>");  

    //create leave a comment button
    var $divRight = $("<div>");
    $divRight.attr({'class':"text-right"});
    var $leaveComment = $("<a>");
    $leaveComment.attr({'href': "#leave-a-comment", 'class': "btn btn-success", 'style':"background-color: #00386F; color: yellow; font-weight: bold;"});
    $leaveComment.text("Leave a Comment");
    $divRight.append($leaveComment);  

    //append divRight and spacing to product-details
    $("#product-details").append($divRight);
    $("#product-details").append("<br>"); 
    $("#product-details").append("<br>"); 

    $.ajax({
        type: "get",                                              
        url: "https://parkland-csc175.github.io/csc175data/bestbuy/product-reviews-7306011.json", //data.reviews is in products-reviews json files
        //TEST url: "https://parkland-csc175.github.io/csc175data/bestbuy/product-reviews-4506800.json",
        beforeSend: function() {$("#well").html("LOADING...");},
        timeout: 10000,
        error: function(xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success: function(data) {
            //remove existing data from category
            $("#well").empty();
          
            //loop through json data to create variables for anchor table row/data tag elements
            $.each(data.reviews, function(i, item) { 
                var $divWell = $("<div>");

                $divWell.attr({'class':"well", 'id': "well"});
                $divWell.append("<br>");

                var $divComments = $("<div>");
                var $divColumn = $("<div>");

                $divComments.attr({'class': "row", 'id': "comments-area"});
                $divColumn.attr({'class': "col-md-12"});
                
                for(a=0; a < item.rating; a++) {
                    var $starSpan = $("<span>");
                    $starSpan.attr({'class': "glyphicon glyphicon-star"}); 
                    $divColumn.append($starSpan);
                }

                for(b=5; b > item.rating; b--) {
                    var $starSpanEmpty = $("<span>");
                    $starSpanEmpty.attr({'class': "glyphicon glyphicon-star-empty"});
                    $divColumn.append($starSpanEmpty);
                }

                if (item.rating == 5) {//at the end of star creation, add name
                    $starSpan.text(" " +  item.reviewer[0].name); //first element in reviewer array
                }
                else { //at the end of empty star creation, add name
                    $starSpanEmpty.text(" " +  item.reviewer[0].name); //first element in reviewer array
                }

                //process submissionDate from json file
                if ((item.submissionTime - 0) == item.submissionTime && item.submissionTime.length > 0) {
                    var s = new Date(item.submissionTime);
                    if (isNaN(s.getTime())) { // Checks if submissionTime is formatted in milliseconds
                      var s = new Date(item.submissionTime * 1000); //if not, add milliseconds 
                    }
                //return s;
                }

                var s = $.trim(item.submissionTime);
                s = s.replace(/-/,"/").replace(/-/,"/");
                s = s.replace(/T/," ").replace(/Z/," UTC");
                s = s.replace(/([\+-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
                var commentDate = new Date(s);
                //return new Date(s);

                ///DAYS AGO *DATES FROM SAMPLE DATA OVER A YEAR OLD
                //var currentDate = new Date().getTime(); 
                //var submissionDate = new Date(item.submissionTime).getTime();
                //var daysAgo = Math.round( (currentDate - submissionDate) / (24 * 60 * 60 * 1000));

                //create span right tag to store comment date
                var $spanRight = $("<span>");
                $spanRight.attr({'class': "pull-right"});
                $spanRight.text(commentDate);

                //create paragraph variable for comment
                var $pComment = $("<p>");
                $pComment.text(item.comment);

                //append spanRight and pComment info to divColumn
                $divColumn.append($spanRight);
                $divColumn.append($pComment);
                
                //append divColumn and pComment to divComments
                $divComments.append($divColumn); 
                $divComments.append($pComment);  

                //append divComments to divWell
                $divWell.append($divComments);

            //APPEND well section to product-details and variables need access, so place here                 
            $("#product-details").append($divWell);             
            });
        }//end success
    });//end ajax
});//end document ready