<?php

class ControllerModulePcapredict extends Controller {
    
    private $error = array();

    public function index() {

        $this->load->language('module/pcapredict');

        $this->document->setTitle($this->language->get('heading_title'));
        $this->document->addStyle('view/stylesheet/module/tag.css');
        $this->document->addScript('view/javascript/module/script.js');

        $this->load->model('setting/setting');
        
        if ($this->validate()){
            if ($this->request->server['REQUEST_METHOD'] == 'POST') {

                if (isset($this->request->get['login'])) 
                {
                    $accountCode = $_POST['account_code'];

                    //Make call to pca and setup keys if needs be.

                    $data_string = json_encode(array('accountcode' => $accountCode, 
                                            'password' => $_POST['password'],
                                            'deviceDescription' => 'OpenCart | ' . $_POST['hostname'],
                                            'deviceType' => 1));

                    $auth_curl = curl_init('https://app_api.pcapredict.com/api/primaryaccountauthorisation');                                                                      
                    curl_setopt($auth_curl, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
                    curl_setopt($auth_curl, CURLOPT_POSTFIELDS, $data_string);                                                                  
                    curl_setopt($auth_curl, CURLOPT_RETURNTRANSFER, true);                                                                      
                    curl_setopt($auth_curl, CURLOPT_HTTPHEADER, array(                                                                          
                        'Content-Type: application/json',                                                                                
                        'Content-Length: ' . strlen($data_string))                                                                       
                    );
                                                                                                                                        
                    $authTokenData = curl_exec($auth_curl);

                    if ($authTokenData) {

                        $decoded = json_decode($authTokenData, true);

                        $decodedToken = $decoded['token']['token'];

                        $data_string = json_encode(array('generateAddress' => true));

                        $license_curl = curl_init('https://app_api.pcapredict.com/api/apps/opencart/0.0.1/licences');                                                                      
                        curl_setopt($license_curl, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
                        curl_setopt($license_curl, CURLOPT_RETURNTRANSFER, true); 
                        curl_setopt($license_curl, CURLOPT_POSTFIELDS, $data_string); 
                        curl_setopt($license_curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                        curl_setopt($license_curl, CURLOPT_USERPWD, $accountCode . ":" . $decodedToken);
                        curl_setopt($license_curl, CURLOPT_HTTPHEADER, array(                                                                          
                            'Content-Type: application/json',
                            'Content-Length: ' . strlen($data_string)   
                        ));
                                                                                                                                            
                        $created = curl_exec($license_curl);

                        if ($created) 
                        {
                            if (curl_getinfo($license_curl, CURLINFO_HTTP_CODE) == 401)
                            {
                                $data['status_message'] = $this->language->get('license_http_status_401');
                            } 
                            else if (curl_getinfo($license_curl, CURLINFO_HTTP_CODE) == 200) 
                            {
                                $data['status_message'] = $this->language->get('license_http_status_200');
                            }
                            
                            // HELP NOTE : Make sure any settings you pass in the array to the settings are prepended with the same name as the module...
                            // This stumped me for ages!
                            $storageSettings = array();
                            $storageSettings['pcapredict_status'] = 1;
                            $storageSettings['pcapredict_pca_token'] = $decodedToken;
                            $storageSettings['pcapredict_account_code'] = $accountCode;
                            $storageSettings['pcapredict_custom_javascript'] = '';
                            $this->model_setting_setting->editSetting('pcapredict', $storageSettings);
                        } 
                        else 
                        {
                            $data['status_message'] = $this->language->get('http_status_other');
                        }

                        curl_close($license_curl);
                    }
                    else 
                    {
                        if (curl_getinfo($auth_curl, CURLINFO_HTTP_CODE) == 401)
                        {
                            $data['status_message'] = $this->language->get('login_http_status_401');
                        } 
                        else 
                        {
                            $data['status_message'] = $this->language->get('http_status_other');
                        }
                    }

                    curl_close($auth_curl); 
                }
                else if (isset($this->request->get['save']))
                {
                    $status = isset($_POST['status']) ? 1 : 0;

                    $storageSettings = $this->model_setting_setting->getSetting('pcapredict');
                    $storageSettings['pcapredict_status'] = $status;
                    $storageSettings['pcapredict_custom_javascript'] = $_POST['custom_javascript'];

                    $this->model_setting_setting->editSetting('pcapredict', $storageSettings);
                }
                else if (isset($this->request->get['logout'])) 
                {
                    $storageSettings = $this->model_setting_setting->getSetting('pcapredict');

                    $accountcode = $storageSettings['pcapredict_account_code'];
                    $token = $storageSettings['pcapredict_pca_token'];

                    $logout_curl = curl_init('https://app_api.pcapredict.com/api/authtoken');                                                                      
                    curl_setopt($logout_curl, CURLOPT_CUSTOMREQUEST, "DELETE");                                                                     
                    curl_setopt($logout_curl, CURLOPT_RETURNTRANSFER, true); 
                    curl_setopt($logout_curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                    curl_setopt($logout_curl, CURLOPT_USERPWD, $accountcode . ":" . $token);
                                                                                                                                        
                    $loggedout = curl_exec($logout_curl);

                    $this->model_setting_setting->editSetting('pcapredict', array());

                    curl_close($logout_curl);
                }
            }
        }

        // send error if there is one.
        if (isset($this->error['warning'])){
            $data['status_message'] = $this->error['warning'];
        }

        $settings = $this->model_setting_setting->getSetting('pcapredict');

        // Load settings.
        if ($settings && count($settings) > 0) {
            $data['account_code'] = $settings['pcapredict_account_code'];
            $data['pca_token'] = $settings['pcapredict_pca_token'];
            $data['custom_javascript'] = $settings['pcapredict_custom_javascript'];
            $data['status'] = $settings['pcapredict_status'];
            $data['loggedin'] = true;
        } else {
            $data['account_code'] = '';
            $data['pca_token'] = '';
            $data['custom_javascript'] = '';
            $data['loggedin'] = false;
        }

        // Action url's to callback to this controller
        $data['action'] = $this->url->link('module/pcapredict', 'token=' . $this->session->data['token'], 'SSL');
        $data['cancel'] = $this->url->link('extension/module', 'token=' . $this->session->data['token'], 'SSL');
        
        // Button and link text.
        $data['button_save'] = $this->language->get('button_save');
        $data['button_account'] = $this->language->get('button_account');
        $data['button_logout'] = $this->language->get('button_logout');
        $data['button_login'] = $this->language->get('button_login');
        
        $data['link_register'] = $this->language->get('link_register');
        $data['link_password'] = $this->language->get('link_password');
        
        // Breadcrumbs
        $data['breadcrumbs'] = array();
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_home'),
            'href' => $this->url->link('common/home', 'token=' . $this->session->data['token'], 'SSL')
        );
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('text_module'),
            'href' => $this->url->link('extension/module', 'token=' . $this->session->data['token'], 'SSL')
        );
        $data['breadcrumbs'][] = array(
            'text' => $this->language->get('heading_title'),
            'href' => $this->url->link('module/pcapredict', 'token=' . $this->session->data['token'], 'SSL')
        );

        // Other page areas.
        $data['header'] = $this->load->controller('common/header');
        $data['column_left'] = $this->load->controller('common/column_left');
        $data['footer'] = $this->load->controller('common/footer');

        $output = $this->load->view('module/pcapredict.tpl', $data);
        
        $this->response->setOutput($output);
    }

	protected function validate() {

		if (!$this->user->hasPermission('modify', 'module/pcapredict')) {
			$this->error['warning'] = $this->language->get('error_permission');
            return false;
		}        
		return true;
    }
}