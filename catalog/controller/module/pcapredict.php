<?php
class ControllerModulePcapredict extends Controller {

    public function index() {

        $this->load->language('module/pcapredict');
		
        $data['account_code'] = $this->config->get('pcapredict_account_code');
        $data['custom_javascript'] = $this->config->get('pcapredict_custom_javascript');
 
        if (file_exists(DIR_TEMPLATE . $this->config->get('config_template') . '/template/module/pcapredict.tpl')) {
            return $this->load->view($this->config->get('config_template') . '/template/module/pcapredict.tpl', $data);
        } else {
            return $this->load->view('default/template/module/pcapredict.tpl', $data);
        }
    }
}
