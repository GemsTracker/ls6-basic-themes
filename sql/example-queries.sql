
SELECT template, COUNT(*) FROM ls__surveys GROUP BY template;

SELECT template, surveyls_title FROM ls__surveys INNER JOIN ls__surveys_languagesettings ON sid = surveyls_survey_id WHERE template = 'gt-basic';

-- Update the theme of all existing surveys
UPDATE ls__surveys SET template = 'gt-basic';

-- Update the theme of some existing surveys
UPDATE ls__surveys SET template = 'gt-basic' WHERE template LIKE 'NetQure%';

-- Update the theme of some existing surveys
UPDATE ls__surveys SET template = 'gt-basic-kik' WHERE sid IN (SELECT surveyls_survey_id FROM ls__surveys_languagesettings WHERE surveyls_title LIKE 'KIK%');

-- Allow users in all surveys to save and resume later 
UPDATE ls__surveys SET allowsave = 'Y' WHERE allowsave = 'N';

-- Another useful setting
UPDATE ls__surveys SET autoredirect = 'Y' WHERE autoredirect = 'N';

-- Set the default theme to gt-basic
UPDATE ls__settings_global SET stg_value = 'gt-basic' WHERE stg_name = 'defaulttheme';
