<?php

/**
 * This function contains boilerplate code for an AHAH handler.
 */
function blazemeter_ahah_callback($item_name, $fieldset_name) {
  include_once 'modules/node/node.pages.inc';
  $form_state = array('storage' => NULL, 'submitted' => FALSE);
  $form_build_id = $_POST['form_build_id'];
  $form = form_get_cache($form_build_id, $form_state);
  $args = $form['#parameters'];
  $form_id = array_shift($args);
  $form['#post'] = $_POST;
  $form['#redirect'] = FALSE;
  $form['#programmed'] = FALSE;
  $form_state['post'] = $_POST;
  drupal_process_form($form_id, $form, $form_state);
  $form = drupal_rebuild_form($form_id, $form_state, $args, $form_build_id);
  $form_portion = $form[$fieldset_name][$item_name . '_wrapper'][$item_name];
  unset($form_portion['#prefix'], $form_portion['#suffix']); // Prevent duplicate wrappers.
  $output = drupal_render($form_portion);
  drupal_json(array('status' => TRUE, 'data' => $output));
}

/**
 * This submit handler is invoked whenever the "Add more" submit button is clicked.
 * It increments the item counter stored in the form state.
 */
function blazemeter_ahah_more_submit($form, &$form_state) {
  $button_id = $form_state['clicked_button']['#id'];
  if (preg_match('/^edit-(.*?)-more$/', $button_id, $match)) {
    $item_name = strtr($match[1], '-', '_');

    unset($form_state['submit_handlers']);
    form_execute_handlers('submit', $form, $form_state);
    $form_state['rebuild'] = TRUE;

    // Add new item
    $form_state[$item_name . '_count'] = count($form_state['values'][$item_name]) + 1;
  }
  else {
    watchdog('blazemeter_ahah', 'blazemeter_ahah_more_submit invoked by wrong submit button %button.',
      array('%button' => $button_id), WATCHDOG_ALERT);
  }
}

/**
 * This function appends the wrapper element which will hold dynamically added items to the form.
 * It also appends the "Add more" button linked to the blazemeter_ahah_callback and blazemeter_ahah_more_submit
 * handler.
 */
function blazemeter_ahah_wrapper(&$form, $form_state, $item_name, $fieldset_name) {
  $wrapper_name = $item_name . '_wrapper';

  $wrapper = array(
    '#tree' => FALSE,
    '#weight' => 1,
    '#prefix' => '<div class="clear-block" id="' . strtr($wrapper_name, '_', '-') . '">',
    '#suffix' => '</div>',
  );

  $js_wrapper = strtr($item_name . 's', '_', '-');
  $wrapper[$item_name] = array(
    '#prefix' => '<div id="' . $js_wrapper . '">',
    '#suffix' => '</div>',
    '#theme' => $item_name,
  );

  if (isset($form_state[$item_name . '_count'])) {
    $item_count = $form_state[$item_name . '_count'];
  }
  elseif (isset($_POST[$item_name])) {
    // 'Refresh' button on the page following 'Add more' submission was clicked
    $item_count = count($_POST[$item_name]);
  }
  else {
    if ($fieldset_name == 'anonymous') {
      $item_count = variable_get('blazemeter_numof_anon_pages', 0) + 2;
    }
    else {
      if ($fieldset_name == 'authenticated') {
        $item_count = variable_get('blazemeter_numof_auth_pages', 0) + 2;
      }
      else {
        $item_count = 2;
      }
    }
  }

  for ($i = 0; $i < $item_count; $i++) {
    $item = $form_state['values'][$item_name][$i];
    $item_form = array('#tree' => TRUE);
    $item_form = array_merge(call_user_func($item_name . '_form', $item_form, $i, $item), $item_form);

    $wrapper[$item_name][$i] = $item_form;
  }

  $form[$fieldset_name][$wrapper_name] = $wrapper;

  //Ugly fix to prevent wrong button id
  if ($fieldset_name == 'anonymous') {
    //$submit = 'blazemeter_ahah_anon_submit';
    $text = t('Add Anon Page');
  }
  else {
    if ($fieldset_name == 'authenticated') {
      //$submit = 'blazemeter_ahah_auth_submit';
      $text = t('Add Auth Page');
    }
    else {
      $submit = 'blazemeter_ahah_more_submit';
      $text = t('Add Page');
    }
  }

  $form[$fieldset_name][$item_name . '_more'] = array(
    '#type' => 'submit',
    '#value' => $text,
    '#weight' => 10,
    '#submit' => array('blazemeter_ahah_more_submit'),
    '#ahah' => array(
      'path' => 'blazemeter_ahah/' . $item_name . '/' . $fieldset_name,
      'wrapper' => $js_wrapper,
      'method' => 'replace',
    ),
  );

  return $wrapper;
}
