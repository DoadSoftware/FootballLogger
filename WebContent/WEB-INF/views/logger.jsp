<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
  <title>Football Logger</title>
	
  <script type="text/javascript" src="<c:url value="/webjars/jquery/3.6.0/jquery.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/webjars/bootstrap/5.1.3/js/bootstrap.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/javascript/index.js"/>"></script>
  
  <link rel="stylesheet" href="<c:url value="/webjars/bootstrap/5.1.3/css/bootstrap.min.css"/>"/>  
  <link href="<c:url value="/webjars/font-awesome/6.0.0/css/all.css"/>" rel="stylesheet">
	
</head>
<body onload="reloadPage('logger')">
<form:form autocomplete="off" action="POST">
<div class="content py-5" style="background-color: #EAE8FF; color: #2E008B">
  <div class="container">
	<div class="row">
	 <div class="col-md-8 offset-md-2">
       <span class="anchor"></span>
         <div class="card card-outline-secondary">
           <div class="card-header">
             <h3 class="mb-0">Football Logger</h3>   
           </div>
  			<div class="container">
         	  <div class="col-md-8 offset-md-0">
                <h5 class="mb-0">Team Stats</h5>   
	          </div>
           </div>
           <div class="card-body">
			  <div id="select_graphic_options_div" style="display:none;">
			  </div>
			  <div id="logging_stats_div" class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			  </div>
	       </div>
	    </div>
       </div>
    </div>
  </div>
</div>


<div class="container">
<div class="row">
	 <div class="col-md-8 offset-md-2">
       <span class="anchor"></span>
  			<div class="container">
         	  <div class="col-md-8 offset-md-0">
                <h5 class="mb-0">Player Stats</h5>   
	          </div>
           </div>
           
           <div class="card-body">
			  <div id="select_graphic_options_div" style="display:none;">
			  </div>
			  <div id="logging_stats_divs" class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			  </div>
	       </div>
	       </div>
       </div>
  </div>

<input type="hidden" id='home_short_team_name' value="${session_match.homeTeam.shortname}"/>
<input type="hidden" id='away_short_team_name' value="${session_match.awayTeam.shortname}"/>
</form:form>
</body>
</html>