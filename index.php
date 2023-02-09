<!DOCTYPE html>
<html lang="en">

<head>
  <title>Curiosity Journey - Photos from Mars</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="description" content="" />
  <link rel="stylesheet" type="text/css" href="styles/style.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Cutive+Mono">
  

  <link rel="icon" href="img/favicon.png">
</head>

<body>

  <div id="preload">
    LOADING animation goes here
    
  </div>


  <div id="app">

    <div class="nav"></div>
    
    <div class="header">
      <h1>Curiosity Journey</h1>
      <h2>Photos from Mars</h2>
    </div>

    <div class="main">

      <form id="date-form">
        <input type="date" name="date" id="date-form__date" required>
        <input type="submit" name="submit" id="date-form__submit" value="Find Photos!">
      </form>

      <p>
        Curiosity photo manifest last updated <span id="manifest-date"></span>
      </p>

      <?php
        $file = "/opt/lampp/www/private/curiosityhome/data.xml";
        echo readfile($file);
      ?>

      <div class="results">
        Results
      </div>

    </div>

    <div class="footer">Footer stuff</div>





  </div>  
</body>
<script src="scripts/fetchManager.js"></script>
</html>