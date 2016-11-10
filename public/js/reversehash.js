
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
		if(!$('#hashedVal').val() || $('#hashedVal').val() == "") {
			$('#hashedVal').focus();
			$('#invalidHashedVal').fadeIn();
			setTimeout(function(){
				$('#invalidHashedVal').fadeOut();
			}, 1000);
			return false;
		}
		return true;
	}

	function showResult(rH) {
		$('#result').html(rH);
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
			var hashedVal = $('#hashedVal').val();

			var data = {
				hashedVal: hashedVal,
			}

			$.ajax('/LoktraTest/reverseHash/submit', {
	        	type: "POST",
	        	data: JSON.stringify(data),
	            contentType: "application/json",
	        	success: function(result) {
	        		$('.group input').val('');
	        		if(result.status == 1) {
	        			showResult(result.reversedHash);
	        		} else if(result.status == 0) {
	        			showResult("Not a Valid Hash");
	        		}
	        	},
	        	error: function(xhr, textStatus, thrownError) {
	            	onHandleErrorFromServer(xhr);
	        	}
	    	});
		});

		$('#backQ').bind("click", function(e) {
			$('#result').html('');
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
