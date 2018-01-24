(function(){
  function getMenu() {
    var menuUrl = "https://jsonblob.com/api/jsonBlob/b235e32f-8250-11e7-8e2e-893ffec7f2e1";
    $.get(menuUrl, function(response) {
      response.menu.menu_items.forEach(function(menu_item, index){
        var vegNonVegSymbolHtml = menu_item.is_veg ? "<span class='veg-symbol'></span><span class='txt'>Veg</span>" : "<span class='nonveg-symbol'></span><span class='txt'>Non Veg</span>";
        var menuItemNameHtml = '<h2>' + menu_item.menu_item_name + '</h2>';
        var categoryNameHtml = '<h3>' + menu_item.category_name + '</h3>';


        var menuItemHtml = '<div class="card">' +
            '<img src="https://d39in59pr3ya79.cloudfront.net/images/app/drawable-xxxhdpi/dilli.jpg" alt="Avatar" style="width:100%">' +
            '<div class="card-caption">' + menuItemNameHtml + categoryNameHtml +
            '<div class="menu-item-prop">' +  
            '<div class="menu-item-prop-left"><div class="price"> <i class="fa fa-inr" aria-hidden="true"></i><span class="txt">' +  menu_item.price + '</span> </div>' +
            '<div class="veg-nonveg">' + vegNonVegSymbolHtml + '</div></div>' +
            '<span class="showmore-btn" data-menu-itemid="' + menu_item.menu_item_id + '">Show more</span>' +
            '</div> <div class="menu-caption-hidden hidden" data-menu-itemid="' + menu_item.menu_item_id + '">' + 
            '<div>Category ID: ' + menu_item.category_id + '</div><div>Current Inventory: ' + menu_item.current_inventory + '</div><div>Menu Item ID: ' + menu_item.menu_item_id + '</div>' +
            '</div> </div> </div>';  
        $('.menu-list').append(menuItemHtml);
        $(".showmore-btn").off().on('click', function(event) {
          var menuid = $(event.currentTarget).data('menu-itemid');
          if($(".menu-caption-hidden[data-menu-itemid=" + menuid + "]").hasClass('hidden')) {
            $(event.currentTarget).html('Hide');   
          } else {
            $(event.currentTarget).html('Show More');
          }
          $(".menu-caption-hidden[data-menu-itemid=" + menuid + "]").toggleClass('hidden');
        });
      })
    });
  }
    
  function getGeoCoords(geoPosition) {
    var position = {
      lat: geoPosition.coords.latitude,
      long: geoPosition.coords.longitude
    }
    getLocation(position);
  }
  function errorHandler() {
    alert("Please allow location to view menu.");     
  }
 
  function getLocation(position) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: position.lat, lng: position.long};
    geocoder.geocode({'location': latlng}, function(results, status) {
     
      if (status === 'OK') {
        if (results[0]) {
          renderLocationDetails(position, results[0]);
          getMenu();
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  
  function renderLocationDetails (position, address) {
    $('.lat').text(position.lat);
    $('.long').text(position.long);
    $('.locality').text(address.formatted_address);
  }
  
  $('#locateme').click(function(event) {
    if(navigator.geolocation) {
      var lat, long;
      navigator.geolocation.getCurrentPosition(getGeoCoords, errorHandler);
    } else {
      alert("your browser doesn't support geolocation");
    }
    
  }); 
  
  var input = document.getElementById('locationInput');
		if (input) {
			var searchBox = new google.maps.places.SearchBox(input);
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();
        if (places.length == 0) {
				  return;
				}
        $('.lat').text(places[0].geometry.location.lat());
        $('.long').text(places[0].geometry.location.lng());
        $('.locality').text(places[0].formatted_address);
        getMenu();
			});
		}
  
})();