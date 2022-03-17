# LS3 basic theme
The gt-basic LimeSurvey 3 GemsTracker integration theme simplifies the use of LimeSurvey 3 and later 
in conjunction with GemsTracker projects.

It does this by adding theme options that you can configure either for the whole theme or separately 
for each single survey. These are the options most regularly requested by users.

In the near future we expect some additional theme will be added that extend this basic functionality 
with more specialized options. 

## Basic functions
Installing and using the theme enables these basic functions:
- **Saving** and restarting **using GemsTracker** without needing the LS save/load screens.
- **Autosaving**, every minute and / or when switching tabs/screen.
- **Radio buttons** in **Yes No Questions**, so you know for certain which button was selected.
- **Multi select buttons** for **Array Questions**, so you can select a column in one click.
- **Showing groups as tabs** whan showing all questions on one page.
- **Hiding tips** (between the question and answer) completely or clickable.
- **Hiding help texts** (below the answer) clickable.
- **Hide answer options** and subquestions when the label starts with **-/-**.
- **Hiding the slider value**.
- **Hiding the intial slider location**.

## Installation
Download the .zip from the downloads map and import the theme in LimeSurvey.

## Usage
The theme options show all theme settings at the top and describe additional functionality at the bottom.

You can also download the manual from [GitHub](https://github.com/GemsTracker/ls3-basic-themes/tree/main/docs). 

## Maintenance Setup
In order to automatically update this theme when updating a GemsTracker project, include these lines in your `composer.json` file.
- Under `"require"` add: 
```
  "gemstracker/ls3-basic-themes": "dev-main",
```
- Under `"repositories"` add: 
```
{
  "type": "git",
  "url": "https://github.com/GemsTracker/ls3-basic-themes.git"
},
```

The go to your LimeSurvey installation and then to the `upload/themes/survey` directory. There you create a link.

On **Linux**:

`ln -s {gt-project-dir}/vendor/gemstracker/ls3-basic-themes/src/gt-basic gt-basic`

On **Windows**:

`mklink /J gt-basic {project-dir}\vendor\gemstracker\ls3-basic-themes\src\gt-basic`

This is also very useful if you want to be able to edit the project for multiple development sites.
