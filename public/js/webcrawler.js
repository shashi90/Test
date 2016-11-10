
(function () {
	$(document).ajaxStart(function(){
	    $(".spinner").show();
	    $('#ajax-popup-bg').show();
	});

	$(document).ajaxComplete(function() {
	    $(".spinner").hide();
	    $('#ajax-popup-bg').hide();
	});
	$(document).ready(function() {
		Init();
	});

	function validateQ() {
		if(!$('#prodName').val() || $('#prodName').val() == "") {
			$('#prodName').focus();
			$('#invalidPrdName').fadeIn();
			setTimeout(function(){
				$('#invalidPrdName').fadeOut();
			}, 1000);
			return false;
		}
		return true;
	}

	function showResult(rH) {
		$('#result').html(rH);
		$('#result').show();
		$('#resultProducts').hide();
		$('#result-box').show();
		$("#question-box").animate({
            left: '-310px'
        }, 300, function() {
            $('#question-box').hide();
        });

        $('#result-box').animate({
            left: '0px'
        }, 300);
	}

	function displayProducts(products) {
		$('#result').hide();
		$('#resultProducts').show();
		if(products.length == 0) {
			$('#emptyProductLabel').show();
		}

		products.forEach(function(pName){
			var pItem = $('<div></div>').addClass('prodItem').html(pName);
			$('#resultProducts').append(pItem);
		});

		$('#result-box').show();
		$("#question-box").animate({
            left: '-310px'
        }, 300, function() {
            $('#question-box').hide();
        });

        $('#result-box').animate({
            left: '0px'
        }, 300);
	}

	function Init() {
		$('#submitQ').bind("click", function(e) {
			if(!validateQ())
				return false;
			var prdName = $('#prodName').val();
			var pageNum = $('#pageNum').val();

			var data = {
				prodName: prdName,
				pageNum: pageNum,
			}

			$.ajax('/LoktraTest/webCrawler/submit', {
	        	type: "POST",
	        	data: JSON.stringify(data),
	            contentType: "application/json",
	        	success: function(result) {
	        		$('.group input').val('');
	        		if(result.status == 1) {
	        			if(!pageNum) {
	        				showResult(result.prodCount);
	        			} else {
	        				displayProducts(result.products);
	        			}
	        		} else if(result.status == 0) {
	        			showResult("Error");
	        		}
	        	},
	        	error: function(xhr, textStatus, thrownError) {
	            	onHandleErrorFromServer(xhr);
	        	}
	    	});
		});

		$('#backQ').bind("click", function(e) {
			$('#result').html('');
			$('#resultProducts .prodItem').remove();
			$('#emptyProductLabel').hide();
			$('#question-box').show();
			$("#result-box").animate({
	            left: '310px'
	        }, 300, function() {
	            $('#result-box').hide();
	        });

	        $('#question-box').animate({
	            left: '0px'
	        }, 300);
		})
	}
})();
