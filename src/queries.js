import { gql } from "@apollo/client";

//mutation para que el usuario se loggee
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

//mutation RecoveryCode
export const RECOVERY_CODE = gql`
  mutation RecoveryCode($username: String!, $email: String!) {
    recoveryCode(username: $username, email: $email) {
      status
    }
  }
`;
//mutation change password
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword(
    $username: String!
    $recoveryCode: String!
    $newPassword: String!
  ) {
    changePassword(
      username: $username
      recovery_code: $recoveryCode
      new_password: $newPassword
    ) {
      status
    }
  }
`;

//query para traer el username
export const GET_USERNAME = gql`
  query user($user_id: String!) {
    user(user_id: $user_id) {
      username
    }
  }
`;
//query para traerme el user con el que me logueo
export const GET_USER = gql`
  query User($userId: String) {
    user(user_id: $userId) {
      user_id
      username
      email
      belong_id
      type
      assigned_to
      mono
    }
  }
`;

//query para traer las branches y mas info de la compañia
export const GET_COMPANY_DETAIL = gql`
  query Query($company_id: String) {
    company(company_id: $company_id) {
      company_id
      name
      location
      custom_checks {
        mandatory
        name
      }
      branches {
        branch_id
        name
        address
        type
        owned

        status
      }
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          recursive
          calibrate
          dash_report
          dash_intransit
          dash_control
          recursive
          geolocation
        }
        type
      }
      billing
      contact_info
      created
      last_modified
      status
      distributor_id
      users_id
      barcode
      bra_counter
      ope_counter
      shi_counter
      alert_params {
        temperature_alerts {
          name
          max
          min
        }
        acceleration_alerts {
          name
          value
        }
      }
      language
      gmt
      hired_services
      free_operators {
        access_to {
          checkpoint
          dash_control
          calibrate
          dash_intransit
          dash_report
          receive
          recursive
          send
          geolocation
        }
        code
        created
        last_modified
        mail
        name
        operator_id
        status
        type
      }
    }
  }
`;

//traer opes
export const GET_COMPANY_OPES = gql`
  query Query($company_id: String) {
    company(company_id: $company_id) {
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          recursive
          calibrate
          dash_report
          dash_intransit
          dash_control
          recursive
          geolocation
        }
        type
      }
    }
  }
`;
//traigo responsibles

//traigo alertparams
export const GET_COMPANY_ALERT_PARAMS = gql`
  query Query($companyId: String) {
    company(company_id: $companyId) {
      alert_params {
        temperature_alerts {
          name
          max
          min
        }
        acceleration_alerts {
          name
          value
        }
      }
    }
  }
`;
//query para traer los content de un shipment
export const GET_SHIPMENT_DETAIL = gql`
  query shipment($shipment_id: String!) {
    shipment(shipment_id: $shipment_id) {
      shipment_id
      origin_id
      destination_id
      departure
      arrival
      status
      origin_op_id
      destination_op_id
      checkpoints {
        responsible_id
        responsible_name
        location
        timestamp
        temperature
        label
      }
      temperature_readings {
        value
        timestamp
        counter
        cv
      }
      temperature_range {
        name
        max
        min
      }
      acceleration {
        x
        y
        z
        timestamp
        counter
      }

      contents {
        id
      }
      intrusions {
        init_counter
        final_counter
        init_timestamp
        final_timestamp
      }
      alerts {
        value
        type
        timestamp
      }
      comments {
        text
        author
      }
    }
  }
`;

//query para traer los content de un shipment
export const GET_SHIPMENT_COMMENTS = gql`
  query shipment($shipment_id: String!) {
    shipment(shipment_id: $shipment_id) {
      shipment_id
      origin_id
      destination_id
      departure
      arrival
      origin_op_id
      comments {
        text
        author
        date
      }
    }
  }
`;

//query para traer shipment por qr

export const GET_SHIPMENTS = gql`
  query shipments($in_transit: Boolean!) {
    shipment(in_transit: $in_transit) {
      selectedItems {
        shipment_id
        company_id
        qr
      }
    }
  }
`;

//query para traerme shipments paginados
export const GET_SHIPMENTS_PAG = gql`
  query shipments(
    $in_transit: Boolean!
    $company_id: String
    $status: ShipStatus
    $from_date: Date
    $to_date: Date
    $origin_id: String
    $origin_op_id: String
    $destination_id: String
    $destination_op_id: String
    $item_id: String
    $qr: String
    $page: Int
    $per_page: Int
    $shipment_id: String
  ) {
    shipments(
      in_transit: $in_transit
      company_id: $company_id
      status: $status
      from_date: $from_date
      to_date: $to_date
      origin_id: $origin_id
      origin_op_id: $origin_op_id
      destination_id: $destination_id
      destination_op_id: $destination_op_id
      item_id: $item_id
      qr: $qr
      page: $page
      per_page: $per_page
      shipment_id: $shipment_id
    ) {
      total
      per_page
      page
      selectedItems {
        shipment_id
        company_id
        unique_shipment_id
        shippers_id
        qr
        type
        temperature_readings {
          value
          cv
          timestamp
          counter
        }
        acceleration {
          x
          y
          z
          timestamp
          counter
        }
        intrusions {
          init_counter
          init_timestamp
          final_counter
          final_timestamp
        }
        intrusion
        battery_level {
          departure
          arrival
        }
        alerts {
          type
          value
          x
          y
          z
          timestamp
        }
        alerts_flags
        origin_id
        origin_op_id
        destination_id
        destination_op_id
        contents {
          id
        }
        departure
        arrival
        status
        checkpoints {
          responsible_id
          responsible_name
          timestamp
          location
          temperature
          battery_level
          label
        }

        last_geolocation {
          geo_id
          lng
          lat
          timestamp
          temperature
          intrusion
        }
        comments {
          text
          author
          date
        }
        temperature_range {
          name
          max
          min
        }
        offset
      }
    }
  }
`;
//shipments to header report table
export const GET_SHIPMENTS_PAG_TO_HEADER = gql`
  query shipments(
    $in_transit: Boolean!
    $company_id: String
    $status: ShipStatus
    $from_date: Date
    $to_date: Date
    $origin_id: String
    $origin_op_id: String
    $destination_id: String
    $destination_op_id: String
    $item_id: String
    $qr: String
    $page: Int
    $per_page: Int
    $shipment_id: String
    $branch_id: String
    $operator_id: String
    $temperature_range: String
  ) {
    shipments(
      in_transit: $in_transit
      company_id: $company_id
      status: $status
      from_date: $from_date
      to_date: $to_date
      origin_id: $origin_id
      origin_op_id: $origin_op_id
      destination_id: $destination_id
      destination_op_id: $destination_op_id
      item_id: $item_id
      qr: $qr
      page: $page
      per_page: $per_page
      shipment_id: $shipment_id
      branch_id: $branch_id
      operator_id: $operator_id
      temperature_range: $temperature_range
    ) {
      total
      per_page
      page
      selectedItems {
        shipment_id
        company_id
        unique_shipment_id
        shippers_id
        qr
        type
        origin_id
        origin_op_id
        destination_id
        destination_op_id
        departure
        arrival
        status
        temperature_range {
          name
          max
          min
        }
        offset
      }
    }
  }
`;
//query para traer shipments y asociarlo con devices

export const GET_SHIPMENTS_PAG2 = gql`
  query shipments(
    $in_transit: Boolean!
    $company_id: String!
    $from_date: Date
    $to_date: Date
    $status: ShipStatus
    $origin_id: String
    $origin_op_id: String
    $destination_id: String
    $destination_op_id: String
    $item_id: String
    $page: Int
    $per_page: Int
  ) {
    shipments(
      in_transit: $in_transit
      company_id: $company_id
      from_date: $from_date
      to_date: $to_date
      status: $status
      origin_id: $origin_id
      origin_op_id: $origin_op_id
      destination_id: $destination_id
      destination_op_id: $destination_op_id
      item_id: $item_id
      page: $page
      per_page: $per_page
    ) {
      total
      selectedItems {
        qr: qr
        shipment_id
      }
    }
  }
`;
//query para  comparar shipments
export const GET_SHIPMENTS_TO_COMPARE = gql`
  query ShipmentsToCompare($shipments_ids: [String!]!, $company_id: String!) {
    shipmentsToCompare(shipments_ids: $shipments_ids, company_id: $company_id) {
      shipment_id
      temperature_readings {
        value
        timestamp
        counter
      }
    }
  }
`;
//subscription para viajes creados
export const SHIPMENTS_CREATED_SUBSCRIPTION = gql`
  subscription {
    shipmentAdded {
      shipment_id
      status
      qr
      departure
    }
  }
`;

//subscription para viajes cerrados
export const SHIPMENTS_UPDATED_SUBSCRIPTION = gql`
  subscription {
    shipmentUpdated {
      shipment_id
      status
      qr
      departure
      origin_id
      alerts {
        type
      }
    }
  }
`;

//subscription para checkpoints
export const SHIPMENTS_CHECKPOINTS_SUBSCRIPTION = gql`
  subscription ShipmentChecked {
    shipmentChecked {
      acceleration {
        x
        y
        z
        timestamp
        counter
      }
      alerts {
        type
        value
        x
        y
        z
        timestamp
        solved
        comments {
          text
          author
          date
        }
      }
      alerts_flags
      arrival
      battery_level {
        departure
        arrival
      }
      checkpoints {
        responsible_id
        responsible_name
        timestamp
        location
        temperature
        battery_level
        label
      }
      comments {
        text
        author
        date
      }
      company_id
      contents {
        id
      }
      departure
      destination_id
      destination_op_id
      geolocations {
        geo_id
        lng
        lat
        timestamp
        temperature
        intrusion
      }
      intrusion
      intrusions {
        init_counter
        init_timestamp
        final_counter
        final_timestamp
      }
      last_geolocation {
        geo_id
        lng
        lat
        timestamp
        temperature
        intrusion
      }
      offset
      origin_id
      origin_op_id
      qr
      shipment_id
      shippers_id
      status
      temperature_range {
        name
        max
        min
      }
      temperature_readings {
        value
        timestamp
        counter
      }
      type
      unique_shipment_id
    }
  }
`;

//query para trae mis usuarios
export const GET_ALL_USERS = gql`
  query users($belong_id: String!) {
    users(belong_id: $belong_id) {
      belong_id
      user_id
      username
      email
      type
      assigned_to
      status
      mono
    }
  }
`;

//query para traerme todos los dispositivos
export const GET_DEVICES = gql`
  query devices($assigned_to: String) {
    devices(assigned_to: $assigned_to) {
      device_id
      qr
      battery_level
      assigned_to
      last_service
      last_location
      sensors
      device_format
      status
      version
      temperature_range {
        max
        min
        name
      }
    }
  }
`;

//query para traerme todos los dispositivos
export const GET_DEVICES_QUANTITY = gql`
  query devices($assigned_to: String) {
    devices(assigned_to: $assigned_to) {
      device_id
    }
  }
`;

//query para editar los datos de la compañia
export const UPDATE_COMPANY = gql`
  mutation UpdateCompany(
    $company_id: String
    $name: String
    $location: String
    $branches: [UpdateBranchInput!]
    $operators: [UpdateOperatorInput!]
    $billing: String
    $contactInfo: String
    $status: Status
    $barcode: [Barcode]
    $distributorId: String
    $alertParams: AlertParamsInput
    $senseFrequency: [Int!]
    $custom_checks: [CustomCheckInput!]
    $language: Language
    $gmt: String
  ) {
    updateCompany(
      company_id: $company_id
      name: $name
      location: $location
      branches: $branches
      operators: $operators
      billing: $billing
      contact_info: $contactInfo
      status: $status
      barcode: $barcode
      distributor_id: $distributorId
      alert_params: $alertParams
      sense_frequency: $senseFrequency
      custom_checks: $custom_checks
      language: $language
      gmt: $gmt
    ) {
      users_id
      status
      shi_counter
      sense_frequency
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      ope_counter
      name
      location
      last_modified
      language
      gmt
      free_operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      distributor_id
      custom_checks {
        name
        mandatory
      }
      created
      contact_info
      company_id
      branches {
        branch_id
        name
        address
        type
        owned
        created
        last_modified
        status
      }
      bra_counter
      billing
      barcode
      alert_params {
        temperature_alerts {
          name
          max
          min
        }
        acceleration_alerts {
          name
          value
        }
      }
    }
  }
`;
export const UPDATE_TEMP_ALERT_PARAMS = gql`
  mutation UpdateCompany($company_id: String, $alert_params: AlertParamsInput) {
    updateCompany(company_id: $company_id, alert_params: $alert_params) {
      company_id
      alert_params {
        temperature_alerts {
          max
          min
          name
        }
      }
    }
  }
`;
export const UPDATE_ACC_ALERT_PARAMS = gql`
  mutation UpdateCompany($company_id: String, $alert_params: AlertParamsInput) {
    updateCompany(company_id: $company_id, alert_params: $alert_params) {
      company_id
      alert_params {
        acceleration_alerts {
          name
          value
        }
      }
    }
  }
`;

//query para editar los datos de la compañia siendo sudo
export const UPDATE_COMPANY_SUDO = gql`
  mutation UpdateCompany(
    $companyId: String
    $name: String
    $location: String
    $branches: [UpdateBranchInput!]
    $operators: [UpdateOperatorInput!]
    $billing: String
    $contact_info: String
    $status: Status!
    $barcode: [Barcode]
    $distributorId: String
    $alert_arams: AlertParamsInput
  ) {
    updateCompany(
      company_id: $companyId
      name: $name
      location: $location
      branches: $branches
      operators: $operators
      billing: $billing
      contact_info: $contact_info
      status: $status
      barcode: $barcode
      distributor_id: $distributorId
      alert_params: $alert_params
    ) {
      company_id
      name
      location
      branches {
        branch_id
        name
        address
        type
        owned
        created
        last_modified
        status
      }
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          dash_report
          dash_intransit
          dash_control
          geolocation
        }
        type
      }
      billing
      contact_info
      created
      last_modified
      status
      distributor_id
      users_id
      barcode
      bra_counter
      ope_counter
      shi_counter
      alert_params {
        acceleration_alerts {
          name
          value
        }
        temperature_alerts {
          max
          min
          name
        }
      }
      language
      gmt
    }
  }
`;

//mutation para updatear user
export const UPDATE_USER = gql`
  mutation updateUser(
    $user_id: String!
    $username: String
    $email: String
    $assigned_to: String
  ) {
    updateUser(
      user_id: $user_id
      username: $username
      email: $email
      assigned_to: $assigned_to
    ) {
      user_id
      username
      email
      type
    }
  }
`;

//mutation para asignar usuario
export const ASSIGN_USER = gql`
  mutation assignUser($user_id: String!, $assigned: String!) {
    assignUser(user_id: $user_id, assigned: $assigned) {
      user_id
      assigned_to
    }
  }
`;

//mutation para crear user
export const CREATE_USER = gql`
  mutation createUser(
    $belong_id: String!
    $username: String!
    $email: String!
    $assigned: String!
    $password: String!
  ) {
    createUser(
      belong_id: $belong_id
      username: $username
      email: $email
      assigned: $assigned
      password: $password
    ) {
      user_id
      username
    }
  }
`;

//mutation para eliminar usuario
export const DELETE_USER = gql`
  mutation deleteUser($user_id: String!) {
    deleteUser(user_id: $user_id) {
      user_id
    }
  }
`;

//query para traerme todas las compañias
export const GET_COMPANIES = gql`
  query Companies($belong_id: String) {
    companies(belong_id: $belong_id) {
      users_id
      status
      shi_counter
      sense_frequency
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      ope_counter
      name
      location
      last_modified
      language
      gmt
      free_operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      distributor_id
      custom_checks {
        name
        mandatory
      }
      created
      contact_info
      company_id
      branches {
        branch_id
        name
        address
        type
        owned
        created
        last_modified
        status
      }
      bra_counter
      billing
      barcode
      alert_params {
        temperature_alerts {
          name
          max
          min
        }
        acceleration_alerts {
          name
          value
        }
      }
    }
  }
`;

//mutation para updatear device
export const UPDATE_DEVICE = gql`
  mutation updateDevice(
    $device_id: String!
    $qr: String
    $battery_level: Float
    $version: String
    $device_format: DeviceFormat
    $assigned_to: String
    $status: Status!
    $temperature_range: String
    $sensors: [Sensor!]
    $was_serviced: Boolean
  ) {
    updateDevice(
      device_id: $device_id
      qr: $qr
      battery_level: $battery_level
      version: $version
      device_format: $device_format
      assigned_to: $assigned_to
      status: $status
      temperature_range: $temperature_range
      sensors: $sensors
      was_serviced: $was_serviced
    ) {
      device_id
    }
  }
`;

//mutation para crear device
export const CREATE_DEVICE = gql`
  mutation CreateDevice(
    $address: String!
    $qr: String!
    $version: String!
    $device_format: DeviceFormat!
    $sensors: [Sensor!]!
    $assigned_to: String
    $temperature_range: String
    $comment_text: CommentInput
  ) {
    createDevice(
      address: $address
      qr: $qr
      version: $version
      device_format: $device_format
      sensors: $sensors
      assigned_to: $assigned_to
      temperature_range: $temperature_range
      comment_text: $comment_text
    ) {
      device_id
      address
      qr
      battery_level
      battery_usage {
        timestamp
        lvl
      }
      version
      assigned_to
      status
      temperature_range {
        name
        max
        min
      }
      sensors
      device_format
      last_location
      last_service
      last_use
      comments {
        text
        author
        date
      }
    }
  }
`;

//mutation para eliminar device
export const DELETE_DEVICE = gql`
  mutation deleteDevice($device_id: String!) {
    deleteDevice(device_id: $device_id) {
      device_id
    }
  }
`;

//mutation para agregar comentario al shipment
export const ADD_COMMENT = gql`
  mutation addComment($shipment_id: String!, $comment_text: String!) {
    addComment(shipment_id: $shipment_id, comment_text: $comment_text) {
      shipment_id
    }
  }
`;

//query para traerme todos los distribuidores
export const GET_DISTRIBUTORS = gql`
  query distributors {
    distributors {
      distributor_id
      name
      location
      status
      contact_info
      created
      region
      last_modified
      companies_id
      users_id
    }
  }
`;

//mutation para updatear distribuidor
export const UPDATE_DISTRIBUTOR = gql`
  mutation updateDistributor(
    $distributor_id: String!
    $name: String
    $location: String
    $contact_info: String
    $region: String
    $status: Status!
  ) {
    updateDistributor(
      distributor_id: $distributor_id
      name: $name
      location: $location
      contact_info: $contact_info
      region: $region
      status: $status
    ) {
      distributor_id
    }
  }
`;

//mutation para crear el distribuidor
export const CREATE_DISTRIBUTOR = gql`
  mutation createDistributor(
    $name: String!
    $location: String!
    $contact_info: String!
    $region: String!
  ) {
    createDistributor(
      name: $name
      location: $location
      contact_info: $contact_info
      region: $region
    ) {
      distributor_id
    }
  }
`;

//mutation para eliminar el distribuidor
export const DELETE_DISTRIBUTOR = gql`
  mutation deleteDistributor($distributor_id: String!) {
    deleteDistributor(distributor_id: $distributor_id) {
      distributor_id
    }
  }
`;

//mutation para crear compañia
export const CREATE_COMPANY = gql`
  mutation CreateCompany(
    $name: String!
    $location: String!
    $branches: [BranchInput!]!
    $operators: [OperatorInput!]!
    $billing: String!
    $contact_info: String!
    $distributor_id: String
    $barcode: [Barcode]
    $alert_params: AlertParamsInput
    $sense_frequency: [Int!]
    $language: Language
    $gmt: String
  ) {
    createCompany(
      name: $name
      location: $location
      branches: $branches
      operators: $operators
      billing: $billing
      contact_info: $contact_info
      distributor_id: $distributor_id
      barcode: $barcode
      alert_params: $alert_params
      sense_frequency: $sense_frequency
      language: $language
      gmt: $gmt
    ) {
      users_id
      status
      shi_counter
      sense_frequency
      operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      ope_counter
      name
      location
      last_modified
      language
      gmt
      free_operators {
        operator_id
        name
        code
        mail
        created
        last_modified
        status
        access_to {
          send
          receive
          checkpoint
          calibrate
          recursive
          geolocation
          dash_report
          dash_intransit
          dash_control
        }
        type
      }
      distributor_id
      custom_checks {
        name
        mandatory
      }
      created
      contact_info
      company_id
      branches {
        branch_id
        name
        address
        type
        owned
        created
        last_modified
        status
      }
      bra_counter
      billing
      barcode
      alert_params {
        temperature_alerts {
          name
          max
          min
        }
        acceleration_alerts {
          name
          value
        }
      }
    }
  }
`;

//mutation para eliminar compañia
export const DELETE_COMPANY = gql`
  mutation deleteCompany($company_id: String!) {
    deleteCompany(company_id: $company_id) {
      company_id
    }
  }
`;

//query para traerme los comments de los devices
export const GET_DEVICE_COMMENT = gql`
  query device($device_id: String!) {
    device(device_id: $device_id) {
      device_id
      comments {
        text
        author
        date
      }
    }
  }
`;

//mutation para agregar un comment a un device
export const ADD_DEVICE_COMMENT = gql`
  mutation updateDevice($device_id: String!, $comment_text: CommentInput) {
    updateDevice(device_id: $device_id, comment_text: $comment_text) {
      device_id
    }
  }
`;

//query para traerme los operators no asignados
export const GET_FREE_OPERATORS = gql`
  query freeOperators($belong_id: String!, $type: String) {
    freeOperators(belong_id: $belong_id, type: $type) {
      id
      name
    }
  }
`;

//mutation para borrar operadores
export const DELETE_OPERATOR = gql`
  mutation deleteOperator($operator_id: String!) {
    deleteOperator(operator_id: $operator_id) {
      name
    }
  }
`;

//mutation para borrar transportistas
export const DELETE_SHIPPER = gql`
  mutation deleteShipper($shipper_id: String!) {
    deleteShipper(shipper_id: $shipper_id) {
      name
    }
  }
`;

//mutation para borrar calibradores
export const DELETE_CALIBRATOR = gql`
  mutation deleteCalibrator($calibrator_id: String!) {
    deleteCalibrator(calibrator_id: $calibrator_id) {
      name
    }
  }
`;

//query para traerme los barcodes
export const GET_BARCODES2 = gql`
  query barcodes {
    barcodes
  }
`;

export const GET_BARCODES = gql`
  query {
    __type(name: "Barcode") {
      name
      enumValues {
        name
      }
    }
  }
`;

//freeze------------------------------//

export const GET_REFRIGERATIONS = gql`
  query Refrigerations(
    $companyId: String
    $name: String
    $from: Date
    $to: Date
    $qr: String
    $type: String
  ) {
    refrigerations(
      company_id: $companyId
      from: $from
      to: $to
      qr: $qr
      type: $type
      name: $name
    ) {
      company_id
      qr
      gmt
      type
      comments {
        author
        date
        text
      }
      interval
      readings {
        temp
        time
      }
      temperature_range {
        max
        min
        name
      }
      refrigeration_id
      unique_refrigeration_id
      upload_time
      wifi_signal
      name
      comments {
        text
        author
      }
      status
      last_reading {
        time
        temp
      }
      responsible
      alerts {
        type
        value
        x
        y
        z
        timestamp
        solved
        comments {
          text
          author
          date
        }
      }
    }
  }
`;
export const GET_REFRIGERATIONS_QUANTITY = gql`
  query Refrigerations($companyId: String) {
    refrigerations(company_id: $companyId) {
      qr
    }
  }
`;
export const GET_REFRIGERATION = gql`
  query Refrigeration($qr: String!, $from: Date, $to: Date) {
    refrigeration(qr: $qr, from: $from, to: $to) {
      company_id
      gmt
      interval
      qr
      readings {
        temp
        time
      }
      refrigeration_id
      type
      unique_refrigeration_id
      upload_time
      wifi_signal
      name
      comments {
        text
        author
        date
      }
      status
      last_reading {
        time
        temp
      }
      alerts {
        type
        value
        x
        y
        z
        timestamp
        solved

        comments {
          text
          author
          date
        }
      }
      responsible
    }
  }
`;
export const GET_REFRIGERATION_COMMENTS = gql`
  query Refrigeration($qr: String!) {
    refrigeration(qr: $qr) {
      comments {
        author
        date
        text
      }
    }
  }
`;

export const GET_FREE_DEVICES = gql`
  query FreeDevices($company_id: String!, $device_format: DeviceFormat) {
    freeDevices(company_id: $company_id, device_format: $device_format) {
      address
      assigned_to
      battery_level
      battery_usage {
        timestamp
        lvl
      }
      calibrations {
        calibrator_id
        correction
        from
        measurements {
          reference
          reference_sd
          values
          sd
          avg
          bias
        }
        to_date
      }
      comments {
        text
        author
        date
      }
      device_format
      device_id
      last_location
      last_service
      last_use
      qr
      sensors
      status
      temperature_range {
        name
        max
        min
      }
      token
    }
  }
`;
export const CREATE_REFRIGERATION = gql`
  mutation Mutation(
    $qr: String!
    $type: String!
    $temperature_range: String
    $name: String!
  ) {
    createRefrigeration(
      qr: $qr
      type: $type
      temperature_range: $temperature_range
      name: $name
    ) {
      comments {
        author
        date
        text
      }
      company_id
      gmt
      interval
      last_reading {
        temp
        time
      }
      qr
      readings {
        temp
        time
      }
      refrigeration_id
      temperature_range {
        name
        max
        min
      }
      type
      unique_refrigeration_id
      upload_time
      wifi_signal
      name
      status
    }
  }
`;
export const UPDATE_REFRIGERATION = gql`
  mutation Mutation(
    $refrigeration_id: String!
    $status: Status
    $qr: String
    $type: String
    $temperature_range: String
    $name: String
    $responsible: [String]
  ) {
    updateRefrigeration(
      refrigeration_id: $refrigeration_id
      qr: $qr
      type: $type
      temperature_range: $temperature_range
      name: $name
      status: $status
      responsible: $responsible
    ) {
      comments {
        text
        author
        date
      }
      gmt
      interval
      last_reading {
        temp
        time
      }
      qr
      readings {
        temp
        time
      }
      refrigeration_id
      temperature_range {
        name
        max
        min
      }
      type
      unique_refrigeration_id
      upload_time
      wifi_signal
      name
      status
    }
  }
`;
export const ADD_REFRIGERATION_COMMENT = gql`
  mutation AddRefrigerationComment(
    $refrigeration_id: String!
    $comment_text: String!
  ) {
    addRefrigerationComment(
      refrigeration_id: $refrigeration_id
      comment_text: $comment_text
    ) {
      comments {
        text
        author
        date
      }
      qr
    }
  }
`;
export const UPDATE_REFRIGERATION_ALERTS = gql`
  mutation UpdateRefAlert(
    $refrigeration_id: String!
    $alert_type: String!
    $alert_timestamp: String!
    $solved: Boolean
    $add_comment: CommentInput
  ) {
    updateRefAlert(
      refrigeration_id: $refrigeration_id
      alert_type: $alert_type
      alert_timestamp: $alert_timestamp
      solved: $solved
      add_comment: $add_comment
    ) {
      alerts {
        type
        value
        x
        y
        z
        timestamp
        solved
        comments {
          author
          date
          text
        }
      }
    }
  }
`;
//calibration device
export const CALIBRATE_DEVICE = gql`
  mutation CalibrateDevice(
    $device_id: String!
    $calibrator_id: String!
    $due_date: Date!
    $correction: Float!
    $report_id: String
    $thermometer_id: String
  ) {
    calibrateDevice(
      device_id: $device_id
      calibrator_id: $calibrator_id
      due_date: $due_date
      correction: $correction
      report_id: $report_id
      thermometer_id: $thermometer_id
    ) {
      device_id
      qr
      assigned_to
      status

      calibrations {
        calibrator_id
        issue_date
        due_date
        correction
        report_id
        thermometer_id
      }
    }
  }
`;
