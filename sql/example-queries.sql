
-- Update the theme of all existing surveys
UPDATE ls__surveys SET template = 'gt-basic';

-- Update the theme of some existing surveys
UPDATE ls__surveys SET template = 'gt-basic' WHERE template LIKE 'NetQure%';

-- Allow users in all surveys to save and resume later 
UPDATE ls__surveys SET allowsave = 'Y' WHERE allowsave = 'N';

-- Another useful setting
UPDATE ls__surveys SET autoredirect = 'Y' WHERE autoredirect = 'N';

-- Set the default theme to gt-basic
UPDATE ls__settings_global SET stg_value = 'gt-basic' WHERE stg_name = 'defaulttheme';
