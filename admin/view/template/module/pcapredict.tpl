<?php echo $header; ?>

<?php echo $column_left; ?>

<div id="content">

  <div class="page-header">
    <div class="container-fluid">
			<div class="form-inline pull-right">
				<a href="<?php echo $cancel; ?>" data-toggle="tooltip" title="" class="btn btn-default" data-original-title="Cancel"><i class="fa fa-reply"></i></a>
			</div>
			<ul class="breadcrumb">
				<?php foreach ($breadcrumbs as $breadcrumb) { ?>
				<li><a href="<?php echo $breadcrumb['href']; ?>"><?php echo $breadcrumb['text']; ?></a></li>
				<?php } ?>
			</ul>
		</div>
  </div>

  <div class="page-content container-fluid">
    <div class="pcapredict-container">
      <div class="pcapredict-message-container">
        <div class="pcapredict-message <?php echo $status_message_type ?>"><?php echo isset($status_message) ? $status_message : ''; ?></div>
      </div>

      <?php  if ($loggedin) : ?>

      <div class="secure-container" style="display: block;">        
          <form id="form-pcapredict-save" enctype="multipart/form-data" action="<?php echo $action . '&save'; ?>" method="POST">
              <fieldset>
                  <!-- logo -->
                  <div class="row" style="text-align: center; margin-top: 40px;">
                      <div class="pca-logo"></div>
                      <input id="hostname" name="hostname" type="text" style="display:none;"></input>
                  </div>

                  <div class="separator"></div>
                  
                  <!-- Account code label -->
                  <div class="row rowset" style="font-size: 16px;">
                  
                      <div class="col-xs-6 col-sm-3">
                          <label><b><?php echo $account_code_label ?></b></label>
                      </div>
                      <div class="col-xs-6 col-sm-3">
                          <label><?php echo strtoupper($account_code); ?></label>
                      </div>

                      <!-- Hidden token for debug -->
                      <label id="token" name="token" style="display: none;"><?php echo $pca_token; ?></label>
                  </div>

                  <div class="row rowset">
                    <div class="col-xs-6 col-sm-3" style="font-size: 16px;">
                      <label><b><?php echo $status_label ?></b></label>
                    </div>
                    <div class="col-xs-6 col-sm-3">
                      <?php if (intval($status) == 1) : ?>
                        <div class="switch switch-left switch--on"><span>ON</span></div><div class="switch switch-right switch--off"><span>OFF</span></div>
                        <input id="status" name="status" type="checkbox" checked="checked" style="display: none;" />
                      <?php else : ?>
                        <div class="switch switch-left switch--off"><span>ON</span></div><div class="switch switch-right switch--on"><span>OFF</span></div>
                        <input id="status" name="status" type="checkbox" style="display: none;" />
                      <?php endif; ?>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <label class="deactivate-message"><?php echo $status_description; ?></label>
                    </div>
                  </div>

                    <!-- Javascript -->
                    <div class="row rowset">
                        <div class="col-xs-12">
                            <label class="customjs-label"><?php echo $custom_javascript_frontend_label ?></label>
                            <textarea name="custom_javascript_frontend" id="custom_javascript_frontend"><?php echo $custom_javascript_frontend; ?></textarea>          
                            <comment><?php echo $custom_javascript_frontend_description ?></comment>
                        </div>
                    </div>
                    <div class="row rowset">
                        <div class="col-xs-12">
                            <label class="customjs-label"><?php echo $custom_javascript_backend_label ?></label>
                            <textarea name="custom_javascript_backend" id="custom_javascript_backend"><?php echo $custom_javascript_backend; ?></textarea>          
                            <comment><?php echo $custom_javascript_backend_description ?></comment>
                        </div>
                    </div>

                  <div class="row rowset">
                      <div class="col-xs-12">
                          <!-- Save button -->
                          <button class="button-light" id="btnSave" type="submit" form="form-pcapredict-save" value="Save"><?php echo $button_save; ?></button>
                          <!-- Link to account section -->
                          <button style="float:right;" class="button-dark" onclick="window.open('https://account.pcapredict.com', '_blank')" id="btnAccount" type="button" value="ViewMyAccount"><?php echo $button_account; ?></button>
                      </div>
                      </div>
                  </div>
              </fieldset>
            </form>

            <form id="form-pcapredict-logout" enctype="multipart/form-data" action="<?php echo $action . '&logout'; ?>" method="POST">
              <fieldset>
                  <div class="separator"></div>

                  <!-- Logout button -->
                  <div class="row rowset" style="margin-bottom: 20px;">
                      <div class="col-xs-3">
                          <button class="button-light" id="btnLogOut" type="submit" form="form-pcapredict-logout" value="Log Out"><?php echo $button_logout; ?></button>
                      </div>
                      <div class="col-xs-9">
                          <comment><?php echo $logout_description; ?></comment>
                      </div>
                  </div>
              </fieldset>
          </form>
      </div>

      <?php else : ?>

      <div class="secure-container" style="display: block;">
          <form id="form-pcapredict-login" enctype="multipart/form-data" action="<?php echo $action . '&login'; ?>" method="POST">
              <fieldset>
                  <!-- logo -->
                  <div class="row" style="text-align: center; margin-top: 40px;">
                      <div class="pca-logo"></div>
                      <input id="hostname" name="hostname" type="text" style="display:none;"></input>
                  </div>

                  <div class="separator"></div>
                  
                  <!-- Account code label -->
                  <div class="row rowset" style="font-size: 14px;">
                      <p><?php echo $login_description_1 ?></p>
                      <p><?php echo $login_description_2 ?></p>
                  </div>

                  <div class="row rowset">
                      <div class="col-xs-3">
                          <label><?php echo $account_code_label ?></label>
                      </div>
                      <div class="col-xs-5">
                          <input type="text" name="account_code" id="account_code" placeholder="<?php echo $account_code_label ?>" >
                      </div>
                      <div class="col-xs-4">             
                          <comment></comment>
                      </div>
                  </div>

                  <div class="row rowset">
                      <div class="col-xs-3">
                          <label><?php echo $password_label ?></label>
                      </div>
                      <div class="col-xs-5">
                          <input type="password" name="password" id="password" placeholder="<?php echo $password_label ?>" >
                          <a class="external-link" href="<?php echo $link_password_href; ?>" target="_blank"><?php echo $link_password_text; ?></a>
                      </div>
                      <div class="col-xs-4">             
                          <comment></comment>
                      </div>                    
                  </div>

                  <div class="row rowset">
                      <div class="col-xs-3">
                          <button class="button-dark" id="btnLogIn" type="submit" form="form-pcapredict-login" value="Log in"><?php echo $button_login; ?></button>
                      </div>                    
                  </div> 

                  <div style="margin-top: 25px;" class="secure-container-footer">
                      
                  </div>           
              </fieldset>
          </form>
      </div>

      <?php endif; ?>
  </div>
</div>

<?php echo $footer; ?>