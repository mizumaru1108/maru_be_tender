// ----------------------------------------------------------------------

// IF THIS TRANSLATION IS INCORRECT PLEASE IGNORE THIS AS THIS TRANSLATION IS FOR DEMO PURPOSES ONLY
// We are happy if you can help improve the translation by sending an email to support@minimals.cc.

// ----------------------------------------------------------------------

const en = {
  pages: {
    auth: {
      login: 'Login Page',
      register: 'Register Page',
    },
    client: {
      main: 'Main Client Dashboard',
    },
  },
  content: {
    client: {
      main_page: {
        current_projects: 'Current Projects',
        no_current_projects: 'There are no current projects',
        apply_new_support_request: 'Submit a new support request',
        current_budget: 'project budget',
        approved_budget: 'approved budget',
        not_determined: 'not determined yet',
        required_budget: 'Required Budget',
        spent_budget: 'Spent Budget',
        draft_projects: 'Draft saved projects',
        project_idea: 'Project Idea',
        complete_the_project: 'Complete the order',
        delete_draft: 'Delete draft',
        created_at: 'Created since',
        day: 'Day',
        previous_support_request: 'Previous support requests',
        no_projects: 'There are no projects',
        all_projects: 'All Projects',
        completed_projects: 'Completed Projects',
        pending_projects: 'Pending Projects',
        track_budget: 'Track Budget',
        total_track_budget: 'The total budget of the project',
        process_request: 'Process Request',
        project_followups: 'Project follow-ups',
        employee_followup: 'Employee follow-ups',
        partner_followup: 'Partner follow-up',
        empty_text_followup: 'There are no follow ups',
        empty_add_comment_followup: 'Add a comment or upload a file',
        delete_success: 'Delete is successfully',
      },
    },
    administrative: {
      project_details: {
        payment: {
          heading: {
            exchange_information: 'Exchange Authorization Information',
            project_budget: 'Project Budget',
            iban: 'Iban',
            registered_payments: 'The number of registered payments',
            total_budget: 'The total budget of the project',
            amount_spent: 'Amount spent',
            split_payments: 'Split payments',
          },
          table: {
            td: {
              batch_no: 'Batch no',
              payment_no: 'Payment no',
              batch_date: 'Batch date',
            },
            btn: {
              review_transfer_receipt: 'Review the transfer receipt',
              exchange_permit_success: 'The exchange permit has been issued successfully',
              exchange_permit_issued: 'Issuance of an exchange permit',
              exchange_permit_refuse: 'Refuse permission to exchange',
              exchange_permit_approve: 'Approval of the exchange authorization',
              exchange_permit_accept_finance: 'Acceptance of exchange authorization',
            },
          },
        },
      },
    },
    messages: {
      btn: {
        create_new_message: 'Create a New Message',
      },
      empty_user_data: 'User list is empty!',
      text_field: {
        placeholder_list_tracks: 'Choose the path type for Employee',
      },
    },
  },
  errors: {
    login: {
      email: {
        message: 'Email must be a valid email address',
        required: 'Email is required',
      },
      password: {
        message: '',
        required: 'Password is required',
      },
    },
    register: {
      entity: {
        message: '',
        required: 'Entity is required',
      },
      client_field: {
        message: '',
        required: 'Client Field Area is required',
      },
      authority: {
        message: '',
        required: 'Authority is required',
      },
      date_of_esthablistmen: {
        message: '',
        required: 'Date Of Establishment is required',
      },
      headquarters: {
        message: '',
        required: 'Headquarters is required',
      },
      region: {
        message: '',
        required: 'Region is required',
      },
      governorate: {
        message: '',
        required: 'Governorate is required',
      },
      entity_mobile: {
        message: '',
        required: 'Mobile number is required',
        length: 'Mobile number must be 9 digits',
        equal: 'Entity mobile must be different from the phone',
      },
      entity_employee: {
        message: '',
        required: 'Entity employee is required',
      },
      phone: {
        message: '',
        required: 'Phone number is required',
        length: 'Phone number must be 9 digits',
        exist: 'Mobile number already exists',
        equal: 'Phone number must be different from the entity mobile',
      },
      email: {
        message: '',
        required: 'Email is required',
        email: 'Email must be a valid email address',
      },
      password: {
        message: '',
        required: 'Password is required',
        new_password: 'New password is required',
        confirm_password: 'Confirm password must be the same as the new password',
      },
      license_number: {
        message: '',
        required: 'License number is required',
      },
      license_issue_date: {
        message: '',
        required: 'License issue date is required',
      },
      license_expired: {
        message: '',
        required: 'License expiration date is required',
      },
      ceo_name: {
        message: '',
        required: 'CEO name is required',
      },
      ceo_mobile: {
        message: '',
        required: 'CEO mobile number is required',
        length: 'CEO mobile number must be 9 digits',
      },
      chairman_name: {
        message: '',
        required: 'Chairman name is required',
      },
      chairman_mobile: {
        message: '',
        required: 'Chairman mobile number is required',
        length: 'Chairman mobile number must be 9 digits',
      },
      data_entry_name: {
        message: '',
        required: 'Data entry name is required',
      },
      agree_on: {
        message: '',
        required: 'Agree on terms and conditions is required',
      },
      data_entry_mobile: {
        message: '',
        required: 'Data entry mobile number is required',
        length: 'Data entry mobile number must be 9 digits',
      },
      license_file: {
        message: '',
        size: 'The file size must be less than 5 MB',
        fileExtension: 'The file extension must be one of the following: pdf, png, jpg, jpeg',
        required: 'License file is required',
      },
      board_ofdec_file: {
        message: '',
        size: 'The file size must be less than 5 MB',
        fileExtension: 'The file extension must be one of the following: pdf, png, jpg, jpeg',
        required: 'Board of directors file is required',
      },
      num_of_employed_facility: {
        message: '',
        required: 'Number Of Employees is required',
        min: 'Number Of Employees must be at least 1',
      },
      num_of_beneficiaries: {
        message: '',
        required: 'Number Of Beneficiaries is required',
        min: 'Number Of Beneficiaries must be at least 1',
      },
      bank_account_number: {
        message: '',
        required: 'Bank Account Number is required',
        match: 'Invallid International Bank Account Number ',
        min: 'Bank Account Number must be 22 digit of numbers',
      },
      bank_account_name: {
        message: '',
        required: 'Bank Account Name is required',
      },
      bank_name: {
        message: '',
        required: 'Bank Name is required',
      },
      card_image: {
        message: '',
        required: 'Card Image is required',
        size: 'The file size must be less than 5 MB',
        fileExtension: 'The file extension must be one of the following: pdf, png, jpg, jpeg',
      },
      employee_name: {
        message: '',
        required: 'Employee Name is required',
      },
    },

    cre_proposal: {
      project_name: {
        message: '',
        required: 'Project name is required',
      },
      project_idea: {
        message: '',
        required: 'Project idea required',
      },
      project_location: {
        message: '',
        required: 'The location of the project is required',
      },
      project_implement_date: {
        message: '',
        required: 'Project implementation date is required',
      },
      execution_time: {
        message: '',
        required: 'Execution time is required',
        greater_than_0: 'Execution time must be greater than 0',
      },
      vat_percentage: {
        message: '',
        required: 'Vat percentage is required',
        greater_than_0: 'Vat percentage must be greater than or equal to 1',
      },
      project_beneficiaries: {
        message: '',
        required: 'The type of target group is required',
      },
      letter_ofsupport_req: {
        message: '',
        required: 'The letter of support is required',
        fileSize: 'The file size must be less than 30 MB',
        fileExtension: 'The file extension must be one of the following: pdf, png, jpg, jpeg',
      },
      project_attachments: {
        message: '',
        required: 'Project attachments are required',
        fileSize: 'The file size must be less than 30 MB',
        fileExtension: 'The file extension must be one of the following: pdf, png, jpg, jpeg',
      },
      project_beneficiaries_specific_type: {
        message: '',
        required: 'The type of external target group is required when the target group is external',
      },
      num_ofproject_binicficiaries: {
        message: 'The number of beneficiaries of the project must be a positive number',
        required: 'The number of beneficiaries of the project is required',
      },
      project_goals: {
        message: '',
        required: 'Project goals are required',
      },
      project_outputs: {
        message: '',
        required: 'Project outputs are required',
      },
      project_strengths: {
        message: '',
        required: 'The strengths of the project are required',
      },
      project_risks: {
        message: '',
        required: 'Project Risk Required',
      },
      pm_name: {
        message: '',
        required: 'Project manager name is required',
      },
      pm_mobile: {
        message: 'The number must be written in an equivalent form to this form +9665XXXXXXXX',
        required: 'Mobile number is required',
      },
      pm_email: {
        message: '',
        required: 'Email is required',
      },
      region: {
        message: '',
        required: 'Region is required',
      },
      governorate: {
        message: '',
        required: 'Governorate is required',
      },
      amount_required_fsupport: {
        message: '',
        required: 'Amount required for support is required',
      },
      detail_project_budgets: {
        clause: {
          message: '',
          required: 'Clause is required',
        },
        explanation: {
          message: '',
          required: 'Explanation is required',
        },
        amount: {
          message: 'Amount must be a positive number with no commas',
          required: 'Amount is required',
        },
      },
    },
  },
  commons: {
    track_type: {
      all_tracks: 'All Tracks',
      mosques_track: 'Mosques Track',
      scholarships_track: 'Scholarships Track',
      initiatives_track: 'Initiatives Track',
      baptism_track: 'Baptism Track',
      syeikh_track: "Syeikh's Track",
    },
    filter_button_label: 'Filter',
    chip_canceled: 'The request is canceled',
    chip_completed: 'The request is complete',
    chip_pending: 'The request is pending',
    maintenance_feature_flag: 'This feature is still in maintenance',
    view_license_file: 'Click here to view the license file',
  },
  demo: {
    title: `English`,
    introduction: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  docs: {
    hi: `Hi`,
    description: `Need help? \n Please check our docs.`,
    documentation: `documentation`,
  },
  BAPTISMS: 'Baptisms Track',
  MOSQUES: 'Mosques Track',
  CONCESSIONAL_GRANTS: 'Concessional Grants',
  INITIATIVES: 'Initiatives Track',
  GENERAL: 'General Track',
  app: `app`,
  user: `user`,
  list: `list`,
  edit: `edit`,
  shop: `shop`,
  blog: `blog`,
  post: `post`,
  mail: `mail`,
  chat: `chat`,
  cards: `cards`,
  posts: `posts`,
  create: `create`,
  kanban: `kanban`,
  general: `general`,
  banking: `banking`,
  booking: `booking`,
  profile: `profile`,
  account: `account`,
  product: `product`,
  invoice: `invoice`,
  details: `details`,
  checkout: `checkout`,
  calendar: `calendar`,
  analytics: `analytics`,
  ecommerce: `e-commerce`,
  management: `management`,
  menu_level_1: `menu level 1`,
  menu_level_2a: `menu level 2a`,
  menu_level_2b: `menu level 2b`,
  menu_level_3a: `menu level 3a`,
  menu_level_3b: `menu level 3b`,
  menu_level_4a: `menu level 4a`,
  menu_level_4b: `menu level 4b`,
  item_disabled: `item disabled`,
  item_label: `item label`,
  item_caption: `item caption`,
  item_external_link: `item external link`,
  description: `description`,
  other_cases: `other cases`,
  item_by_roles: `item by roles`,
  only_admin_can_see_this_item: `Only admin can see this item`,
  main: 'dashboard',
  request_project_funding: 'Request project funding',
  support_requests_received: 'Support requests received',
  incoming_support_requests: 'Incoming support requests',
  previous_support_requests: 'Previous support requests',
  portal_reports: 'Portal reports',
  drafts: 'Drafts',
  previous_funding_requests: 'Previous funding requests',
  messages: 'Messages',
  contact_support: 'Contact Support',
  register_first_tap: 'Main info',
  register_second_tap: 'Contact info',
  register_third_tap: 'License info',
  register_fourth_tap: 'Administrative data',
  register_fifth_tap: 'Banking info',
  email_label: 'E-mail',
  password_label: 'The password',
  remember_me: 'remember me',
  forget_the_password: 'forget the password',
  forgot_your_password: 'Forgot your password?',
  forgot_password_details:
    'Please enter the email address associated with your account and We will email you a link to reset your password.',
  login: 'Login',
  create_new_account: 'Create a new account',
  the_login_message: 'Please enter your email address to login.',
  dont_have_account: "You don't have an account?",
  register_one: 'register from here',
  show_details: 'Studying The Project',
  show_project: 'Project Review',
  completing_exchange_permission: 'Completion of the disbursement authorization',
  pending: 'Request Pending',
  completed: 'Completed Order',
  canceled: 'Request Canceled',
  create_a_new_support_request: 'Create a new support request',
  register_form1: {
    vat: {
      label: 'ضريبة القيمة المضافة',
      placeholder: 'Do you agree to VAT',
    },
    entity: {
      label: "Entity's name*",
      placeholder: "Please write the Entity's name",
    },
    entity_area: {
      label: 'Entity area*',
      placeholder: 'Please choose the Entity Area',
      options: {
        sub_entity_area: 'main',
        main_entity_area: 'sub-main',
      },
    },
    authority: {
      label: 'Authority*',
      placeholder: 'Please choose the Authority',
      options: {
        other: '',
      },
    },
    date_of_establishment: {
      label: 'Date of Establishment*',
      placeholder: 'الرجاء اختيار تحديد تاريخ التأسيس',
    },
    headquarters: {
      label: 'Headquarters*',
      placeholder: 'Please enter the Headquarters',
      options: { rent: 'Rent', own: 'Owning' },
    },
    number_of_employees: {
      label: 'Number of full-time employees*',
      placeholder: 'The number of employees of the facility',
    },
    number_of_beneficiaries: {
      label: "Number of beneficiaries of the entity's services*",
      placeholder: "Number of beneficiaries of the entity's services",
    },
  },
  register_form2: {
    region: {
      label: 'Region',
      placeholder: 'Please choose the Region',
      options: {},
    },
    city: {
      label: 'Governorate',
      placeholder: 'Please choose the Governorate',
      options: {},
    },
    center: {
      label: 'Center Administrative',
      placeholder: 'Please choose the Center Administrative',
      options: {},
    },
    mobile_number: {
      label: 'Mobile number*',
      placeholder: 'Please enter the mobile number',
    },
    phone: {
      label: 'Phone*',
      placeholder: 'Please enter the phone number',
    },
    twitter: {
      label: 'حساب تويتر',
      placeholder: 'الرجاء ادخال رابط حساب التويتر',
    },
    website: {
      label: 'الموقع الإلكتروني',
      placeholder: 'الموقع الإلكتروني',
    },
    email: {
      label: 'البريد الإلكتروني*',
      placeholder: 'الرجاء ادخال البريد الالكتروني',
    },
    password: {
      title: 'كلمة السر*',
      placeholder: 'كلمة السر',
    },
    new_password: {
      title: 'كلمة السر الجديدة*',
      placeholder: 'كلمة السر الجديدة',
    },
    old_password: {
      title: 'كلمة السر القديمة*',
      placeholder: 'كلمة السر القديمة',
    },
    confirm_password: {
      title: 'تأكيد كلمة السر*',
      placeholder: 'تأكيد كلمة السر',
    },
    employee_name: {
      label: 'اسم الموظف*',
      placeholder: 'الرجاء كتابة اسم الموظف',
    },
  },
  register_form3: {
    license_number: {
      label: 'رقم الترخيص*',
      placeholder: 'الرجاء اختيار الجهة المشرفة',
    },
    license_issue_date: {
      label: 'تاريخ اصدار الترخيص*',
      placeholder: 'الرجاء تحديد تاريخ اصدار الترخيص',
    },
    license_expiry_date: {
      label: 'تاريخ انتهاء الترخيص*',
      placeholder: 'الرجاء تحديد تاريخ انتهاء الترخيص',
    },
    license_file: {
      label: 'ملف الترخيص*',
      placeholder: 'الرجاء اختيار ملف الترخيص',
    },

    resolution_file: {
      label: 'ملف قرار تشكيل مجلس الإدارة*',
      placeholder: 'ملف قرار تشكيل مجلس الإدارة',
    },
  },
  register_form4: {
    executive_director: {
      label: 'اسم المدير التنفيذي*',
      placeholder: 'الرجاء كتابة اسم المدير التنفيذي',
    },
    executive_director_mobile: {
      label: '*جوال المدير التنفيذي',
      placeholder: 'الرجاء كتابة جوال المدير التنفيذي',
    },
    chairman_name: {
      label: '*اسم رئيس مجلس الإدارة',
      placeholder: 'الرجاء كتابة اسم الرئيس',
    },
    chairman_mobile: {
      label: 'جوال رئيس مجلس الإدارة*',
      placeholder: 'الرجاء كتابة رقم هاتف رئيس مجلس الإدارة',
    },
    entery_data_name: {
      label: 'اسم مدخل البيانات*',
      placeholder: 'الرجاء كتابة اسم مدخل البيانات',
    },
    entery_data_phone: {
      label: '*جوال مدخل البيانات',
      placeholder: 'الرجاء كتابة جوال مدخل البيانات',
    },
    entery_data_email: {
      label: 'بريد مدخل البيانات*',
      placeholder: 'الرجاء ادخال البريد الالكتروني',
    },
    agree_on: 'أقر بصحة المعلومات الواردة',
  },
  register_form5: {
    bank_account_number: {
      label: '*رقم الحساب البنكي',
      placeholder: 'XX XXXX XXXX XXXX XXXX XXXX',
    },
    bank_account_name: {
      label: 'اسم الحساب البنكي*',
      placeholder: 'اسم الحساب البنكي',
    },
    bank_name: {
      label: 'اسم البنك*',
      placeholder: 'اسم البنك',
    },
    bank_account_card_image: {
      label: 'صورة بطاقة الحساب البنكي*',
      placeholder: 'صورة بطاقة الحساب البنكي',
    },
  },
  funding_project_request_form1: {
    step: 'general information',
    project_name: {
      label: 'Project name*',
      placeholder: 'Please write the Project name',
    },
    project_idea: {
      label: 'Project idea*',
      placeholder: 'Please write the Project idea',
    },
    project_applying_place: {
      label: 'Project location*',
      placeholder: 'Please select a project execution date',
    },
    project_applying_date: {
      label: 'Project implementation date*',
      placeholder: 'Please select a project execution date',
    },
    applying_duration: {
      label: 'Execution time*',
      placeholder: 'Please specify the execution period (in hour)',
    },
    target_group_type: {
      label: 'Target group type*',
      placeholder: 'Please choose the type of target group',
    },
    letter_support_request: {
      label: 'Support request letter*',
      placeholder: 'Support request letter',
    },
    project_attachments: {
      label: 'Project Attachments*',
      placeholder: 'Project Attachments',
    },
  },
  funding_project_request_form2: {
    step: 'Detailed information about the project',
    number_of_project_beneficiaries: {
      label: 'The number of beneficiaries of the project*',
      placeholder: 'Please write the number of beneficiaries of the project',
    },
    project_goals: {
      label: 'Project goals*',
      placeholder: 'Please write the objectives of the project',
    },
    project_outputs: {
      label: 'Project outputs*',
      placeholder: 'Please write the project output ',
    },
    project_strengths: {
      label: 'Project strengths*',
      placeholder: 'Please write down the strengths of the project',
    },
    project_risk: {
      label: 'Project risk*',
      placeholder: 'Please write the project risk',
    },
  },
  funding_project_request_form3: {
    step: 'contact information',
    project_manager_name: {
      label: 'Project manager name*',
      placeholder: 'Please write the name of the project manager',
    },
    mobile_number: {
      label: 'Mobile number*',
      placeholder: 'Please write your mobile number',
    },
    email: {
      label: 'E-mail*',
      placeholder: 'Please write an email',
    },
    region: {
      label: 'Region*',
      placeholder: 'Please select a region',
    },
    city: {
      label: 'Governorate*',
      placeholder: 'Please select the governorate',
    },
  },
  funding_project_request_form4: {
    step: 'Support information and duration',
    amount_required_fsupport: {
      label: 'Amount required for support*',
      placeholder: 'Please write the required amount for support',
    },
    item: {
      label: 'clause*',
      placeholder: 'Please write the clause name',
    },
    explanation: {
      label: 'The explanation*',
      placeholder: 'Please write the explanation',
    },
    amount: {
      label: 'The amount*',
      placeholder: 'The amount required',
    },
  },
  funding_project_request_form5: {
    step: 'Detailed project budget',
    amount_required_for_support: {
      label: 'المبلغ المطلوب للدعم*',
      placeholder: 'الرجاء كتابة المبلغ المطلوب للدعم',
    },
    previously_added_banks: {
      label: 'بنوك مضافة سابقا*',
    },
    add_new_bank_details: {
      label: 'Add a new bank account',
    },
    agree_on: {
      label:
        'I certify that the information on this form is correct or I submit a request to support the project',
    },
  },
  funding_project_request_form6: {
    bank_account_number: {
      label: 'Bank account number*',
      placeholder: 'Bank account number',
    },
    bank_account_name: {
      label: 'Bank account name*',
      placeholder: 'Bank account name',
    },
    bank_name: {
      label: 'Bank name*',
      placeholder: 'Bank name',
    },
    bank_account_card_image: {
      label: 'Bank account card image*',
      placeholder: 'Bank account card image',
    },
  },
  next: 'Next',
  going_back_one_step: 'Back',
  saving_as_draft: 'save as draft',
  send: 'send',
  add: 'Add',
  contact_support_form: {
    inquiry_type: {
      label: 'نوع الاستفسار',
      placeholder: 'الرجاء اختيار نوع الاستفسار',
      options: {
        general_inquiry: 'استفسار عام',
        project_inquiry: 'استفسار عن مشروع',
        appointment_inquiry: 'طلب زيارة',
      },
    },
    message: {
      label: 'الرسالة*',
      placeholder: 'الرجاء كتابة رسالتك هنا',
    },
    message_type: {
      label: 'عنوان الرسالة*',
      placeholder: 'الرجاء كتابة عنوان الرسالة',
    },
    project_name: {
      label: 'اسم المشروع*',
      placeholder: 'الرجاء كتابة عنوان الرسالة',
    },
    appointment_date: {
      label: 'تاريخ الزيارة*',
      placeholder: 'الرجاء اختيار تاريخ الزيارة',
    },
    appointment_cause: {
      title: 'سبب الزيارة*',
      placeholer: 'الرجاء كتابة سبب الزيارة هنا ',
    },
  },
  incoming_funding_requests: 'Incoming Funding Requests',
  project_details: {
    heading: 'Project Details',
    actions: {
      main: 'Main',
      project_budget: 'Project Budget',
      follow_ups: 'Follow Ups',
      payments: 'Payments',
      project_path: 'Project Path',
      project_timeline: 'Project Timeline',
    },
  },
  incoming_exchange_permission_requests: 'Incoming Exchange Permission Requests',
  requests_in_process: 'Requests in Process',
  incoming_funding_requests_project_supervisor: 'Incoming Funding Requests',
  payment_adjustment: 'Payment Adjustment',
  appointments_with_partners: 'Appointments With Partners',
  exchange_permission: 'Exchange Permission',
  transaction_progression: 'Transaction Progression',
  tracks_budget: 'Tracks Budget',
  gregorian_year: 'Gregorian Year',
  application_and_admission_settings: 'Application and Admission Settings',
  mobile_settings: 'Mobile Settings',
  system_messages: 'System Messages',
  system_configuration: 'System Configuration',
  users_and_permissions: 'Users and Permissions',
  authority: 'Authority',
  entity_area: 'Entity Area',
  regions_project_location: 'Regions Project Location',
  entity_classification: 'Entity Classification',
  bank_name: 'Bank Name',
  beneficiaries: 'Beneficiaries',
  system_configuration_form: {
    enterprise_name: { label: 'اسم المؤسسة', placeholder: 'اسم المؤسسة' },
    enterprise_email: { label: 'ايميل المؤسسة', placeholder: 'ايميل المؤسسة' },
    telephone_fix: { label: 'الهاتف الارضي', placeholder: 'الهاتف الارضي' },
    mobile_phone: { label: 'رقم الموبايل', placeholder: 'رقم الموبايل' },
    enterprise_logo: {
      label: 'شعار المؤسسة',
      placeholder: 'تصفح واختر الملفات التي تريد تحميلها من جهاز الكمبيوتر الخاص بك',
    },
  },
  application_and_admission_settings_form: {
    starting_date: { label: 'تاريخ البداية', placeholder: 'الرجاء اختيار تاريخ البداية' },
    ending_date: { label: 'تاريخ النهاية', placeholder: 'الرجاء اختيار تاريخ النهاية' },
    number_of_allowing_projects: {
      label: 'عدد المشاريع المسموح بها',
      placeholder: 'الرجاء كتابة عدد المشاريع المسموح بها',
    },
    hieght_project_budget: {
      label: 'الميزانية العليا للمشروع',
      placeholder: 'الرجاء كتابة الميزانية العليا للمشروع',
    },
    number_of_days_to_meet_business: {
      label: 'عدد الأيام لتلبية الأعمال',
      placeholder: 'الرجاء كتابة عدد الأيام لتلبية الأعمال',
    },
    Indicator_of_project_duration_days: {
      label: 'مؤشر أيام جراسة المشروع',
      placeholder: 'الرجاء كتابة مؤشر أيام جراسة المشروع',
    },
  },
  mobile_settings_form: {
    field1: {
      label: 'TWILIO_ACCOUNT_SID ',
      placeholder: 'TWILIO_ACCOUNT_SID ',
    },
    field2: {
      label: 'TWILIO_ACCOUNT_SID ',
      placeholder: 'TWILIO_AUTH_TOKEN',
    },
    mobile_number: {
      label: 'رقم الموبايل',
      placeholder: 'الرجاء كتابة رقم الموبايل',
    },
  },

  // TENDER_CEO PAGES
  rejection_list: 'Rejection List', // navigation
  project_management: 'Project Management', // navigation
  project_management_table: {
    headline: 'Project Management',
  },
  rejection_list_table: {
    headline: 'Rejection List',
  },
  project_management_headercell: {
    project_number: 'Project Number',
    project_name: 'Project Name',
    association_name: 'Association Name',
    section: 'Section',
    date_created: 'Date Created',
    events: 'Events',
    days: 'Days',
    sent_section: 'Sent Section',
    clients_name: 'Clients Name',
    employee: 'Employee',
    start_date: 'Start Date',
    at: 'at',
  },
  concessional_card_insights: {
    title: {
      reserved_budget: 'Reserved budget',
      spent_budget: 'Spent Budget',
      total_budget_for_the_course: 'Total Budget for the course',
    },
    headline: {
      the_concessional_grant_track_budget: 'The Concessional Grant Track Budget',
    },
  },
  mosques_card_insights: {
    title: {
      reserved_budget: 'Reserved budget',
      spent_budget: 'Spent Budget',
      total_budget_for_the_course: 'Total Budget for the course',
    },
    headline: {
      mosques_grant_track_budget: 'Mosques Grant Track Budget',
    },
  },
  complexity_card_insights: {
    title: {
      reserved_budget: 'Reserved budget',
      spent_budget: 'Spent Budget',
      total_budget_for_the_course: 'Total Budget for the course',
    },
    headline: {
      complexity_grant_track_budget: 'Complexity Grant Track Budget',
    },
  },
  initiatives_card_insights: {
    title: {
      reserved_budget: 'Reserved budget',
      spent_budget: 'Spent Budget',
      total_budget_for_the_course: 'Total Budget for the course',
    },
    headline: {
      initiatives_track_budget: 'Initiatives Track Budget',
    },
  },

  // filter above table on project management and rejection list
  table_filter: {
    sortby_title: 'Sort By',
    sortby_options: {
      date_created_oldest: 'Date Created (Oldest)',
      date_created_newest: 'Date Created (Newest)',
      project_name_az: 'Project Name (A-Z)',
      project_name_za: 'Project Name (Z-A)',
      association_name_az: 'Association Name (A-Z)',
      association_name_za: 'Association Name (Z-A)',
      section_az: 'Section (A-Z)',
      section_za: 'Section (Z-A)',
      project_number_lowest: 'Project Number (Lowest)',
      project_number_highest: 'Project Number (Highest)',
    },
  },

  table_actions: {
    view_details: 'View Details',
    delete_button_label: 'Delete',
  },
  continue_studying_the_project: 'Continue Studying',
  no_employee: 'No Employee',

  // ACCOUNT_MANAGER PAGES
  account_manager: {
    button: {
      approveEdit: 'Approve Edit Request',
      rejectEdit: 'Reject Edit Request',
    },
    card: {
      suspended_partners: 'Automatically suspended partners',
      active_partners: 'Active Partners',
      rejected_partners: 'Rejected',
      number_of_request: 'Total number of requests to join',
    },
    heading: {
      daily_stats: 'Daily Stats',
      new_join_request: 'Incoming requests to join',
      link_view_all: 'View All',
      info_update_request: 'Information update requests',
      partner_management: 'Partner management',
      amandment_request: 'Send an amendment request to the partner',
      subhead_amandment_request:
        'Write the appropriate notes to inform the partner of the things required of him',
    },
    table: {
      th: {
        partner_name: 'Partner name',
        createdAt: 'Date of registration',
        account_status: 'Account Status',
        request_status: 'Request Status',
        events: 'Events',
      },
      td: {
        btn_account_review: 'Account review',
        btn_view_partner_projects: 'View partner projects',
        label_waiting_activation: 'Waiting for activation',
        btn_view_edit_request: 'View Edit Request Client',
        label_active_account: 'Active account',
        label_canceled_account: 'Canceled account',
        label_pending: 'Pending',
        label_approved: 'Approved',
        label_rejected: 'Rejected',
      },
    },
    accept_project: 'Accept Project',
    reject_project: 'Reject Project',
    partner_details: {
      main_information: 'Main information',
      number_of_fulltime_employees: 'Number of full-time employees of the facility',
      number_of_beneficiaries: "Number of beneficiaries of the entity's services",
      date_of_establishment: 'Date of Establishment',
      headquarters: 'Headquarters',
      license_information: 'License information',
      license_number: 'License number',
      entity_name_of_partner: 'Entity name of partner',
      license_expiry_date: 'License expiry date',
      license_issue_date: 'License issue date',
      license_file: 'License file',
      administrative_data: 'Administrative data',
      ceo_name: "CEO's name",
      ceo_mobile: "CEO's mobile",
      chairman_name: 'Chairman name',
      chairman_mobile: 'Chairman mobile',
      data_entry_name: 'Data entry name',
      mobile_data_entry: 'Mobile data entry',
      data_entry_mail: 'Data entry mail',
      contact_information: 'Contact information',
      center_management: 'Center (Management)',
      governorate: 'Governorate',
      region: 'Region',
      email: 'E-mail',
      twitter_account: 'Twitter account',
      website: 'Website',
      phone: 'Phone',
      bank_information: 'Bank information',
      send_messages: 'Send a message to the partner',
      submit_amendment_request: 'Submit an amendment request',
      btn_deleted_account: 'Delete account',
      btn_activate_account: 'Activate account',
      btn_disabled_account: 'Disable account',
      btn_amndreq_send_request: 'Send request',
      board_ofdec_file: 'Board ofdec file',
      btn_amndreq_back: 'Back',
      form: {
        amndreq_label: 'Notes on account information*',
        amndreq_placeholder: 'Please write notes here',
      },
      notification: {
        disabled_account: 'Disabled Account is Successfull!',
        activate_account: 'Activate Account is Successfull!',
        deleted_account: 'Account Delete Is Successfull!',
      },
    },
    search_bar: 'Type a name to search for',
  },
  proposal_approved: 'The project has been successfully accepted',
  proposal_rejected: 'The project was successfully rejected',
  proposal_stepback: 'The project has been change status',
  proposal_created: 'The project has been created successfully',
  proposal_saving_draft: 'The project has been saved as a draft',
  view_all: 'view all',
  // PORTAL REPORTS
  ceo_portal_reports: {
    bar_chart: {
      headline: {
        partners: 'Partners',
      },
      series_name: {
        last_month: 'Last Month',
        this_month: 'This Month',
        last_week: 'Last Week',
        this_week: 'This Week',
      },
      label: {
        partners_need_to_active: 'Parters Need to Active',
        active_partners: 'Active Partners',
        rejected_partners: 'Rejected Partners',
        pending_partners: 'Pending Partners',
      },
    },
  },
  section_portal_reports: {
    heading: {
      reports: 'Reports',
      average_transaction: 'Average transaction processing speed on the platform',
      achievement_effectiveness: 'Achievement and effectiveness of employees',
      mosque_track_budget: 'Mosques track budget',
      conessional_track_budget: 'The concessional grant track budget',
      initiatives_track_budget: 'Initiatives track budget',
      complexity_track_budget: 'Complexity track budget',
      total_number_of_request: 'The total number of requests',
      authorities_label: 'According to the side',
      by_regions: 'By Regions',
      by_governorate: 'By Governorate',
      ongoing: 'Ongoing',
      canceled: 'Canceled',
      empty_data: 'Data is empty.',
      total_number_beneficiaries: 'Total number of project beneficiaries',
      type_beneficiaries_project: 'Type of beneficiaries of the projects',
      gender: {
        general: 'General',
        men: 'Men',
        woman: 'Woman',
        middle_aged: 'Teen',
        kids: 'Kids',
        elderly: 'Elderly',
      },
      // Partner tabs
      depending_of_partner: 'Depending on the status of the partner',
    },
    label: {
      WAITING_FOR_ACTIVATION: 'Parters Need to Active',
      ACTIVE_ACCOUNT: 'Active Partners',
      SUSPENDED_ACCOUNT: 'Suspended Partners',
      CANCELED_ACCOUNT: 'Canceled Partners',
      REVISED_ACCOUNT: 'Revised Partners',
      WAITING_FOR_EDITING_APPROVAL: 'Parters Need to Approval',
      series_name: {
        last_month: 'Last Month',
        this_month: 'This Month',
      },
    },
    form: {
      date_picker: {
        label: {
          start_date: 'Start Date',
          end_date: 'End Date',
        },
      },
    },
    tabs: {
      label_1: 'Information about orders',
      label_2: 'Information about partners',
      label_3: 'Budget info',
      label_4: 'Information about achievement and efficacy',
    },
    button: {
      create_special_report: 'Create a special report',
    },
    table: {
      th: {
        employee_name: 'Employee Name',
        account_type: 'Account Type',
        section: 'Section',
        number_of_clock: 'Number of Clock',
      },
    },
    total_budget_for_the_course: 'The total budget for the track',
    riyals: 'SAR',
    hours: 'Hours',
    spent_budget: 'Spent Budget',
    reserved_budget: 'Reserved Budget',
    since_last_weeks: 'Since last week',
  },

  // Message Page
  message: 'Message',
  new_message_modal: {
    title: 'Create a New Message',
    form: {
      label: {
        track_type: 'Track Type',
        employees: 'Employees',
        search_employee: 'Search the Client name',
      },
    },
  },
  message_tab: {
    internal: 'Internal Corespondence',
    external: 'External Corespondence',
  },

  // User Profile
  user_profile: {
    label: {
      page_title: 'My Profile',
      main_information: 'Main Information',
      contact_information: 'Contact Information',
      edit_button: 'Edit Account Information',
    },
    fields: {
      first_name: 'First Name',
      last_name: 'Last Name',
      address: 'Address',
      region: 'Region',
      email: 'E-mail',
      phone_number: 'Phone Number',
    },
  },

  proposal_amandement: {
    button_label: 'send an edit request to Supervisor',
    forms: {
      notes: 'Notes on Order',
      notes_placeholder: 'Please write your feedback here',
    },
    tender_moderator: {
      page_name: 'Moderator - Amandement Reqauest',
      headline: 'Submit an amendment request to the project supervisor',
      sub_headline:
        'Write the appropriate notes to inform the project supervisor of the matters required of him',
    },
    tender_ceo: {
      page_name: 'CEO - Amandement Request',
      headline: 'Submit an amendment request to the project supervisor',
      sub_headline:
        'Write the appropriate notes to inform the project supervisor of the matters required of him',
    },
    tender_project_manager: {
      page_name: 'Project Manager - Amandement Request',
      headline: 'Submit an amendment request to the project supervisor',
      sub_headline:
        'Write the appropriate notes to inform the project supervisor of the matters required of him',
    },
    tender_finance: {
      page_name: 'Finance - Amandment Request',
      headline: 'Submit an amendment request to the project supervisor',
      sub_headline:
        'Write the appropriate notes to inform the project supervisor of the matters required of him',
    },
    tender_cashier: {
      page_name: 'Cashier - Amandment Request',
      headline: 'Submit an amendment request to the project supervisor',
      sub_headline:
        'Write the appropriate notes to inform the project supervisor of the matters required of him',
    },
    tender_project_supervisor: {
      page_name: 'Project Supervisor - Amandment Request',
      headline: 'Submit an Amandment Request to the Moderator',
      sub_headline:
        'Write the appropriate notes to inform the Moderator of the matters required of him',
    },
  },
  client_appointments: 'Appointments with the company',
  day: 'day',
  from: 'from',
  to: 'to',
  choose_suitable_time: 'Please choose the suitable date',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  pick_your_availabe_time: 'Pick Your Availabe Time',
  choose_your_week_hours: 'Set your weekly hours',
  show_clients_project_detail: 'Show Details',
  appointments_with_clients: 'The Appointments With Clients',
  booking_for_a_meeting: 'Booking an Appointment',
  todays_meetings: "Today's Meetings",
  upcoming_meetings: 'Upcoming Meetings',
  appointments_with_organization: 'Appointments With Organization',
  adding_the_available_time: 'Adding The Available Time',
  edeting_the_available_time: 'Edeting The Available Time',
  appointments: 'Appointments',
  requests_for_meeting: 'Requested Meetings',
  please_choose_entity_field: 'please Choose Entity',
  entity_field_main: 'Main',
  entity_field_sub_main: 'Sub Main',
  please_choose_the_name_of_the_client: 'Please Choose The Name Of The Client',
  write_name_to_search: 'Write Name To Search For',
  booking_an_appointment: 'Booking an Appointment',
  acceptableRequest: 'Accepted Projects',
  incomingNewRequest: 'Incoming New Projects',
  pendingRequest: 'Pending Projects',
  rejectedRequest: 'Rejected Projects',
  totalRequest: 'Total Projects',
  projects: 'Projects',
  login_message_error: 'This email or password is not correct',
  budget_error_message:
    "The sum of the budget's items should be the exact same as the whole budget",
  banking_error_message: 'Please select a bank card to continue',
  sign_out: 'Sign-out',
  tender_accounts_manager: 'Account Manager',
  tender_admin: 'Admin',
  tender_ceo: 'CEO',
  tender_cashier: 'Cashier',
  tender_client: 'Client',
  tender_consultant: 'Consultant',
  tender_finance: 'Finance',
  tender_moderator: 'Moderator',
  tender_project_manager: 'Project Manager',
  tender_project_supervisor: 'Project Supervisor',
  account_permission: 'Account Permissions',
  permissions: {
    CEO: 'CEO',
    PROJECT_MANAGER: 'Project Manager',
    PROJECT_SUPERVISOR: 'Project Supervisor',
    CONSULTANT: 'Consultant',
    FINANCE: 'Finance',
    CASHIER: 'Cashier',
    MODERATOR: 'Moderator',
    ACCOUNTS_MANAGER: 'Accounts Manager',
    ADMIN: 'Super Admin',
  },
  review: {
    order_status: 'Order Status',
    classification_field: 'Classification Field',
    review_by_supervisor: 'Review by Supervisor',
    closing_report: 'Closing Report',
    closing_agreement: 'Closing Agreement',
    vat_in_project: 'Vat in Project',
    vat: 'Vat %',
    inclu_or_exclu: 'Payment is Inclusive or Exclusive',
    number_of_payment: 'Number of Payment',
    payment_support: 'Payment Support',
    support_amount_inclu: 'Support amount inclusive of VAT',
    procedure: 'Procedure',
    note_on_project: 'Note on the Project',
    support_output: 'Support Output',
  },
  project_already_reviewed_by_supervisor: 'This project already reviewed by Supervisor',
  show_modified_fields: 'Show Modified Fields',
  daily_stats: 'Daily stats',
  project_implementation_date: 'Project implementation date:',
  where_to_implement_the_project: 'Where to implement the project:',
  number_of_beneficiaries_of_the_project: 'Number of beneficiaries of the project:',
  implementation_period: 'Implementation period:',
  target_group_type: 'Target group type:',
  support_type: 'Support type:',
  full_support: 'Full support',
  partial_support: 'Partial support',
  with: 'with',
  amount: 'amount',
  project_idea: 'Project idea:',
  project_goals: 'Project goals:',
  project_outputs: 'Project outputs:',
  project_strengths: 'Project strengths:',
  project_risks: 'Project risks:',
  email: 'E-mail:',
  mobile_number: 'Mobile number:',
  governorate: 'Governorate:',
  amount_required_for_support: 'Amount required for support:',
  selected_bank: 'Selected bank:',
  support_letter_file: 'Support letter file',
  project_attachment_file: 'Project attachment file',
  add_action: 'Add action',
  upload_a_new_file: 'Upload a new file',
  state: 'State',
  status: 'Status',
  project_owner_details: {
    accordion: {
      main_tab: {
        header: 'Main Information',
        entity_field: 'Entity Field',
        headquarters: 'Headquarters',
        date_of_establishment: 'Date of Establishment',
        number_of_employees: 'Number of full-time employees of the facility',
        number_of_beneficiaries: "Number of beneficiaries of the entity's service",
      },
      contact_tab: {
        header: 'Contact Information',
        email: 'Email',
        entity_mobile: 'Entity Mobile',
        governorate: 'Governorate',
        region: 'Region',
        center: 'Center (management)',
        twitter: 'Twitter Account',
        website: 'Website',
        phone: 'The Phone',
      },
      license_tab: {
        header: 'License Information',
        license_number: 'License Number',
        license_expiry_date: 'License Expiry Date',
        licnese_issue_date: 'License Issue Date',
        license_file: 'License File',
        letter_of_support_file: 'Letter of Support Files',
      },
      administrative_tab: {
        header: 'Administrative Information',
        ceo_name: 'CEO Name',
        ceo_mobile: 'CEO Mobile',
        chairman_name: 'Chairman Name',
        chairman_mobile: 'Chairman Mobile',
        data_entry_name: 'Data Entry Name',
        data_entry_mobile: 'Data Entry Mobile',
        data_entry_email: 'Data Entry Email',
      },
      bank_tab: {
        header: 'Bank Information',
        bank_cards: 'Bank Cards',
      },
    },
    card_title: 'Partner Name',
    card_content:
      'The Association for Advocacy, Guidance and Community Awareness in the New Industrial Area in Riyadh',
    card_href: 'View all projects of the partner',
    client_details_header: 'Client Profile',
    client_detail_profiles_header: 'Client Profile Detail',
    table_title: 'Projects by ',
    summary: {
      title_main: 'Main Information',
      title_contact: 'Contact Information',
      title_license: 'License Information',
      button_show_all: 'See full Information',
    },
  },
  outter_status: {
    COMPLETED: 'COMPLETED',
    ONGOING: 'ONGOING',
    PENDING: 'PENDING',
    CANCELED: 'CANCELED',
  },
  project_beneficiaries: {
    KIDS: 'KIDS',
    ELDERLY: 'ELDERLY',
    MIDDLE_AGED: 'MIDDLE AGED',
    GENERAL: 'GENERAL',
    MEN: 'MEN',
    WOMEN: 'WOMEN',
  },
  copy_of_the_bank_account_card: 'A copy of the bank account card',
  message_is_empty: 'Message is empty',
  you_can_create_new_message_for_new_conversation:
    'You can create new message for new conversation',
  page_not_found: 'Sorry, page not found',
  desc_page_not_found:
    'Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling',
  go_to_home: 'Go to Home',
  project_card: {
    supervisor: 'Supervisor',
    cahsier: 'Cahsier',
    finance: 'Finance',
    moderator: 'Moderator',
    project_manager: 'Project Manager',
    project_supervisor: 'Supervisor',
    ceo: 'CEO',
    consultant: 'Consultant',
  },
  nothing_payment: 'The Payments haven’t been set yet',
  notification: {
    today: 'Today',
    previous: 'Previous',
    read_all: 'Mark All as Read',
    clear_all: 'Clear All',
    to_project: 'Go to Project',
    appointment: 'See the Appointment',
    join_now: 'Join Now',
    no_notifications_today: 'No Notifications Today',
    no_notifications: 'No Notifications',
    proposal_accepted: 'Proposal Accepted Notifcation',
    proposal_rejected: 'Proposal Rejected Notifcation',
    proposal_item_budget_empty: 'You must fill project budget first!',
    proposal_reviewed: 'Proposal Reviewed Notifcation',
    header: 'Notifications',
    tender_appointment: 'Tender New Appointment',
    subject_five_min_appointment: 'Your appointment will starting soon!',
    content_five_min_appointment: 'This meeting will last 5 minutes, you can join the meeting now',
    subject_payment: 'congratulations, your project fund have been sent!',
    content_payment: 'Please check your account and proof of funds below',
    proof_of_funds: 'Proof of Funds',
  },
  button: {
    btn_final_save_as_draft: 'Send',
    btn_create_proposal: 'Send',
    btn_next_save_as_draft: 'Next',
  },
};

export default en;
