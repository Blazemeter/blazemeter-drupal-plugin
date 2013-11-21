$(document).ready(function () {
  var change_flag = false;
  //ugly fix for AHAH (add more button can't have same name)
  $("#edit-blazemeter-ahah-anon-page-more").val("Add Page");
  $("#edit-blazemeter-ahah-auth-page-more").val("Add Page");

  var max_users = parseInt($("#edit-max-users").val());
  var median_users = max_users / 2;

  //anon slider
  jQuery15("#anon-slider").slider({
    min:0,
    max:max_users,
    range:"min",
    value:$("#edit-anon").val(),
    slide:function (event, ui) {
      $("#edit-anon").val(ui.value);
      change_flag = true;
    }
  });
  jQuery15("#edit-anon").change(function () {
    if (isNaN($("#edit-anon").val())) {
      //User entered a string
      $("#edit-anon").val(median_users);
    }
    if ($("#edit-anon").val() > max_users) {
      $("#edit-anon").val(max_users);
    }
    if ($("#edit-anon").val() < 0) {
      $("#edit-anon").val(0);
    }
    jQuery15("#anon-slider").slider("value", $("#edit-anon").val());
  });

  //contact slider
  /*jQuery15("#contact-slider").slider({
   min:0,
   max:100,
   range:"min",
   value:$("#edit-contact").val(),
   slide:function (event, ui) {
   $("#edit-contact").val(ui.value);
   change_flag = true;
   }
   });
   jQuery15("#edit-contact").change(function () {
   if (isNaN($("#edit-contact").val())) {
   //User entered a string
   $("#edit-contact").val(0);
   }
   if ($("#edit-contact").val() > 100) {
   $("#edit-contact").val(100);
   }
   if ($("#edit-contact").val() < 0) {
   $("#edit-contact").val(0);
   }
   jQuery15("#contact-slider").slider("value", $("#edit-contact").val());
   });
   */
  //auth slider
  jQuery15("#auth-slider").slider({
    min:0,
    max:max_users,
    range:"min",
    value:$("#edit-auth").val(),
    slide:function (event, ui) {
      $("#edit-auth").val(ui.value);
      change_flag = true;
    }
  });
  jQuery15("#edit-auth").change(function () {

    if (isNaN($("#edit-auth").val())) {
      //User entered a string
      $("#edit-auth").val(0);
    }
    if ($("#edit-auth").val() > max_users) {
      $("#edit-auth").val(max_users);
    }
    if ($("#edit-auth").val() < 0) {
      $("#edit-auth").val(0);
    }
    jQuery15("#auth-slider").slider("value", $("#edit-auth").val());
  });

  jQuery15("#blazemeter-signup").click(function () {
    jQuery15('#blazemeter-signup-modal').modal({
      closeHTML:"<a href='#' title='Close' class='modal-close'>x</a>",
      height:605,
      minHeight:605,
      containerId:'simplemodal-register-container'
    });
    //Check if the user key is set.
    window.setTimeout(function () {
      blazemeter_userkey_check();
    }, 5000);
  });

  jQuery15("#blazemeter-login").click(function () {
    jQuery15('#blazemeter-login-modal').modal({
      closeHTML:"<a href='#' title='Close' class='modal-close'>x</a>",
      height:503,
      minHeight:503,
      containerId:'simplemodal-login-container'
    });
    //Check if the user key is set.
    window.setTimeout(function () {
      blazemeter_userkey_check();
    }, 5000);
  });

  //Scenario
  jQuery15("#blazemeter-scenario .blazemeter-button").click(function () {
    var id = $(this).attr("id");
    if (id != $("#edit-scenario").val()) {
      change_flag = true;
    }
    switch (id) {
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

  if ($("#edit-hasuserkey").val()) {
    $("#edit-userkey-holder").val("user key is stored");
  }

  //Tooltips for scenario description
  jQuery15("#blazemeter-scenario-load").tooltip({position:"top right", relative:true, offset:[150, 250]});
  jQuery15("#blazemeter-scenario-stress").tooltip({position:"top right", relative:true, offset:[150, 192]});
  jQuery15("#blazemeter-scenario-extreme").tooltip({position:"top right", relative:true, offset:[150, 75]});

  jQuery15('#edit-userkey-holder').keyup(function () {
    if (jQuery15('#password-password').val() != '') {
      jQuery15('#edit-userkey').val(jQuery15('#edit-userkey-holder').val());
    }
  });

  jQuery15("#blazemeter-admin-settings-form #edit-goto").click(function () {
    $("#blazemeter-admin-settings-form .warning").remove();
    if (change_flag) {
      $("#blazemeter-admin-settings-form .submit-buttons").before("<div class='warning'>* The changes will not be saved until the Save button is clicked.</div>");
    }
  });

  jQuery15('#blazemeter-admin-settings-form').change(function () {
    change_flag = true;
  });

});

function blazemeter_userkey_check() {
  jQuery15.ajax({
    type:"GET",
    url:Drupal.settings.basePath + "?q=blazemeter_ajax/userkey",
    dataType:'json',
    success:function (data) {
      if (data.status) {
        //Userkey is sucessfully stored
        jQuery15(".modal-close").click();
        jQuery15("#blazemeter-signup").hide();
        jQuery15("#blazemeter-login").hide();
        jQuery15("#edit-userkey").val("user key is stored");
        jQuery15("#edit-userkey-holder").val("user key is stored");
      }
      else {
        //Login/registration is not finished yet, check again after 2 sec.
        window.setTimeout(function () {
          blazemeter_userkey_check();
        }, 2000);
      }
    }
  });
}
