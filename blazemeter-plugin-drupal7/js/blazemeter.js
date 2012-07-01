jQuery(document).ready(function($) {
  //ugly fix for AHAH (add more button can't have same name) @ http://drupal.org/node/1342066
  $("#edit-anonymous-blazemeter-ahah-anon-page").val("Add Page");
  $("#edit-authenticated-blazemeter-ahah-auth-page").val("Add Page");
    //anon slider
    $("#anon-slider").slider({ 
      min: 0, 
      max: 5000, 
      range: "min",
      value: $("#edit-anonymous-anon").val(),
      slide: function(event, ui) {
        $("#edit-anonymous-anon").val(ui.value);
      }
    });
    $("#edit-anonymous-anon").change(function() {
      if(isNaN($("#edit-anonymous-anon").val())) {
        //User entered a string
        $("#edit-anonymous-anon").val(150);
      }
      if ($("#edit-anonymous-anon").val() > 5000) {
        $("#edit-anonymous-anon").val(5000);
      }
	  $("#anon-slider").slider("value", $("#edit-anonymous-anon").val());
    });
    
    //auth slider
    $("#auth-slider").slider({ 
      min: 0, 
      max: 5000, 
      range: "min",
      value: $("#edit-authenticated-auth").val(),
      slide: function(event, ui) {
        $("#edit-authenticated-auth").val(ui.value);
      }
    });
    $("#edit-authenticated-auth").change(function() {
      if(isNaN($("#edit-authenticated-auth").val())) {
        //User entered a string
        $("#edit-authenticated-auth").val(0);
      }
      if ($("#edit-authenticated-auth").val() > 5000) {
        $("#edit-authenticated-auth").val(5000);
      }
	  $("#auth-slider").slider("value", $("#edit-authenticated-auth").val());
    });
    
    //unique slider
    $("#unique-slider").slider({ 
      min: 0, 
      max: 100, 
      range: "min",
      value: $("#edit-authenticated-unique").val(),
      slide: function(event, ui) {
        $("#edit-authenticated-unique").val(ui.value);
      }
    });
    $("#edit-authenticated-unique").change(function() {
      if(isNaN($("#edit-authenticated-unique").val())) {
        //User entered a string
        $("#edit-authenticated-unique").val(0);
      }
      if ($("#edit-authenticated-unique").val() > 5000) {
        $("#edit-authenticated-unique").val(5000);
      }
	  $("#unique-slider").slider("value", $("#edit-authenticated-unique").val());
    });
    
    $("#blazemeter-signup").click(function() {
      $('#blazemeter-signup-modal').modal({
        closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
          height:680,
          minHeight:680
      });
      //Check if the user key is set.
      window.setTimeout(function() {
		blazemeter_userkey_check();
	  }, 5000);
    });
    
    $("#blazemeter-login").click(function() {
      //$("#blazemeter-signup-modal .error").hide();
      $('#blazemeter-login-modal').modal({
        closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
          height:450,
          minHeight:450
      });

      //Check if the user key is set.
      window.setTimeout(function() {
		blazemeter_userkey_check();
	  }, 5000);
    });
    
    //Scenario
    $("#blazemeter-scenario .blazemeter-button").click(function() {
      var id = $(this).attr("id");
      switch(id) {
        case "blazemeter-scenario-load":
          $("#edit-meta-scenario").val("load");
        break;
        case "blazemeter-scenario-stress":
          $("#edit-meta-scenario").val("stress");
        break;
        case "blazemeter-scenario-extreme":
          $("#edit-meta-scenario").val("extreme stress");
        break;
      }
      
      $("#blazemeter-scenario .blazemeter-button").removeClass("button-selected");
      $(this).addClass("button-selected");
    });
    
    if($("#edit-meta-hasuserkey").val()) {
      $("#edit-meta-userkey-holder").val("user key is stored");
    }
    
    //Tooltips for scenario description
    $("#blazemeter-scenario-load").tooltip({position: "top right",relative: true, offset: [150, 250]});
    $("#blazemeter-scenario-stress").tooltip({position: "top right",relative: true, offset: [150, 192]});
    $("#blazemeter-scenario-extreme").tooltip({position: "top right",relative: true, offset: [150, 75]});
    
    $('#edit-meta-userkey-holder').keyup(function() {
      if($('#password-password').val() != '') {
        $('#edit-meta-userkey').val($('#edit-meta-userkey-holder').val());
      }
    });
    
   function blazemeter_userkey_check() {
  $.ajax({
		type: "GET",
		url: Drupal.settings.basePath +"?q=blazemeter_ajax/userkey",
		dataType: 'json',
		success: function(data){
					if(data.status){
						//Userkey is sucessfully stored
						$(".modal-close").click();
                        $("#blazemeter-signup").hide();
                        $("#blazemeter-login").hide();
                        $("#edit-meta-userkey").val("user key is stored");
                        $("#edit-meta-userkey-holder").val("user key is stored");
					}
					else{
					  //Login/registration is not finished yet, check again after 2 sec.
						window.setTimeout(function() {
							blazemeter_userkey_check();
						}, 2000);
					}
				}
	});
}
});

