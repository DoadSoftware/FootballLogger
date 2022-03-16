<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html>
<head>

  <sec:csrfMetaTags/>
  <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
  <title>Match Setup</title>

  <script type="text/javascript" src="<c:url value="/webjars/jquery/3.6.0/jquery.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/webjars/bootstrap/5.1.3/js/bootstrap.min.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/javascript/index.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/webjars/select2/4.0.13/js/select2.js"/>"></script>
  
  <link rel="stylesheet" href="<c:url value="/webjars/bootstrap/5.1.3/css/bootstrap.min.css"/>"/>  
  <link href="<c:url value="/webjars/font-awesome/6.0.0/css/all.css"/>" rel="stylesheet">
  <link rel="stylesheet" href="<c:url value="/webjars/select2/4.0.13/css/select2.css"/>"/>  

</head>
<body onload="afterPageLoad('SETUP');">
<form:form name="setup_form" method="POST" action="save_match" enctype="multipart/form-data">
<div class="content py-5" style="background-color: #EAE8FF; color: #2E008B">
  <div class="container">
	<div class="row">
	 <div class="col-md-8 offset-md-2">
       <span class="anchor"></span>
         <div class="card card-outline-secondary">
           <div class="card-header">
             <h3 class="mb-0">Setup</h3>
           </div>
          <div class="card-body">
	         <div class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <button style="background-color:#2E008B;color:#FEFEFE;" class="btn btn-sm" type="button"
			  		name="cancel_match_setup_btn" id="cancel_match_setup_btn" onclick="processUserSelection(this)">
		  		<i class="fas fa-window-close"></i> Back</button>
	         </div>
			  <div class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <label for="select_existing_cricket_matches" class="col-sm-4 col-form-label text-left">Select Football Match 
			    	<i class="fas fa-asterisk fa-sm text-danger" style="font-size: 7px;"></i></label>
			    <div class="col-sm-6 col-md-6">
			      <select id="select_existing_football_matches" name="select_existing_football_matches" 
			      		class="browser-default custom-select custom-select-sm" onchange="processUserSelection(this)">
				        <option value="new_match">New Match</option>
						<c:forEach items = "${match_files}" var = "match">
				          <option value="${match.name}">${match.name}</option>
						</c:forEach>
			      </select>
			    </div>
			  </div>
			  <div id="matchFileName_div" class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;">
			    <label for="matchFileName" class="col-sm-4 col-form-label text-left">Match Filename <i class="fas fa-asterisk fa-sm text-danger" style="font-size: 7px;"></i></label>
			    <div class="col-sm-6 col-md-6">
		             <input type="text" id="matchFileName" name="matchFileName" class="form-control form-control-sm floatlabel" onblur="processUserSelection(this);"></input>
		              <label id="matchFileName-validation" style="color:red; display: none;"></label> 
			    </div>
			  </div>
	        	<table class="table table-striped table-bordered"> 
				  <thead>
			        <tr>
			        	<th>Select HOME Team: 
					      <select id="homeTeamId" name="homeTeamId" class="browser-default custom-select custom-select-sm">
							<c:forEach items = "${teams}" var = "team">
					          <option value="${team.teamId}">${team.fullname}</option>
							</c:forEach>
					      </select>
			        	</th>
			        	<th>Select AWAY Team: 
					      <select id="awayTeamId" name="awayTeamId" class="browser-default custom-select custom-select-sm">
							<c:forEach items = "${teams}" var = "team" varStatus="status">
								<c:choose>
									<c:when test="${status.last}">
							          <option value="${team.teamId}" selected="selected">${team.fullname}</option>
									</c:when>
									<c:otherwise>
							          <option value="${team.teamId}">${team.fullname}</option>
									</c:otherwise>
								</c:choose>
							</c:forEach>
					      </select>
			        	</th>
			        	<th>
						    <button style="background-color:#2E008B;color:#FEFEFE;" class="btn btn-sm" type="button"
						  		name="load_default_team_btn" id="load_default_team_btn" onclick="processUserSelection(this)">
					  		<i class="fas fa-download"></i> Load Teams</button>
			        	</th>
				    </tr>
				  </thead>
				</table>
			  <div id="team_selection_div" class="text-center" style="display:none;">
	         </div>
	         <div id="save_match_div" class="form-group row row-bottom-margin ml-2" style="margin-bottom:5px;display:none;">
			    <button style="background-color:#2E008B;color:#FEFEFE;" class="btn btn-sm" type="button"
			  		name="save_match_btn" id="save_match_btn" onclick="processUserSelection(this)">
		  		<i class="fas fa-download"></i> Save Match</button>
			    <button style="background-color:#2E008B;color:#FEFEFE;" class="btn btn-sm" type="button"
			  		name="reset_match_btn" id="reset_match_btn" onclick="processUserSelection(this)">
		  		<i class="fas fa-window-close"></i> Reset Match</button>
	         </div>
          </div>
         </div>
       </div>
    </div>
  </div>
</div>
</form:form>

</body>
</html>