// ----------------------------------------------------------------------

// IF THIS TRANSLATION IS INCORRECT PLEASE IGNORE THIS AS THIS TRANSLATION IS FOR DEMO PURPOSES ONLY
// We are happy if you can help improve the translation by sending an email to support@minimals.cc.

// ----------------------------------------------------------------------

const ar = {
  pages: {
    auth: {
      login: 'صفحة تسجيل الدخول',
      register: 'صفحة إنشاء الحساب',
    },
    client: {
      main: 'صفحة الشريك الرئيسية',
    },
  },
  content: {
    client: {
      main_page: {
        current_projects: 'موازنة المشروع',
        no_current_projects: 'لا يوجد اي مشاريع حالية',
        apply_new_support_request: 'تقديم طلب دعم جديد',
        current_budget: 'موازنة المشروع',
        required_budget: 'الميزانية المطلوبة',
        approved_budget: 'الميزانية المعتمدة',
        not_determined: 'لم تحدد بعد',
        spent_budget: 'الميزانية المصروفة',
        draft_projects: 'مشاريع محفوظة كمسودة',
        project_idea: 'فكرة المشروع',
        complete_the_project: 'أكمل الطلب',
        delete_draft: 'حذف المسودة',
        created_at: 'الإنشاء منذ',
        day: 'يوم',
        previous_support_request: 'مشاريع الدعم السابقة',
        no_projects: 'لا يوجد مشاريع',
        all_projects: 'كل المشاريع',
        completed_projects: 'المشاريع المنتهية',
        pending_projects: 'المشاريع المعلقة',
        track_budget: 'ميزانية المسار',
        total_track_budget: 'الميزانية الكلية للمشروع',
        process_request: 'طلبات قيد الإجراء',
        project_followups: 'متابعات المشروع',
        employee_followup: 'متابعات الموظفين',
        partner_followup: 'متابعات الشريك',
        empty_text_followup: 'لا يوجد اي متابعات',
        empty_add_comment_followup: 'قم بإضافة تعليق او رفع ملف',
        delete_success: 'تم الحذف بنجاح',
      },
    },
    administrative: {
      project_details: {
        payment: {
          heading: {
            exchange_information: 'معلومات إذن الصرف',
            project_budget: 'ميزانية المشروع',
            iban: 'الأيبان',
            registered_payments: 'عدد الدفعات المسجلة',
            total_budget: 'الميزانية الكلية للمشروع',
            amount_spent: 'المبلغ المصروف',
            split_payments: 'تقسيم الدفعات',
          },
          table: {
            td: {
              batch_no: 'الدفعة رقم',
              payment_no: 'مبلغ الدفعة',
              batch_date: 'تاريخ الدفعة',
            },
            btn: {
              review_transfer_receipt: 'استعراض ايصال التحويل',
            },
          },
        },
      },
    },
    messages: {
      btn: {
        create_new_message: 'أنشئ رسالة جديدة',
      },
      empty_user_data: 'قائمة المستخدمين فارغة!',
      text_field: {
        placeholder_list_tracks: 'اختر نوع المسار للموظف',
      },
    },
  },
  errors: {
    login: {
      email: {
        message: 'يجب أن يكون البريد الإلكتروني عنوان بريد إلكتروني صالحًا',
        required: 'البريد الالكتروني مطلوب',
      },
      password: {
        message: '',
        required: 'كلمة المرور مطلوبة',
      },
    },
    register: {
      entity: {
        message: '',
        required: 'اسم الجهة مطلوب',
      },
      client_field: {
        message: '',
        required: 'مجال الجهة مطلوب',
      },
      authority: {
        message: '',
        required: 'الجهة المشرفة مطلوب',
      },
      date_of_esthablistmen: {
        message: '',
        required: 'تاريخ التأسيس مطلوب',
      },
      headquarters: {
        message: '',
        required: 'المقر مطلوب',
      },
      num_of_employed_facility: {
        message: '',
        required: 'عدد الموظفين بدوام كامل مطلوب',
        min: 'عدد الموظفين بدوام كامل يجب أن يكون على الأقل 1',
      },
      num_of_beneficiaries: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
        min: 'عدد المستفيدين من خدمات الجهة يجب أن يكون على الأقل 1',
      },
      region: {
        message: '',
        required: 'ذا الحقل الزامي',
      },
      governorate: {
        message: '',
        required: 'ذا الحقل الزامي',
      },
      center_administration: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
      },
      entity_mobile: {
        message: '',
        required: 'رقم الهاتف المحمول مطلوب',
        length: 'رقم الجوال يجب أن يكون 9 أرقام',
        equal: 'رقم الجوال يجب أن يكون مختلف عن رقم الهاتف',
      },
      entity_employee: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
      },
      phone: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
        length: 'رقم الهاتف يجب أن يكون 9 أرقام',
        exist: 'رقم الجوال موجود بالفعل',
        equal: 'رقم الهاتف يجب أن يكون مختلف عن رقم الجوال',
      },
      license_number: {
        message: '',
        required: 'رقم الرخصة مطلوب',
      },
      license_issue_date: {
        message: '',
        required: 'تاريخ صدور الرخصة مطلوب',
      },
      license_expired: {
        message: '',
        required: 'تاريخ انتهاء الرخصة مطلوب',
      },
      license_file: {
        message: '',
        size: 'حجم الملف يجب أن يكون أقل من 5 ميجا',
        fileExtension: 'يجب أن يكون الملف من نوع pdf, png, jpg, jpeg',
        required: 'ملف الرخصة مطلوب',
      },
      board_ofdec_file: {
        message: '',
        size: 'حجم الملف يجب أن يكون أقل من 5 ميجا',
        fileExtension: 'يجب أن يكون الملف من نوع pdf, png, jpg, jpeg',
      },
      twitter_acount: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
      },
      website: {
        message: '',
        required: 'عدد المستفيدين من خدمات الجهة مطلوب',
      },
      email: {
        message: '',
        required: 'البريد الالكتروني مطلوب',
        email: 'البريد الإلكتروني غير صحيح',
      },
      password: {
        message: '',
        required: 'كلمة المرور مطلوبة',
        new_password: 'كلمة المرور مطلوبة',
        confirm_password: 'كلمة المرور غير متطابقة',
      },
      ceo_name: {
        message: '',
        required: 'اسم المدير العام مطلوب',
      },
      ceo_mobile: {
        message: '',
        required: 'رقم جوال المدير العام مطلوب',
        length: 'رقم جوال المدير العام يجب أن يكون 9 أرقام',
      },
      chairman_name: {
        message: '',
        required: 'اسم رئيس مجلس الإدارة مطلوب',
      },
      chairman_mobile: {
        message: '',
        required: 'رقم جوال رئيس مجلس الإدارة مطلوب',
        length: 'رقم جوال رئيس مجلس الإدارة يجب أن يكون 9 أرقام',
      },
      data_entry_name: {
        message: '',
        required: 'اسم مسؤول البيانات مطلوب',
      },
      agree_on: {
        message: '',
        required: 'الموافقة على الشروط والأحكام مطلوبة',
      },
      data_entry_mobile: {
        message: '',
        required: 'رقم جوال مسؤول البيانات مطلوب',
        length: 'رقم جوال مسؤول البيانات يجب أن يكون 9 أرقام',
      },
      bank_account_number: {
        message: '',
        required: 'رقم الحساب المصرفي مطلوب',
        match: 'رقم الحساب المصرفي غير صحيح',
        min: 'رقم الحساب المصرفي يجب أن يكون 22 رقم',
      },
      bank_account_name: {
        message: '',
        required: 'اسم صاحب الحساب المصرفي مطلوب',
      },
      bank_name: {
        message: '',
        required: 'اسم البنك مطلوب',
      },
      card_image: {
        message: '',
        required: 'صورة البطاقة مطلوبة',
        size: 'حجم الملف يجب أن يكون أقل من 5 ميجا',
        fileExtension: 'يجب أن يكون الملف من نوع pdf, png, jpg, jpeg',
      },
      employee_name: {
        message: '',
        required: 'اسم الموظف مطلوب',
      },
    },
    cre_proposal: {
      project_name: {
        message: '',
        required: 'اسم المشروع مطلوب',
      },
      project_idea: {
        message: '',
        required: 'فكرة المشروع مطلوبة',
      },
      project_location: {
        message: '',
        required: 'مكان تنفيذ المشروع مطلوب',
      },
      project_implement_date: {
        message: '',
        required: 'تاريخ تنفيذ المشروع مطلوب',
      },
      execution_time: {
        message: '',
        required: 'مدة التنفيذ مطلوبة',
        greater_than_0: 'يجب أن يكون وقت التنفيذ أكبر من 0',
      },
      project_beneficiaries: {
        message: '',
        required: 'نوع الفئة المستهدفة مطلوبة',
      },
      letter_ofsupport_req: {
        message: '',
        required: 'خطاب طلب الدعم مطلوب',
        fileSize: 'يجب أن يكون حجم الملف أقل من 30 ميغابايت',
        fileExtension: 'يجب أن يكون امتداد الملف واحد من الأمتدادات التالية: pdf, png, jpg, jpeg',
      },
      project_attachments: {
        message: '',
        required: 'مرفقات المشروع مطلوبة',
        fileSize: 'يجب أن يكون حجم الملف أقل من 30 ميغابايت',
        fileExtension: 'يجب أن يكون امتداد الملف واحد من الأمتدادات التالية: pdf, png, jpg, jpeg',
      },
      project_beneficiaries_specific_type: {
        message: '',
        required: 'نوع الفئة المستهدفة الخارجية مطلوبة عندما تكون الفئة المستهدفة هي خارجية',
      },
      num_ofproject_binicficiaries: {
        message: 'عدد المستفيدين من المشروع يجب أن يكون رقم موجب',
        required: 'عدد المستفيدين من المشروع مطلوب',
      },
      project_goals: {
        message: '',
        required: 'أهداف المشروع مطلوبة',
      },
      project_outputs: {
        message: '',
        required: 'مخرجات المشروع مطلوبة',
      },
      project_strengths: {
        message: '',
        required: 'نقاط القوة للمشروع مطلوبة',
      },
      project_risks: {
        message: '',
        required: 'مخاطر المشروع مطلوبة',
      },
      pm_name: {
        message: '',
        required: 'اسم مدير الإدارة مطلوب',
      },
      pm_mobile: {
        message: 'الرقم يجب أن يكون مكتوب بصيغة ممائلة لهذه الصيغة +9665XXXXXXXX',
        required: 'رقم الجوال مطلوب',
      },
      pm_email: {
        message: '',
        required: 'الايميل مطلوب',
      },
      region: {
        message: '',
        required: 'المنطقة مطلوبة',
      },
      governorate: {
        message: '',
        required: 'المحافظة مطلوبة',
      },
      amount_required_fsupport: {
        message: '',
        required: 'المبلغ المطلوب للدعم مطلوب',
      },
      detail_project_budgets: {
        clause: {
          message: '',
          required: 'البند مطلوب',
        },
        explanation: {
          message: '',
          required: 'الشرح مطلوب',
        },
        amount: {
          message: 'المبلغ يجب أن يكون رقم موجب يدون أية فواصل',
          required: 'القيمة مطلوبة',
        },
      },
    },
  },
  commons: {
    track_type: {
      all_tracks: 'جميع المسارات',
      mosques_track: 'مسار المساجد',
      scholarships_track: 'مسار الجامعات',
      initiatives_track: 'مسار المبادرات',
      baptism_track: 'مسار الاستقطاب',
      syeikh_track: 'مسار السيوخ',
    },
    filter_button_label: 'تصفية',
    chip_canceled: 'تم إلغاء الطلب',
    chip_completed: 'الطلب كامل',
    chip_pending: 'الطلب معلق',
    maintenance_feature_flag: 'هذه الميزة لا تزال قيد الصيانة',
    view_license_file: 'اضغط هنا لرؤية ملف الترخيص',
  },
  demo: {
    title: `Arabic`,
    introduction: `لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. كان Lorem Ipsum هو النص الوهمي القياسي في الصناعة منذ القرن الخامس عشر الميلادي ، عندما أخذت طابعة غير معروفة لوحًا من النوع وتدافعت عليه لعمل كتاب عينة. لقد نجت ليس فقط خمسة قرون ، ولكن أيضًا القفزة في التنضيد الإلكتروني ، وظلت دون تغيير جوهري. تم نشره في الستينيات من القرن الماضي بإصدار أوراق Letraset التي تحتوي على مقاطع Lorem Ipsum ، ومؤخرًا مع برامج النشر المكتبي مثل Aldus PageMaker بما في ذلك إصدارات Lorem Ipsum.`,
  },
  docs: {
    hi: `أهلا`,
    description: `تحتاج مساعدة؟ \n الرجاء مراجعة مستنداتنا`,
    documentation: `توثيق`,
  },
  BAPTISMS: 'قسم التعميدات',
  MOSQUES: 'قسم المساجد',
  CONCESSIONAL_GRANTS: 'قسم المنح الميسر',
  INITIATIVES: 'قسم المبادرات',
  GENERAL: 'القسم العام',
  app: `تطبيق`,
  user: `المستعمل`,
  list: `قائمة`,
  edit: `تعديل`,
  shop: `متجر`,
  blog: `مقالات`,
  post: `بريد`,
  mail: `بريد`,
  chat: `دردشة`,
  cards: `البطاقات`,
  posts: `المشاركات`,
  create: `يزيد`,
  kanban: `كانبان`,
  general: `جنرال لواء`,
  banking: `الخدمات المصرفية`,
  booking: `الحجز`,
  profile: `الملف الشخصي`,
  account: `الحساب`,
  product: `المنتوج`,
  invoice: `فاتورة`,
  details: `تفاصيل`,
  checkout: `الدفع`,
  calendar: `التقويم`,
  analytics: `التحليلات`,
  ecommerce: `التجارة الإلكترونية`,
  management: `إدارة`,
  menu_level_1: `مستوى القائمة 1`,
  menu_level_2a: `مستوى القائمة 2 أ`,
  menu_level_2b: `مستوى القائمة 2 ب`,
  menu_level_3a: `مستوى القائمة 3 أ`,
  menu_level_3b: `مستوى القائمة 3 ب`,
  menu_level_4a: `مستوى القائمة 4 أ`,
  menu_level_4b: `مستوى القائمة 4 ب`,
  item_disabled: `العنصر معطل`,
  item_label: `تسمية العنصر`,
  item_caption: `عنوان العنصر`,
  item_external_link: `رابط خارجي للمادة`,
  description: `وصف`,
  other_cases: `حالات اخرى`,
  item_by_roles: `عنصر حسب الأدوار`,
  only_admin_can_see_this_item: `يمكن للمسؤول فقط رؤية هذا العنصر`,
  main: 'الرئيسية',
  request_project_funding: 'طلب دعم مشروع',
  support_requests_received: 'تلقي طلبات الدعم',
  incoming_support_requests: 'طلبات الدعم الواردة',
  previous_support_requests: 'طلبات الدعم السابقة',
  portal_reports: 'تقارير البوابة',
  drafts: 'طلبات دعم مسودة ',
  previous_funding_requests: 'طلبات دعم سابقة',
  messages: 'الرسائل',
  contact_support: 'تواصل مع الدعم ',
  register_first_tap: 'المعلومات الرئيسية',
  register_second_tap: 'معلومات الاتصال',
  register_third_tap: 'معلومات الترخيص',
  register_fourth_tap: 'بيانات الإدارية',
  register_fifth_tap: 'المعلومات البنكية',
  email_label: 'البريد الإلكتروني',
  password_label: 'كلمة السر',
  remember_me: 'تذكرني',
  forget_the_password: 'نسيت كلمة المرور',

  forgot_your_password: 'نسيت رقمك السري؟',
  forgot_password_details:
    'يرجى إدخال عنوان البريد الإلكتروني المرتبط بحسابك وسنرسل لك عبر البريد الإلكتروني رابطًا لإعادة تعيين كلمة المرور الخاصة بك.',
  login: 'تسجيل الدخول',
  the_login_message: 'الرجاء إدخال عنوان البريد الإلكتروني',
  dont_have_account: 'ليس لديك حساب في المنصة؟',
  register_one: 'قم بإنشاء حساب من هنا',
  add_new_line: 'إنشاء سطر جديد',
  create_new_account: 'إنشاء حساب جديد',
  show_details: 'دراسة المشروع',
  show_project: 'استعراض المشروع',
  completing_exchange_permission: 'إتمام إذن الصرف',
  pending: 'الطلب معلق',
  completed: 'الطلب مكتمل',
  canceled: 'الطلب ملفى',
  create_a_new_support_request: 'إنشاء طلب دعم جديد',
  register_form1: {
    entity: {
      label: 'اسم الجهة*',
      placeholder: 'الرجاء أدخل اسم الجهة',
    },
    vat: {
      label: 'ضريبة القيمة المضافة',
      placeholder: 'هل توافق على ضريبة القيمة المضافة',
    },
    entity_area: {
      label: 'مجال الجهة*',
      placeholder: 'الرجاء اختيار مجال الجهة',
      options: {
        sub_entity_area: 'رئيسي',
        main_entity_area: 'فرعي',
      },
    },
    authority: {
      label: 'الجهة المشرفة*',
      placeholder: 'الرجاء اختيار الجهة المشرفة',
    },
    date_of_establishment: {
      label: 'تاريخ التأسيس*',
      placeholder: 'الرجاء اختيار تحديد تاريخ التأسيس',
    },
    headquarters: {
      label: 'المقر*',
      placeholder: 'الرجاء اختيار نوع المقر',
      options: { rent: 'أجار', own: 'ملك' },
    },
    number_of_employees: {
      label: 'عدد موظفين بدوام كلي للمنشأة*',
      placeholder: 'عدد موظفين المنشأة',
    },
    number_of_beneficiaries: {
      label: 'عدد المستفيدين من خدمات الجهة*',
      placeholder: 'عدد المستفيدين من خدمات الجهة',
    },
  },
  register_form2: {
    region: {
      label: 'المنطقة*',
      placeholder: 'الرجاء اختيار المنطقة',
      options: {},
    },
    city: {
      label: 'المحافظة*',
      placeholder: 'الرجاء اختيار المحافظة',
      options: {},
    },
    center: {
      label: 'مركز الإدارة',
      placeholder: 'الرجاء اختيار المركز',
      options: {},
    },
    mobile_number: {
      label: 'جوال الجهة*',
      placeholder: 'الرجاء كتابة الرقم, مثال: 966511111111+',
      options: {},
    },
    phone: {
      label: 'الهاتف',
      placeholder: 'الرجاء كتابة رقم الهاتف, مثال: 9661xxxxxxxx+',
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
      label: 'كلمة السر*',
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
      placeholder: 'الرجاء كتابة رقم الترخيص',
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
      label: 'جوال المدير التنفيذي*',
      placeholder: 'الرجاء كتابة جوال المدير التنفيذي',
    },
    chairman_name: {
      label: 'اسم رئيس مجلس الإدارة*',
      placeholder: 'الرجاء كتابة اسم الرئيس',
    },
    chairman_mobile: {
      label: 'رئيس موبايل*',
      placeholder: 'الرجاء كتابة رقم هاتف رئيس مجلس الإدارة',
    },
    entery_data_name: {
      label: 'اسم مدخل البيانات*',
      placeholder: 'الرجاء كتابة اسم مدخل البيانات',
    },
    entery_data_phone: {
      label: 'جوال مدخل البيانات*',
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
      label: '*أيبان الحساب البنكي',
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
    step: 'معلومات عامة',
    project_name: {
      label: 'اسم المشروع*',
      placeholder: 'الرجاء كتابة اسم المشروع',
    },
    project_idea: {
      label: 'فكرة المشروع*',
      placeholder: 'الرجاء كتابة فكرة المشروع',
    },
    project_applying_place: {
      label: 'مكان تنفيذ المشروع*',
      placeholder: 'الرجاء اختيار مكان تنفيذ المشروع',
    },
    project_applying_date: {
      label: 'تاريخ تنفيذ المشروع*',
      placeholder: 'الرجاء اختيار تاريخ تنفيذ المشروع',
    },
    applying_duration: {
      label: 'مدة التنفيذ*',
      placeholder: 'الرجاء تحديد مدة التنفيذ (بالساعات)',
    },
    target_group_type: {
      label: 'نوع الفئة المستهدفة*',
      placeholder: 'الرجاء اختيار نوع الفئة المستهدفة',
    },
    letter_support_request: {
      label: 'خطاب طلب الدعم',
      placeholder: 'خطاب الدعم',
    },
    project_attachments: {
      label: 'مرفقات المشروع',
      placeholder: 'مرفقات المشروع',
    },
  },
  funding_project_request_form2: {
    step: 'معلومات تفصيلية عن المشروع',
    number_of_project_beneficiaries: {
      label: 'عدد المستفيدين من المشروع*',
      placeholder: 'الرجاء كتابة عدد المستفيدين من المشروع',
    },
    project_goals: {
      label: 'أهداف المشروع*',
      placeholder: 'الرجاء كتابة أهداف المشروع ',
    },
    project_outputs: {
      label: 'مخرجات المشروع*',
      placeholder: 'الرجاء كتابة مخرجات المشروع ',
    },
    project_strengths: {
      label: 'نقاط القوة للمشروع*',
      placeholder: 'الرجاء كتابة نقاط القوة للمشروع',
    },
    project_risk: {
      label: 'مخاطر المشروع*',
      placeholder: 'الرجاء كتابة مخاطر المشروع',
    },
  },
  funding_project_request_form3: {
    step: 'معلومات الاتصال',
    project_manager_name: {
      label: 'اسم مدير الإدارة*',
      placeholder: 'الرجاء كتابة اسم مدير الإدارة',
    },
    mobile_number: {
      label: 'رقم الجوال*',
      placeholder: 'الرجاء كتابة رقم الجوال',
    },
    email: {
      label: 'البريد الإلكتروني*',
      placeholder: 'الرجاء كتابة البريد الإلكتروني',
    },
    region: {
      label: 'المنطقة*',
      placeholder: 'الرجاء اختيار المنطقة',
    },
    city: {
      label: 'المحافظة*',
      placeholder: 'الرجاء اختيار المحافظة',
    },
  },
  funding_project_request_form4: {
    step: 'الموازنة التفصيلية للمشروع',
    amount_required_fsupport: {
      label: 'المبلغ المطلوب للدعم*',
      placeholder: 'الرجاء كتابة المبلغ المطلوب للدعم',
    },
    item: {
      label: 'البند*',
      placeholder: 'الرجاء كتابة اسم البند',
    },
    explanation: {
      label: 'الشرح*',
      placeholder: 'الرجاء كتابة الشرح',
    },
    amount: {
      label: 'المبلغ*',
      placeholder: 'المبلغ المطلوبة',
    },
  },
  funding_project_request_form5: {
    step: 'معلومات الحساب البنكي',
    amount_required_for_support: {
      label: 'المبلغ المطلوب للدعم*',
      placeholder: 'الرجاء كتابة المبلغ المطلوب للدعم',
    },
    previously_added_banks: {
      label: 'بنوك مضافة سابقا*',
    },
    add_new_bank_details: {
      label: 'اضافة حساب بنكي جديد',
    },
    agree_on: {
      label: 'أقر بصحة المعلومات الواردة في هذا النموذج وأتقدم بطلب دعم المشروع',
    },
  },
  funding_project_request_form6: {
    bank_account_number: {
      label: 'أيبان الحساب البنكي*',
      placeholder: 'رقم الحساب البنكي',
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
  next: 'التالي',
  going_back_one_step: 'رجوع',
  saving_as_draft: 'حفظ كمسودة',
  send: 'إرسال',
  add: 'إضافة',
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
    message_title: {
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
  incoming_funding_requests: 'الطلبات الواردة',
  project_details: {
    heading: 'تفاصيل المشروع',
    actions: {
      main: 'العامة',
      project_budget: 'موازنة المشروع',
      follow_ups: 'المتابعات',
      payments: 'الدفعات',
      project_path: 'مسار المشروع',
      project_timeline: 'الخطة الزمنية',
      exchange_details: 'تفاصيل الصرف',
    },
  },
  incoming_exchange_permission_requests: 'طلبات إذن الصرف الواردة',
  requests_in_process: 'طلبات قيد الاجراء',
  incoming_funding_requests_project_supervisor: 'طلبات الدعم الواردة',
  payment_adjustment: 'ضبط الدفعات',
  appointments_with_partners: 'المواعيد مع الشركاء',
  exchange_permission: 'إذن الصرف',
  transaction_progression: 'سير المعاملات',
  tracks_budget: 'ميزانية المسارات',
  gregorian_year: 'السنة الميلادية',
  application_and_admission_settings: 'إعدادات التقديم و القبول',
  mobile_settings: 'إعدادات الجوال',
  system_messages: 'رسائل النظام',
  system_configuration: 'إعدادات النظام',
  users_and_permissions: 'المستخدمين والصلاحيات',
  authority: 'الجهة المشرفة',
  entity_area: 'مجال الجهة',
  regions_project_location: 'المناطق - مكان المشروع',
  entity_classification: 'تصنيف الجهة',
  bank_name: 'اسم البنك',
  beneficiaries: 'المستفيدين',
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
  accept_project: 'قبول المشروع',
  reject_project: 'رفض المشروع',
  partner_details: {
    send_messages: 'ارسال رسالة للشريك',
    submit_amendment_request: 'ارسال طلب تعديل',
  },

  // tender_moderator
  daily_stats: 'الإحصائيات اليومية',
  acceptable_projects: 'المشاريع المقبولة',
  incoming_new_projects: 'المشاريع الجديدة الواردة',
  pending_projects: 'المشاريع المعلقة',
  total_number_of_projects: 'إجمالي عدد المشاريع',
  project_acceptance: 'قبول المشروع',
  project_rejected: 'رفض المشروع',
  rejected_projects: 'المشاريع المرفوضة',
  send_message_to_partner: 'ارسال رسالة للشريك',
  submit_amendment_request: 'ارسال طلب تعديل',
  view_all: 'عرض الكل',
  accept: 'قبول',
  reject: 'رفض',
  close: 'اغلاق',
  supervisors: 'المشرفين',
  path: 'المسار',
  procedures: 'الإجراءات',
  supportOutputs: 'المخرجات الداعمة',

  // TENDER_CEO PAGES
  rejection_list: 'قائمة الرفض', //navigation
  project_management: 'إدارة المشروع', //navigation
  project_management_table: {
    headline: 'إدارة المشروع',
  },
  rejection_list_table: {
    headline: 'قائمة الرفض',
  },
  project_management_headercell: {
    project_number: 'رقم المشروع',
    project_name: 'اسم المشروع',
    association_name: 'اسم العميل',
    section: 'القسم',
    date_created: 'تاريخ الانشاء',
    events: 'الاحداث',
    days: 'أيام',
    sent_section: 'القسم المرسل',
    clients_name: 'اسم العميل',
    employee: 'موظف',
  },
  concessional_card_insights: {
    title: {
      reserved_budget: 'الميزانية المخصصة',
      spent_budget: 'الميزانية المنفقة',
      total_budget_for_the_course: 'إجمالي الميزانية للمسار',
    },
    headline: {
      the_concessional_grant_track_budget: 'مسار الميزانية المخصصة',
    },
  },
  mosques_card_insights: {
    title: {
      reserved_budget: 'الميزانية المخصصة',
      spent_budget: 'الميزانية المنفقة',
      total_budget_for_the_course: 'إجمالي الميزانية للمسار',
    },
    headline: {
      mosques_grant_track_budget: 'مسار الميزانية المخصصة',
    },
  },
  complexity_card_insights: {
    title: {
      reserved_budget: 'الميزانية المخصصة',
      spent_budget: 'الميزانية المنفقة',
      total_budget_for_the_course: 'إجمالي الميزانية للمسار',
    },
    headline: {
      complexity_grant_track_budget: 'مسار الميزانية المخصصة',
    },
  },
  initiatives_card_insights: {
    title: {
      reserved_budget: 'الميزانية المخصصة',
      spent_budget: 'الميزانية المنفقة',
      total_budget_for_the_course: 'إجمالي الميزانية للمسار',
    },
    headline: {
      initiatives_track_budget: 'مسار الميزانية المخصصة',
    },
  },

  // filter above table on project management and rejection list
  table_filter: {
    sortby_title: 'ترتيب حسب',
    sortby_options: {
      date_created_oldest: 'تاريخ الانشاء (الأقدم)',
      date_created_newest: 'تاريخ الانشاء (الأحدث)',
      project_name_az: 'اسم المشروع (أ-ي)',
      project_name_za: 'اسم المشروع (ي-أ)',
      association_name_az: 'اسم الجمعية (أ-ي)',
      association_name_za: 'اسم الجمعية (ي-أ)',
      section_az: 'القسم (أ-ي)',
      section_za: 'القسم (ي-أ)',
      project_number_lowest: 'رقم المشروع (الأقل)',
      project_number_highest: 'رقم المشروع (الأعلى)',
    },
  },

  table_actions: {
    view_details: 'عرض التفاصيل',
    delete_button_label: 'حذف',
  },
  continue_studying_the_project: 'متابعة الداراسة',
  no_employee: 'لا يوجد',

  // ACCOUNT_MANAGER PAGES
  account_manager: {
    button: {
      approveEdit: 'تمت الموافقة على طلب التعديل',
      rejectEdit: 'تم رفض طلب التعديل',
    },
    card: {
      suspended_partners: 'الشركاء  المعلقين آليا',
      active_partners: 'الشركاء المفعلين',
      rejected_partners: 'الجهات المرفوضة',
      number_of_request: 'عدد طلبات الانضمام الكلي',
    },
    heading: {
      daily_stats: 'احصائيات يومية',
      new_join_request: 'طلبات الانضمام الواردة',
      link_view_all: 'عرض الكل',
      info_update_request: 'طلبات تحديث المعلومات',
      partner_management: 'إدارة الشركاء',
      amandment_request: 'ارسال طلب تعديل للشريك',
      subhead_amandment_request: 'قم بكتابة الملاحظات المناسبة لإعلام الشريك بالامور المطلوبة منه',
    },
    table: {
      th: {
        partner_name: 'اسم الشريك',
        createdAt: 'تاريخ التسجيل',
        account_status: 'حالة الحساب',
        request_status: 'حالة الطلب',
        events: 'الاحداث',
      },
      td: {
        btn_account_review: 'استعراض الحساب',
        btn_view_partner_projects: 'عرض مشاريع الشريك',
        label_waiting_activation: 'بانتظار التفعيل',
        btn_view_edit_request: 'عرض طلب تعديل الشريك',
        label_active_account: 'حساب مفعل',
        label_canceled_account: 'حساب ملغى',
        label_pending: 'قيد الانتظار',
        label_approved: 'مقبول',
        label_rejected: 'مرفوض',
      },
    },
    accept_project: 'قبول المشروع',
    reject_project: 'رفض المشروع',
    partner_details: {
      main_information: 'المعلومات الرئيسية',
      number_of_fulltime_employees: 'عدد موظفين بدوام كلي للمنشأة',
      number_of_beneficiaries: 'عدد المستفيدين من خدمات الجهة',
      date_of_establishment: 'تاريخ التأسيس',
      headquarters: 'المقر',
      license_information: 'معلومات الترخيص',
      license_number: 'رقم الترخيص',
      entity_name_of_partner: 'اسم الكيان للشريك',
      license_expiry_date: 'تاريخ انتهاء الترخيص',
      license_issue_date: 'تاريخ اصدار الترخيص',
      license_file: 'ملف الترخيص',
      administrative_data: 'بيانات الإدارية',
      ceo_name: 'اسم المدير التنفيذي',
      ceo_mobile: 'جوال المدير التنفيذي:',
      chairman_name: 'اسم رئيس مجلس الإدارة',
      chairman_mobile: 'جوال رئيس مجلس الإدارة',
      data_entry_name: 'اسم مدخل البيانات',
      mobile_data_entry: 'جوال مدخل البيانات',
      board_ofdec_file: 'ملف مجلس الإدارة',
      data_entry_mail: 'بريد مدخل البيانات',
      contact_information: 'معلومات الاتصال',
      center_management: 'المركز (الإدارة)',
      governorate: 'المحافظة',
      region: 'المنطقة',
      email: 'البريد الإلكتروني',
      twitter_account: 'حساب تويتر',
      website: 'الموقع الإلكتروني',
      phone: 'الهاتف',
      bank_information: 'المعلومات البنكية',
      send_messages: 'ارسال رسالة للشريك',
      submit_amendment_request: 'ارسال طلب تعديل',
      btn_deleted_account: 'حذف الحساب',
      btn_activate_account: 'تفعيل الحساب',
      btn_disabled_account: 'تعطيل الحساب',
      btn_amndreq_send_request: 'ارسال الطلب',
      btn_amndreq_back: 'رجوع',
      form: {
        amndreq_label: 'ملاحظات على معلومات الحساب*',
        amndreq_placeholder: 'الرجاء كتابة الملاحظات هنا',
      },
      notification: {
        disabled_account: 'تم تعطيل الحساب بنجاح!',
        activate_account: 'تم تفعيل الحساب بنجاح!',
        deleted_account: 'تم حذف الحساب بنجاح!',
      },
    },
    search_bar: 'اكتب اسم للبحث عنه',
  },
  proposal_approved: 'تم قبول الطلب بنجاح',
  proposal_rejected: 'تم رفض الطلب بنجاح',
  proposal_stepback: 'تم تغيير حالة المشروع',
  proposal_created: 'تم انشاء المشروع بنجاح',
  proposal_saving_draft: 'تم حفظ المشروع كمسودة',

  // PORTAL REPORTS
  ceo_portal_reports: {
    bar_chart: {
      headline: {
        partners: 'الشركاء',
      },
      series_name: {
        last_month: 'الشهر الماضي',
        this_month: 'هذا الشهر',
        last_week: 'الاسبوع الماضى',
        this_week: 'هذا الاسبوع',
      },
      label: {
        partners_need_to_active: 'الشركاء المطلوب تفعيلهم',
        active_partners: 'الشركاء المفعلين',
        rejected_partners: 'الشركاء المرفوضين',
        pending_partners: 'الشركاء المعلقين',
      },
    },
  },
  section_portal_reports: {
    heading: {
      reports: 'التقارير',
      average_transaction: 'متوسط سرعة إنجاز المعاملات في المنصة',
      achievement_effectiveness: 'الانجاز والفعالية الخاصة بالموظفين',
      mosque_track_budget: 'ميزانية مسار المساجد',
      concessional_track_budget: 'ميزانية مسار المنح الميسر',
      initiatives_track_budget: 'ميزانية مسار المبادرات',
      complexity_track_budget: 'ميزانية مسار التعميدات',
      total_number_of_request: 'العدد الكلي للطلبات',
      authorities_label: 'حسب الجهة',
      by_regions: 'حسب المناطق',
      by_governorate: 'حسب المحافظة',
      ongoing: 'جاري التنفيذ',
      canceled: 'ألغيت',
      empty_data: 'البيانات فارغة',
      total_number_beneficiaries: 'العدد الكلي للمستفيدين من المشاريع',
      type_beneficiaries_project: 'نوع المتسفيدين من المشاريع',
      gender: {
        general: 'أخرى',
        men: 'رجال',
        woman: 'فتيات',
        middle_aged: 'شباب',
        kids: 'أشبال',
        elderly: 'كبار السن',
      },
      // Partner tabs
      depending_of_partner: 'حسب حالة الشريك',
    },
    label: {
      WAITING_FOR_ACTIVATION: 'يجب أن ينشط الشركاء',
      ACTIVE_ACCOUNT: 'شركاء نشطون',
      SUSPENDED_ACCOUNT: 'الشركاء المعلقين',
      CANCELED_ACCOUNT: 'الشركاء الملغون',
      REVISED_ACCOUNT: 'مراجعة الشركاء',
      WAITING_FOR_EDITING_APPROVAL: 'يحتاج الشركاء إلى الموافقة',
      series_name: {
        last_month: 'الشهر الماضي',
        this_month: 'هذا الشهر',
      },
    },
    form: {
      date_picker: {
        label: {
          start_date: 'تاريخ البداية',
          end_date: 'تاريخ النهاية',
        },
      },
    },
    tabs: {
      label_1: 'معلومات عن الطلبات',
      label_2: 'معلومات عن الشركاء',
      label_3: 'معلومات عن الميزانية',
      label_4: 'معلومات عن الانجاز والفعالية',
    },
    button: {
      create_special_report: 'إنشاء تقرير خاص',
    },
    table: {
      th: {
        employee_name: 'Employee Name',
        account_type: 'Account Type',
        section: 'Section',
        number_of_clock: 'Number of Clock',
      },
    },
    total_budget_for_the_course: 'الميزانية الكلية للمسار',
    riyals: 'ريال',
    hours: 'ساعة',
    spent_budget: 'الميزانية المصروفة',
    reserved_budget: 'الميزانية المحجوزة',
    since_last_weeks: 'منذ الأسابيع الماضية',
    initiatives_track: 'مسار المبادرات',
    facilitated_scholarship_track: 'مسار المنح الميسر',
    the_path_of_the_mosques: 'مسار المساجد',
    the_path_of_baptisms: 'مسار التعميدات',
  },

  // massaging
  message: 'رسالة',
  new_message_modal: {
    title: 'إنشاء رسالة جديدة',
    form: {
      label: {
        track_type: 'نوع المسار',
        employees: 'الموظفين',
        search_employee: 'ابحث في اسم العميل',
      },
    },
  },
  message_tab: {
    internal: 'المراسلات الداخلية',
    external: 'المراسلات الخارجية',
  },
  filte_message_modal: {
    title: 'تصفية الرسائل',
  },

  // User Profile
  user_profile: {
    label: {
      page_title: 'الملف الشخصي',
      main_information: 'المعلومات الرئيسية',
      contact_information: 'معلومات الاتصال',
      edit_button: 'تعديل معلومات الحساب',
    },
    fields: {
      first_name: 'الاسم الاول',
      last_name: 'الاسم الاخير',
      address: 'العنوان',
      region: 'المنطقة',
      email: 'البريد الالكتروني',
      phone_number: 'رقم الهاتف',
    },
  },

  // amandement
  proposal_amandement: {
    button_label: 'ارسال طلب تعديل الى المشرف',
    forms: {
      notes: 'ملاحظات على الطلب',
      notes_placeholder: 'يرجى كتابة ملاحظاتك هنا',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_moderator: {
      page_name: 'مسؤول الفرز - تعديلات الطلبات',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_ceo: {
      page_name: 'الرئيس التنفيذي - تعديلات الطلبات',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_project_manager: {
      page_name: 'مدير الإدارة - تعديلات الطلبات',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_finance: {
      page_name: 'المالية - تعديلات الطلبات',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_cashier: {
      page_name: 'أمين الصندوق - تعديلات الطلبات',
      headline: 'إرسال طلب تعديل لمشرف المشاريع',
      sub_headline:
        'اختر الحقول التي تريد تعديلها واكتب الملاحظات المناسبة لإبلاغ الشريك بالأشياء المطلوبة منه',
    },
    tender_project_supervisor: {
      page_name: 'مشرف المشاريع - تعديلات الطلبات',
      headline: 'ارسال طلب تعديل مسؤول الفرز',
      sub_headline: 'قم بكتابة الملاحظات المناسبة لإعلام مسؤول الفرز بالامور المطلوبة منه',
    },
  },
  client_appointments: 'المواعيد مع المؤسسة',
  day: 'يوم',
  from: 'من',
  to: 'إلى',
  choose_suitable_time: 'الرجاء اختيار الساعة المناسبة',
  sunday: 'الأحد',
  monday: 'الاثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  pick_your_availabe_time: 'اضبط وقت تواجدك',
  choose_your_week_hours: 'حدد ساعاتك الأسبوعية',
  show_clients_project_detail: 'عرض التفاصيل',
  appointments_with_clients: 'المواعيد مع الشركاء',
  booking_for_a_meeting: 'حجز موعد مقابلة',
  todays_meetings: 'اجتماعات اليوم',
  upcoming_meetings: 'اجتماعات قادمة',
  appointments_with_organization: 'المواعيد مع المؤسسة',
  adding_the_available_time: 'اضافة مواعيد تواجدك',
  edeting_the_available_time: 'تعديل مواعيد تواجدك',
  appointments: 'الاجتماعات',
  requests_for_meeting: 'طلبات للاجتماع',
  please_choose_entity_field: 'الرجاء اختار مجال الجهة',
  entity_field_main: 'رئيسي',
  entity_field_sub_main: 'فرعي',
  please_choose_the_name_of_the_client: 'الرجاء اختيار اسم الشريك',
  write_name_to_search: 'اكتب اسم للبحث عنه',
  booking_an_appointment: 'حجز موعد',
  acceptableRequest: 'مشاريع مقبولة',
  incomingNewRequest: 'مشاريع جديدة واردة',
  pendingRequest: 'مشاريع معلقة',
  rejectedRequest: 'مشاريع مرفوضة',
  totalRequest: 'عدد مشاريع الكلي',
  projects: 'مشاريع',
  login_message_error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  budget_error_message: 'مجموع الميزانية يجب أن يكون مساوٍ للرقم المطلوب',
  banking_error_message: 'الرجاء اختيار بطاقة بنك للمتابعة',
  sign_out: 'تسجيل الخروج',
  tender_accounts_manager: 'مدير الحسابات',
  tender_admin: 'الأدمن',
  tender_ceo: 'الرئيس التنفيذي',
  tender_cashier: 'أمين الصندوق',
  tender_client: 'المستخدم',
  tender_consultant: 'المستشار',
  tender_finance: 'المالية',
  tender_moderator: 'مسؤول الفرز',
  tender_project_manager: 'مدير الإدارة',
  tender_project_supervisor: 'مشرف المشروع',
  account_permission: 'صلاحيات الحساب',
  permissions: {
    CEO: 'الرئيس',
    PROJECT_MANAGER: 'مدير الإدارة',
    PROJECT_SUPERVISOR: 'مشرف المشاريع',
    CONSULTANT: 'لجنة المستشارين',
    FINANCE: 'محاسب',
    CASHIER: 'أمين صندوق',
    MODERATOR: 'مسؤول الفرز',
    ACCOUNTS_MANAGER: 'إدارة الشركاء (مشرف الحسابات)',
    ADMIN: 'سوبر ادمن',
  },
  review: {
    order_status: 'حالة الطلب',
    classification_field: 'مجال التصنيف',
    review_by_supervisor: 'مراجعة من قبل المشرف',
    closing_report: 'التقرير الختامي',
    closing_agreement: 'اتفاق ختامي',
    vat_in_project: 'ضريبة القيمة المضافة في المشروع',
    vat: 'ضريبة القيمة المضافة٪',
    inclu_or_exclu: 'الدفع شامل أو حصري',
    number_of_payment: 'عدد المدفوعات',
    payment_support: 'دعم الدفع',
    support_amount_inclu: 'مبلغ الدعم شاملاً ضريبة القيمة المضافة',
    procedure: 'إجراء',
    note_on_project: 'ملاحظة حول المشروع',
    support_output: 'إخراج الدعم',
  },
  project_already_reviewed_by_supervisor: 'تمت مراجعة هذا المشروع بالفعل من قبل المشرف',
  show_modified_fields: 'إظهار الحقول المعدلة',
  project_implementation_date: ' تاريخ تنفيذ المشروع:',
  where_to_implement_the_project: 'مكان تنفيذ المشروع:',
  number_of_beneficiaries_of_the_project: 'عدد المستفيدين من المشروع:',
  implementation_period: 'مدة التنفيذ:',
  target_group_type: 'نوع الفئة المستهدفة:',
  support_type: 'نوع الدعم:',
  full_support: 'دعم كامل',
  partial_support: 'دعم جزئي',
  with: 'مع',
  amount: 'مقدار',
  project_idea: '>فكرة المشروع:',
  project_goals: 'أهداف المشروع:',
  project_outputs: 'مخرجات المشروع:',
  project_strengths: 'نقاط القوة للمشروع:',
  project_risks: 'مخاطر المشروع:',
  email: 'البريد الإلكتروني:',
  mobile_number: 'رقم الجوال:',
  governorate: 'المحافظة:',
  amount_required_for_support: 'المبلغ المطلوب للدعم:',
  selected_bank: 'المصرف المختار:',
  support_letter_file: 'ملف خطاب طلب الدعم',
  project_attachment_file: 'ملف مرفقات المشروع',
  add_action: 'إضافة إجراء',
  upload_a_new_file: 'رفع ملف جديد',
  state: 'ولاية',
  status: 'حالة',
  project_owner_details: {
    accordion: {
      main_tab: {
        header: 'المعلومات الرئيسية',
        entity_field: 'مجال الجهة',
        headquarters: 'المقر الرئيسي',
        date_of_establishment: 'تاريخ التأسيس',
        number_of_employees: 'عدد الموظفين الدوام الكامل للمنشأة',
        number_of_beneficiaries: 'عدد المستفيدين من خدمات الجهة',
      },
      contact_tab: {
        header: 'معلومات الاتصال',
        email: 'البريد الإلكتروني',
        entity_mobile: 'جوال الجهة',
        governorate: 'المحافظة',
        region: 'المنطقة',
        center: 'المركز (إدارة)',
        twitter: 'حساب تويتر',
        website: 'الموقع الإلكتروني',
        phone: 'الهاتف',
      },
      license_tab: {
        header: 'معلومات الترخيص',
        license_number: 'رقم الترخيص',
        license_expiry_date: 'تاريخ انتهاء الترخيص',
        licnese_issue_date: 'تاريخ صدور الترخيص',
        license_file: 'ملف الترخيص',
        letter_of_support_file: 'ملفات الدعم الرسمي',
      },
      administrative_tab: {
        header: 'معلومات إدارية',
        ceo_name: 'اسم رئيس مجلس الإدارة',
        ceo_mobile: 'جوال رئيس مجلس الإدارة',
        chairman_name: 'اسم رئيس مجلس الإدارة',
        chairman_mobile: 'جوال رئيس مجلس الإدارة',
        data_entry_name: 'اسم مدخل البيانات',
        data_entry_mobile: 'جوال مدخل البيانات',
        data_entry_email: 'البريد الإلكتروني لمدخل البيانات',
      },
      bank_tab: {
        header: 'معلومات البنك',
        bank_cards: 'بطاقات البنك',
      },
    },
    card_title: 'اسم الشريك',
    card_content: 'الجمعية للدعم والإرشاد والوعي الاجتماعي في منطقة الصناعة الجديدة في الرياض',
    card_href: 'عرض جميع المشاريع للشريك',
    client_details_header: 'ملف العميل',
    client_detail_profiles_header: 'تفاصيل ملف العميل',
    table_title: 'المشاريع بواسطة',
    summary: {
      title_main: 'المعلومات الرئيسية',
      title_contact: 'معلومات الاتصال',
      title_license: 'معلومات الترخيص',
      button_show_all: 'عرض جميع المعلومات',
    },
  },
  outter_status: {
    COMPLETED: 'منجز',
    ONGOING: 'جاري التنفيذ',
    PENDING: 'ريثما',
    CANCELED: 'ألغيت',
  },
  project_beneficiaries: {
    KIDS: 'أطفال',
    ELDERLY: 'كبار السن',
    MIDDLE_AGED: 'منتصف العمر',
    GENERAL: 'جنرال لواء',
    MEN: 'رجال',
    WOMEN: 'النساء',
  },
  copy_of_the_bank_account_card: 'صورة بطاقة الحساب البنكي',
  message_is_empty: 'الرسالة فارغة',
  you_can_create_new_message_for_new_conversation: 'يمكنك إنشاء رسالة جديدة لمحادثة جديدة.',
  page_not_found: 'عذرا، لم يتم العثور على الصفحة',
  desc_page_not_found:
    'معذرةً ، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما أخطأت في كتابة عنوان URL؟ تأكد من التحقق من التهجئة',
  go_to_home: 'اذهب إلى الصفحة الرئيسية',
  project_card: {
    supervisor: 'مشرف',
    cahsier: 'أمين الصندوق',
    finance: 'المالية',
    moderator: 'الوسيط',
    project_manager: 'مدير المشروع',
    project_supervisor: 'مشرف',
    ceo: 'المدير التنفيذي',
    consultant: 'مستشار',
  },
  nothing_payment: 'لم يتم تعيين المدفوعات حتى الآن',
  notification: {
    today: 'اليوم',
    previous: 'سابق',
    read_all: 'علامات مقروءه',
    clear_all: 'امسح الكل',
    to_project: 'انتقل إلى المشروع',
    appointment: 'انظر التعيين',
    join_now: 'نضم الان',
    no_notifications_today: 'لا إخطارات اليوم',
    no_notifications: 'لا إشعارات',
    proposal_accepted: 'إخطار قبول الاقتراح',
    proposal_rejected: 'الإخطار برفض الاقتراح',
    proposal_item_budget_empty: 'يجب عليك ملء ميزانية المشروع أولا',
    proposal_reviewed: 'تم استلام الإخطار بالاقتراح',
    header: 'الإشعارات',
    tender_appointment: 'موعد العطاء الجديد',
    subject_five_min_appointment: 'موعدك سيبدأ قريبا!',
    content_five_min_appointment: 'سيستمر هذا الاجتماع 5 دقائق ، يمكنك الانضمام إلى الاجتماع الآن',
    subject_payment: 'تهانينا ، لقد تم إرسال صندوق مشروعك!',
    content_payment: 'يرجى التحقق من حسابك وإثبات الأموال أدناه',
    proof_of_funds: 'الدليل على الأموال',
  },
};

export default ar;
