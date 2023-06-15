-- View: public.v_user_mapping

-- DROP VIEW public.v_user_mapping;

CREATE OR REPLACE VIEW public.v_user_mapping
 AS
 SELECT ut.tmra_id,
    ut.uid,
    ut.name,
    ut.mail,
    u.employee_name,
    u.email,
    u.fusionauth_id
   FROM users_trf ut
     LEFT JOIN user3 u ON u.id = ut.tmra_id::text;

