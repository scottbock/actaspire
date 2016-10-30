<?php

/**
 * Access terms associated with a taxonomy
 */
class WP_REST_Email_Controller extends WP_REST_Controller {

    const TAX_USER = 'kris.kroona@actaspire.org';
    const TAX_PASS = 'Waldo0621';


	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route( 'wp/v2', '/sendEmail/', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'send_email' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' )
			)
		));

        register_rest_route( 'wp/v2', '/validateAddress/', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'validate_address' ),
                'permission_callback' => array( $this, 'get_items_permissions_check' )
            )
        ));

        register_rest_route( 'wp/v2', '/calculateTax/', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'calculate_tax' ),
                'permission_callback' => array( $this, 'get_items_permissions_check' )
            )
        ));

        register_rest_route( 'wp/v2', '/uploadCert/', array(
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'upload_cert' ),
                'permission_callback' => array( $this, 'get_items_permissions_check' )
            )
        ));

	}

    function write_log ( $log )  {
        if ( is_array( $log ) || is_object( $log ) ) {
            error_log( print_r( $log, true ) );
        } else {
            error_log( $log );
        }
    }


    function CallAPI($method, $url, $auth, $data = false)
    {
        $curl = curl_init();

        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data)
                    $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        // Optional Authentication:
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, $auth);

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);

        curl_close($curl);

        return json_decode($result);
    }

    public function upload_cert( $request ){
        $parameters = $request->get_file_params();

        $uploaddir = realpath('./') . '/';
        $uploadfile = $uploaddir . basename($parameters['file']['name']);

        $this->write_log('attempt from ' . $parameters['file']['tmp_name']);
        $this->write_log('attempt move ' . $uploadfile);

        if (move_uploaded_file($parameters['file']['tmp_name'], $uploadfile)) {
            $this->write_log($uploadfile);
        } else {
            $this->write_log('Error writing file');
        }


        $url = 'https://api.certcapture.com/v2/certificates';


        //TODO: just send the temp file??

        $data = array('filename' => $parameters['file']['name'],'file_contents'=>'@'.$uploadfile);

        $response = $this->CallAPI(
            'POST',
            $url,
            self::CERT_USER . ':' . self::CERT_PASS,
            $data
        );

        return rest_ensure_response( $response );

        //TODO: find customer or create customer
        //TODO: assign cert to customer
    }

    public function calculate_tax( $request ){

//        $url = 'https://development.avalara.net/1.0/tax/get';
        $url = 'https://avatax.avalara.net/1.0/tax/get';

        $fields = array(
            'Commit' => $request['Commit'],
            'CustomerCode' => $request['CustomerCode'],
            'Addresses' => $request['Addresses'],
            'Lines' => $request['Lines']
        );

        $data = json_encode($fields);

        $response = $this->CallAPI(
            'POST',
            $url,
            self::TAX_USER . ':' . self::TAX_PASS,
            $data
        );

        return rest_ensure_response( $response );
    }

    public function validate_address( $request ){

//        $url = 'https://development.avalara.net/1.0/address/validate';
        $url = 'https://avatax.avalara.net/1.0/address/validate';

        $url = $url . '?Line1=' . urlencode($request['Line1']);
        if(!empty($request['Line2'])) {
            $url = $url . '&Line2=' . urlencode($request['Line2']);
        }
        $url = $url . '&City=' . urlencode($request['City']);
        $url = $url . '&Region=' . urlencode($request['Region']);
        $url = $url . '&PostalCode=' . urlencode($request['PostalCode']);


        $response = $this->CallAPI(
            'GET',
            $url,
            self::TAX_USER . ':' . self::TAX_PASS,
            false
        );

        return rest_ensure_response( $response );
    }

	public function send_email( $request ){

		//Send email to orderer
  		$to = $request['clientEmail']; 
  		$subject = 'Act Aspire Order Confirmation';
  		$message = $request['message'];
  		$headers = '';//'Content-Type: text/html; charset=UTF-8';
  		$attachments = '';
  
  		$success = wp_mail( $to, $subject, $message, $headers, $attachments );

  		//Make CSV File
		$csvFileName = $request['csvFileName'];
		$attachment = fopen($csvFileName , "w") or die("Unable to open file!");
		fwrite($attachment, str_replace("\\\"", "\"", $request['csv']));
		fclose($attachment);

		//Send email to order Inbox
  		$to2 = $request['orderInbox']; 
  		$subject2 = 'Act Aspire Order Confirmation';
  		$message2 = $request['message'];
  		$bcc2 = 'BCC: ' . $request['orderBcc'];
  		$headers2 = array(
  			//'Content-Type: text/html; charset=UTF-8',
		    $bcc2
		);

        $parameters = $request->get_file_params();

        $uploaddir = realpath('./') . '/';
        $uploadfile = $uploaddir . basename($parameters['file']['name']);

        $this->write_log('attempt from ' . $parameters['file']['tmp_name']);
        $this->write_log('attempt move ' . $uploadfile);

        if (move_uploaded_file($parameters['file']['tmp_name'], $uploadfile)) {
            $this->write_log($uploadfile);
        } else {
            $this->write_log('Error writing file');
        }

  		$attachments2 = array($uploadfile, $csvFileName);

  		$success2 = wp_mail( $to2, $subject2, $message2, $headers2, $attachments2 );

  		//Delete CSV File
		unlink($csvFileName);	

  		$response = array(
  			'clientSuccess' => $success, 
  			'orderInboxSuccess' => $success2
  		);

  		//Write couponUses.json
  		if(!empty($request['couponUses'])){
	  		$myfile = fopen("orderForm/dist/json/couponUses.json", "w") or die("Unable to open file!");
			fwrite($myfile, $request['couponUses']);
			fclose($myfile);
		}

  		return rest_ensure_response( $response );
	}

	public function get_items_permissions_check( $request ) {
		return true;
	}
}
