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
                <li>
                    <a href="<?php echo $breadcrumb['href']; ?>">
                        <?php echo $breadcrumb['text']; ?>
                    </a>
                </li>
                <?php } ?>
            </ul>
        </div>
    </div>

    <div class="page-content container-fluid">
        <div class="addressy-container">
            <div class="addressy-message-container">
                <div class="addressy-message <?php if (isset($status_message_type)) { echo $status_message_type; } ?>"><?php echo isset($status_message) ? $status_message : ''; ?></div>
            </div>

            <div class="box-frame">

                <?php  if ($loggedin) : ?>

                <form id="form-addressy-save" enctype="multipart/form-data" action="<?php echo $action . '&save'; ?>" method="POST">
                    <fieldset>
                        <!-- logo -->
                        <div class="row">
                            <div class="addressy-logo"></div>
                            <input id="hostname" name="hostname" type="text" style="display:none;"></input>
                        </div>

                        <div class="separator"></div>

                        <!-- Email Address label -->
                        <div class="row rowset">

                            <div class="col-xs-12 col-sm-3">
                                <label><b><?php echo $email_address_label ?></b></label>
                            </div>
                            <div class="col-xs-12 col-sm-3">
                                <label><?php echo $email_address; ?></label>
                            </div>

                            <!-- Hidden token for debug -->
                            <label id="token" name="token" style="display: none;"><?php echo $addressy_token; ?></label>
                            <label id="accountcode" name="accountcode" style="display: none;"><?php echo $account_code; ?></label>
                        </div>

                        <div class="row rowset">
                            <div class="col-xs-12 col-sm-3">
                                <label><b><?php echo $status_label ?></b></label>
                            </div>
                            <div class="col-xs-12 col-sm-3" style="font-size: 0;">
                                <?php if (intval($status) == 1) : ?>
                                <div class="switch switch-left switch--on"><span>ON</span></div>
                                <div class="switch switch-right switch--off"><span>OFF</span></div>
                                <input id="status" name="status" type="checkbox" checked="checked" style="display: none;" />
                                <?php else : ?>
                                <div class="switch switch-left switch--off"><span>ON</span></div>
                                <div class="switch switch-right switch--on"><span>OFF</span></div>
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
                                <comment>
                                    <?php echo $custom_javascript_frontend_description ?>
                                </comment>
                            </div>
                        </div>
                        <div class="row rowset">
                            <div class="col-xs-12">
                                <label class="customjs-label"><?php echo $custom_javascript_backend_label ?></label>
                                <textarea name="custom_javascript_backend" id="custom_javascript_backend"><?php echo $custom_javascript_backend; ?></textarea>
                                <comment>
                                    <?php echo $custom_javascript_backend_description ?>
                                </comment>
                            </div>
                        </div>

                        <div class="row rowset">
                            <div class="col-xs-12">
                                <!-- Save button -->
                                <button class="button-light" id="btnSave" type="submit" form="form-addressy-save" value="Save"><?php echo $button_save; ?></button>
                                <!-- Link to account section -->
                                <button style="float:right;" class="button-dark" onclick="window.open('https://account.addressy.com', '_blank')" id="btnAccount"
                                    type="button" value="ViewMyAccount"><?php echo $button_account; ?></button>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <form id="form-addressy-logout" enctype="multipart/form-data" action="<?php echo $action . '&logout'; ?>" method="POST">
                    <fieldset>
                        <div class="separator"></div>
                        <!-- Logout button -->
                        <div class="row rowset">
                            <div class="col-xs-12 col-sm-3">
                                <button class="button-light" id="btnLogOut" type="submit" form="form-addressy-logout" value="Log Out"><?php echo $button_logout; ?></button>
                            </div>
                            <div class="col-xs-12 col-sm-9">
                                <comment>
                                    <?php echo $logout_description; ?>
                                </comment>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <?php else : ?>

                <form id="form-addressy-login" enctype="multipart/form-data" action="<?php echo $action . '&login'; ?>" method="POST">
                    <fieldset>
                        <!-- logo -->
                        <div class="row">
                            <div class="addressy-logo"></div>
                            <input id="hostname" name="hostname" type="text" style="display:none;"></input>
                        </div>

                        <div class="separator"></div>

                        <!-- Account code label -->
                        <div class="row rowset">
                            <div class="col-xs-12">
                                <p>
                                    <?php echo $login_description_1 ?>
                                </p>
                                <p>
                                    <?php echo $login_description_2 ?>
                                </p>
                            </div>
                        </div>

                        <div class="row rowset">
                            <div class="col-xs-3">
                                <label><?php echo $email_address_label ?></label>
                            </div>
                            <div class="col-xs-5">
                                <input type="text" name="email_address" id="email_address" placeholder="<?php echo $email_address_label ?>">
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
                                <input type="password" name="password" id="password" placeholder="<?php echo $password_label ?>">
                                <a class="external-link" href="<?php echo $link_password_href; ?>" target="_blank">
                                    <?php echo $link_password_text; ?>
                                </a>
                            </div>
                            <div class="col-xs-4">
                                <comment></comment>
                            </div>
                        </div>

                        <div class="row rowset">
                            <div class="col-xs-3">
                                <button class="button-dark" id="btnLogIn" type="submit" form="form-addressy-login" value="Log in"><?php echo $button_login; ?></button>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php echo $footer; ?>