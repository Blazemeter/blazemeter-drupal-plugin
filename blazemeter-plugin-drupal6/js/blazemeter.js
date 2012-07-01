$(document).ready(function() {
  //ugly fix for AHAH (add more button can't have same name)
  $("#edit-blazemeter-ahah-anon-page-more").val("Add Page");
  $("#edit-blazemeter-ahah-auth-page-more").val("Add Page");
    //anon slider
    jQuery15("#anon-slider").slider({ 
      min: 0, 
      max: 5000, 
      range: "min",
      value: $("#edit-anon").val(),
      slide: function(event, ui) {
        $("#edit-anon").val(ui.value);
      }
    });
    jQuery15("#edit-anon").change(function() {
      if(isNaN($("#edit-anon").val())) {
        //User entered a string
        $("#edit-anon").val(150);
      }
      if ($("#edit-anon").val() > 5000) {
        $("#edit-anon").val(5000);
      }
	  jQuery15("#anon-slider").slider("value", $("#edit-anon").val());
    });
    
    //auth slider
    jQuery15("#auth-slider").slider({ 
      min: 0, 
      max: 5000, 
      range: "min",
      value: $("#edit-auth").val(),
      slide: function(event, ui) {
        $("#edit-auth").val(ui.value);
      }
    });
    jQuery15("#edit-auth").change(function() {
      if(isNaN($("#edit-auth").val())) {
        //User entered a string
        $("#edit-auth").val(0);
      }
      if ($("#edit-auth").val() > 5000) {
        $("#edit-auth").val(5000);
      }
	  jQuery15("#auth-slider").slider("value", $("#edit-auth").val());
    });
    
    //unique slider
    jQuery15("#unique-slider").slider({ 
      min: 0, 
      max: 100, 
      range: "min",
      value: $("#edit-unique").val(),
      slide: function(event, ui) {
        $("#edit-unique").val(ui.value);
      }
    });
    jQuery15("#edit-unique").change(function() {
      if(isNaN($("#edit-unique").val())) {
        //User entered a string
        $("#edit-unique").val(0);
      }
      if ($("#edit-unique").val() > 5000) {
        $("#edit-unique").val(5000);
      }
	  jQuery15("#unique-slider").slider("value", $("#edit-unique").val());
    });
    
    jQuery15("#blazemeter-signup").click(function() {
      //jQuery15("#blazemeter-signup-modal .error").hide();
      jQuery15('#blazemeter-signup-modal').modal({
        closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
          height:680,
          minHeight:680
      });
      //jQuery15("#blazemeter-signup-modal").modal({overlayClose: true});
      //Check if the user key is set.
      window.setTimeout(function() {
		blazemeter_userkey_check();
	  }, 5000);
    });
    
    jQuery15("#blazemeter-login").click(function() {
      //jQuery15("#blazemeter-signup-modal .error").hide();
      jQuery15('#blazemeter-login-modal').modal({
        closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
          height:450,
          minHeight:450
      });
      //jQuery15("#blazemeter-signup-modal").modal({overlayClose: true});
      //Check if the user key is set.
      window.setTimeout(function() {
		blazemeter_userkey_check();
	  }, 5000);
    });
    
    //Scenario
    jQuery15("#blazemeter-scenario .blazemeter-button").click(function() {
      var id = $(this).attr("id");
      switch(id) {
        case "blazemeter-scenario-load":
          $("#edit-scenario").val("load");
        break;
        case "blazemeter-scenario-stress":
          $("#edit-scenario").val("stress");
        break;
        case "blazemeter-scenario-extreme":
          $("#edit-scenario").val("extreme stress");
        break;
      }
      
      $("#blazemeter-scenario .blazemeter-button").removeClass("button-selected");
      $(this).addClass("button-selected");
    });
    
    if($("#edit-hasuserkey").val()) {
      $("#edit-userkey-holder").val("user key is stored");
    }
    
    //Tooltips for scenario description
    jQuery15("#blazemeter-scenario-load").tooltip({position: "top right",relative: true, offset: [150, 250]});
    jQuery15("#blazemeter-scenario-stress").tooltip({position: "top right",relative: true, offset: [150, 192]});
    jQuery15("#blazemeter-scenario-extreme").tooltip({position: "top right",relative: true, offset: [150, 75]});
    
    /*jQuery15("#blazemeter-signup-modal #edit-signup").click(function() {
      var email = $("#blazemeter-signup-modal #edit-email").val();
      var pass = $("#blazemeter-signup-modal #edit-pass").val();
      
      if (!email) {
         jQuery15("#blazemeter-signup-modal .error").append("<li>E-mail address field is required.</li>");
         jQuery15("#blazemeter-signup-modal .error").show();
      }
      if (!pass) {
         jQuery15("#blazemeter-signup-modal .error").append("<li>Password field is required.</li>");
         jQuery15("#blazemeter-signup-modal .error").show();
      }
      
      if(email && pass) {
        //Proceed
        //Hide error div
        jQuery15("#blazemeter-signup-modal .error").hide();
        //Hide form
        jQuery15("#blazemeter-signup-modal .form").hide();
       
       jQuery15.ajax({
	     type: "GET",
		 url: Drupal.settings.basePath +"?q=blazemeter_ajax/signup",
		 data: "email=" + email+"&pass=" +pass,
		 dataType: 'json',
		 success:  function (data) {
           jQuery15("#blazemeter-signup-modal .ajax-msg").html(data.msg);
        }
	   });
       
      }
    });*/
    
    jQuery15('#edit-userkey-holder').keyup(function() {
      if(jQuery15('#password-password').val() != '') {
        jQuery15('#edit-userkey').val(jQuery15('#edit-userkey-holder').val());
      }
    });
});

function blazemeter_userkey_check() {
  jQuery15.ajax({
		type: "GET",
		url: Drupal.settings.basePath +"?q=blazemeter_ajax/userkey",
		dataType: 'json',
		success: function(data){
					if(data.status){
						//Userkey is sucessfully stored
						jQuery15(".modal-close").click();
                        jQuery15("#blazemeter-signup").hide();
                        jQuery15("#blazemeter-login").hide();
                        jQuery15("#edit-userkey").val("user key is stored");
                        jQuery15("#edit-userkey-holder").val("user key is stored");
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