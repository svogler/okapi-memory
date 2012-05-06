var counter = 0;
var numberOfPairs = 10;
var numberOfChecked = 0;
var pid_1;
var pid_2;
var products = [];
var cardLaunch = false;

var oc_host = 'svogler.inside-eu01.dw.demandware.net';
var oc_basepath = 'http://' + oc_host +'/s/Sites-SiteGenesis-Site/dw/shop/v12_2';
var oc_clientid = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function showGrid(query) {
			
    var url = oc_basepath + '/product_search?q={query}&count=30&format=json&client_id={clientid}&pretty_print=true'
   	url = url.replace(/\{query\}/g, query);
    url = url.replace(/\{clientid\}/g, oc_clientid);
    
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: loadProductData        
    });
}

function loadProductData(data) {
	
	if (data == null) {
		showError('An error occured while communicating via OCAPI');
		toggleButton($("#submittopic"));
		return false;
	}
	if (data.count < 10) {
		showError('Your search returned ' + data.count + ' results. At least 10 results are required.');
		toggleButton($("#submittopic"));
		return false;
	}

	var url = oc_basepath + '/products/({ids})?format=json&client_id={clientid}&pretty_print=true';

	var ids = [];
	
    // get all the ids and put it into an array
    $.each(data.hits, function(index, value) {
        ids.push(value.product_id);        
    });
    
    shuffle(ids);
    
	url = url.replace(/\{ids\}/g, ids.slice(0,10).join("+"));
    url = url.replace(/\{clientid\}/g, oc_clientid);
	
	$.ajax({
	        url: url,
	        dataType: 'jsonp',
	        success: initGrid
	});		
	
	$('#intro').fadeOut('slow', function() {
		
		$('.wrapper').fadeIn('slow', function() {
			window.setTimeout(function(){
				$('.memory section').addClass('flipped');
				
				window.setTimeout(function(){
					$('.memory section').removeClass('flipped');
					cardLaunch = true;
				}, 3000);
				
			}, 1500);			
		});

	});
	
}

function showError(message) {
	$('#intro p.error').html(message).show('fast');
}

function shuffle(o) {
    var j, x, i = o.length; 
    while (i != 0) { 
        j = parseInt(Math.random() * i);
        x = o[--i];
        o[i] = o[j];
        o[j] = x;
    }
}

function initGrid(data) {
    
    var images = [];
    var grid = "";
    
    // store the result for later retrieval
    products = data.data;
    
    // get all the products and put it into an array
    $.each(products, function(i, product) {
    	$.each(product.image_groups, function(j, group) {
    		if (group.view_type == 'medium') {
    			images.push({pid: product.id, image: group.images[0].link});
    			return false; 
    		}
    	});        
    });
    
    // double the content of the images array
    $.merge( images, images );
    
    // shuffle the array
    shuffle(images);
    
    
    // get all the images and put it into an array
    $.each(images, function(index, value) {
    	var p = getProduct(value.pid);
        grid = grid + "<section><figure class=\"back\"><img src=\"" + value.image + "\" data-pid=\"" + value.pid + "\" alt=\"\" title=\"\"/><div class=\"info name\"><span>" + p.name + "</span></div><div class=\"info price\"><span>Just " + p.price + " $</span></div></figure><figure class=\"front\"><img src=\"img/okapi.png\" alt=\"\" title=\"\"/></figure></section>";        
    });    
    
    grid = grid + "<br clear=\"all\"/>";
    $('.memory').html(grid);
    
    // get the number of pairs
    numberOfPairs = images.length / 2;
}


function getProduct(pid) {
	var p;
	$.each(products, function(i, product) {
   		if (product.id == pid) {
   			p = product;
   			return false; 
   		}
    });	
	
	return p;
}


function memoryCheck(pid_1, pid_2) {
	counter=0;
	
	if(pid_1 == pid_2) {
		$('.memory section').each(function(){
			if(($(this).find('img').attr('data-pid')== pid_1) || ($(this).find('img').attr('data-pid')== pid_2)) {
				$(this).removeClass('flipped').addClass('checked');
			}
		});
        
		numberOfChecked = ($('.memory .checked').length) / 2;		
		
		if(numberOfChecked == numberOfPairs) {
			$('#couponcode').html('OKAPI2012');
			$('.finished').fadeIn('slow');
		}
	} else {
		$('.memory section').removeClass('flipped');
	}
}

function toggleButton(button) {
	if (button.css('display') == 'none') {
    	button.css('display', '');
    	button.next().remove();
	} else {
		button.css('display', 'none');
        $('<img class="loadingicon">').attr('src', 'img/loading.gif').insertAfter(button);            	
	}
		
}

$(document).ready(function(){
	
	$("#ocapihost").html(oc_host);
	
	$("#submittopic").click(function() {
			showError("");
			var query = $('#inputtopic').val();
            if (query != '') {
            	toggleButton($(this));
            	showGrid(query);
            }
        });
	
	$('.memory').on('click', 'section', function(){
        
		if(($(this).attr('class') != 'flipped') && ($(this).attr('class') != 'checked') && (cardLaunch==true) && (counter < 2 )) {
			$(this).addClass('flipped');
			counter++;
			if(counter == 1 ){
				pid_1 = $(this).find('img').attr('data-pid');				
			} else {
				pid_2 = $(this).find('img').attr('data-pid');				
				
				window.setTimeout(function(){
					memoryCheck(pid_1, pid_2);
				}, 1000);
			}
		}
	});
	
});