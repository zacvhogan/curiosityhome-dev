# Friends on Mars
www.zachogan.com/curiosityhome
Find and view photos taken by Mars rovers!
This takes a date provided by the user and calls the NASA Mars Rover Photos API to return all the photos taken on that date.
Photos are sorted and presented in lists for each camera present on the rover.


## Responsibilities and tools
- Frontend - HTML, CSS, JS, AJAX
- Backend - PHP
- Visual development - Inkscape, Photoshop
- Basic sysadmin - LAMP server on Digital Ocean


## API calls
There are two key API calls to NASA's servers that need to be actioned.
The mission manifest is fetched on page load, and this provides the start date of the rover's mission as well as the most recent database update date. This gives our date picker the correct bounds.
The photo list is fetched when the user interacts with the form date-form.

Script fetchManager.js uses AJAX to query a PHP interface sitting in frontend ("frontController.php"). This interface filters queries by type ("manifest" or "photos") and then _includes_ the nececessary file in backend ("getManifest.php" or "getPhotolist.php").

Queries to "frontController.php" of type "photos" require a second query ("date").

Both "getManifest.php" and "getPhotolist.php" simply call echo file_get_contents(), using the necessary URL for the NASA API call and appending my API key from Apache's env vars. "getPhotoList.php" also appends the user's specified date to the URL query.

TODO: Complete conversion of photo fetching to AJAX. 

**Note that the above probably isn't entirely best practice, and I am seeking advice and further info on how to ensure my PHP is secure and robust.**


## Frontend Data Management
When the API call for fetching photos is resolved, "fetchManager.js" processes the data for display.
This includes pulling the relevant data for each photo entry from the resulting JSON (img URL, photo ID, camera name).
This data is sorted into a _photosObjFull_ object which contains nested keys for each camera type. Photos are sorted by camera type, so that they can be displayed on the page under the correct headings.
HTML is then generated and rendered for the user.
Users are notified if a date has no photos recorded for it (try 1st March 2023).


## Frontend Design Implementation
The background planet system is constructed through rotating divs and imgs in 3D.
The moons are divs attached to an inclined div plane. The moons themselves are animated to be rotated using the inverse of the rotations applied to the rest of the system - this keeps them facing the camera at all times.
The background planet's 'spin' is created using a scrolling background image within a circular div.
The starfield is a simple HTML5 canvas. The number of stars generated scales with the size of the viewport.


## Frontend Design Considerations
Target audience is children. Key considerations include visual appeal (rounded shapes, a variety of colours, and big buttons), responsiveness, and accessibility.






## Major TODO before full release:
- Mobile performance (background animation, try shifting all to Canvas)
- Modal image previews

