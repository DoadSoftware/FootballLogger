function processWaitingButtonSpinner(whatToProcess) 
{
	switch (whatToProcess) {
	case 'START_WAIT_TIMER': 
		$('.spinner-border').show();
		$(':button').prop('disabled', true);
		break;
	case 'END_WAIT_TIMER': 
		$('.spinner-border').hide();
		$(':button').prop('disabled', false);
		break;
	}
	
}
function afterPageLoad(whichPageHasLoaded)
{
	switch (whichPageHasLoaded) {
	case 'SETUP':
		$('#homeTeamId').select2();
		$('#awayTeamId').select2();
		addItemsToList('LOAD_TOSS',null);
		break;
	}
}
function reloadPage(whichPage)
{
	switch (whichPage) {
	case 'initialise':
		processUserSelection($('#select_broadcaster'));
		break;
	case 'logger':
		processFootballProcedures('POPULATE_AND_LOAD_LOGGER');
		break;
	}
}
function initialiseForm(whatToProcess, dataToProcess)
{
	switch (whatToProcess) {
	case 'SETUP':
		
		if(dataToProcess) {
			document.getElementById('matchFileName').value = dataToProcess.matchFileName;
			document.getElementById('homeTeamId').value = dataToProcess.homeTeamId;
			document.getElementById('awayTeamId').value = dataToProcess.awayTeamId;
			addItemsToList('LOAD_TEAMS',dataToProcess);
			document.getElementById('save_match_div').style.display = '';
		} else {
			document.getElementById('matchFileName').value = '';
			document.getElementById('homeTeamId').selectedIndex = 0;
			document.getElementById('awayTeamId').selectedIndex = 1;
			addItemsToList('LOAD_TEAMS',null);
			document.getElementById('save_match_div').style.display = 'none';
		}
		$('#homeTeamId').prop('selectedIndex', document.getElementById('homeTeamId').options.selectedIndex).change();
		$('#awayTeamId').prop('selectedIndex', document.getElementById('awayTeamId').options.selectedIndex).change();
		break;
	}
}
function processUserSelection(whichInput)
{	
	switch ($(whichInput).attr('name')) {
	case 'select_existing_football_matches':
		if(whichInput.value.toLowerCase().includes('new_match')) {
			initialiseForm('SETUP',null);
		} else {
			processWaitingButtonSpinner('START_WAIT_TIMER');
			processFootballProcedures('LOAD_SETUP');
		}
		break;
	case 'save_match_btn': case 'reset_match_btn':
		switch ($(whichInput).attr('name')) {
		case 'reset_match_btn':
	    	if (confirm('The setup selections of this match will be retained ' +
	    			'but the match data will be deleted permanently. Are you sure, you want to RESET this match?') == false) {
	    		return false;
	    	}
			break;
		}
		if (!checkEmpty(document.getElementById('matchFileName'),'Match Name')) {
			return false;
		} 
		if($('#homeTeamId :selected').val() == $('#awayTeamId :selected').val()) {
			alert('Both teams cannot be same. Please choose different home and away team');
			return false;
		}
		for(var tm=1;tm<=2;tm++) {
			for(var i=1;i<11;i++) {
				for(var j=i+1;j<=11;j++) {
					if(tm == 1) {
						if(document.getElementById('homePlayer,' + i).selectedIndex == document.getElementById('homePlayer,' + j).selectedIndex) {
							alert(document.getElementById('homePlayer,' + i).options[
								document.getElementById('homePlayer,' + i).selectedIndex].text.toUpperCase() + 
								' selected multiple times for HOME team');
							return false;
						}
					} else {
						if(document.getElementById('awayPlayer,' + i).selectedIndex == document.getElementById('awayPlayer,' + j).selectedIndex) {
							alert(document.getElementById('awayPlayer,' + i).options[
								document.getElementById('awayPlayer,' + i).selectedIndex].text.toUpperCase() + 
								' selected multiple times for AWAY team');
							return false;
						}
					}
				}
			}
		}
		switch ($(whichInput).attr('name')) {
		case 'save_match_btn': 
			uploadFormDataToSessionObjects('SAVE_MATCH');
			break;
		case 'reset_match_btn':
			processWaitingButtonSpinner('START_WAIT_TIMER');
			uploadFormDataToSessionObjects('RESET_MATCH');
			break;
		}
		break;
	case 'load_default_team_btn':
		processWaitingButtonSpinner('START_WAIT_TIMER');
		if($('#homeTeamId :selected').val() == $('#awayTeamId :selected').val()) {
			alert('Both teams cannot be same. Please choose different home and away team');
    		processWaitingButtonSpinner('END_WAIT_TIMER');
			return false;
		}
		processFootballProcedures('LOAD_TEAMS',whichInput);
		document.getElementById('save_match_div').style.display = '';
		break;
	case 'cancel_match_setup_btn':
		document.setup_form.method = 'post';
		document.setup_form.action = 'initialise';
	   	document.setup_form.submit();
		break;
	case 'setup_match_btn':
		document.initialise_form.method = 'post';
		document.initialise_form.action = 'setup';
	   	document.initialise_form.submit();
		break;
	case 'select_broadcaster':
		switch ($('#select_broadcaster :selected').val().toUpperCase()) {
		case 'DOAD':
			$('#vizScene').attr('value','/Default/DOAD_In_House/BatBallSummary');
			break;
		}
		break;
	default:
		var cont_name = ''
		if(whichInput.id.includes('home')) {
			cont_name = 'home';
		} else if(whichInput.id.includes('away')) {
			cont_name = 'away';
		}
		if(whichInput.id.includes('goals')) {
			cont_name = cont_name + '_goal';
		} else if(whichInput.id.includes('yellow_cards')) {
			cont_name = cont_name + '_yellow_card';
		} else if(whichInput.id.includes('red_cards')) {
			cont_name = cont_name + '_red_card';
		}else if(whichInput.id.includes('assests')) {
			cont_name = cont_name + '_assest';
		}else if(whichInput.id.includes('corners')) {
			cont_name = cont_name + '_corner';
		}
		if(whichInput.id.includes('increment')) {
			$('#' + cont_name).val(parseInt($('#' + cont_name).val()) + 1);
		} else if(whichInput.id.includes('decrement')) {
			$('#' + cont_name).val(parseInt($('#' + cont_name).val()) - 1);
		}
		uploadFormDataToSessionObjects('SAVE_STATS');
		break;
	}
}
function uploadFormDataToSessionObjects(whatToProcess)
{
	var formData = new FormData();
	var url_path;

	$('input, select, textarea').each(
		function(index){  
			formData.append($(this).attr('id'),document.getElementById($(this).attr('id')).value);  
		}
	);
	
	switch(whatToProcess.toUpperCase()) {
	case 'SAVE_STATS':
		url_path = 'save_stats_data';
		break;
	case 'RESET_MATCH':
		url_path = 'reset_and_upload_match_setup_data';
		break;
	case 'SAVE_MATCH':
		url_path = 'upload_match_setup_data';
		break;
	}
	
	$.ajax({    
		headers: {'X-CSRF-TOKEN': $('meta[name="_csrf"]').attr('content')},
        url : url_path,     
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',     
        success : function(response) {

        	switch(whatToProcess.toUpperCase()) {
        	case 'RESET_MATCH':
        		alert('Match has been reset');
        		processWaitingButtonSpinner('END_WAIT_TIMER');
        		break;
        	case 'SAVE_MATCH':
        		document.setup_form.method = 'post';
        		document.setup_form.action = 'setup_to_logger';
        	   	document.setup_form.submit();
        		break;
        	}
        	
        },    
        error : function(e) {    
       	 	console.log('Error occured in uploadFormDataToSessionObjects with error description = ' + e);     
        }    
    });		
	
}
function processFootballProcedures(whatToProcess)
{
	var valueToProcess;
	
	switch(whatToProcess) {
	case 'LOAD_SETUP':
		valueToProcess = $('#select_existing_football_matches :selected').val();
		break;
	case 'LOAD_TEAMS':
		valueToProcess = $('#homeTeamId :selected').val() + ',' + $('#awayTeamId :selected').val();
		break;
	}

	$.ajax({    
        type : 'Get',     
        url : 'processFootballProcedures.html',     
        data : 'whatToProcess=' + whatToProcess + '&valueToProcess=' + valueToProcess, 
        dataType : 'json',
        success : function(data) {
        	switch(whatToProcess) {
			case 'POPULATE_AND_LOAD_LOGGER':
				addItemsToList('LOAD_LOGGER',data)
				break;
        	case 'LOAD_SETUP':
        		initialiseForm('SETUP',data);
        		break;
			case 'LOAD_TEAMS':
				addItemsToList(whatToProcess,data);
				break;
        	}
			processWaitingButtonSpinner('END_WAIT_TIMER');
	    },    
	    error : function(e) {    
	  	 	console.log('Error occured in ' + whatToProcess + ' with error description = ' + e);     
	    }    
	});
}
function addItemsToList(whatToProcess, dataToProcess)
{
	var select,option,table,tbody,row,div;
	
	switch (whatToProcess) {
	case 'LOAD_LOGGER':
		
		$('#logging_stats_div').empty();
		
		table = document.createElement('table');
		table.setAttribute('class', 'table table-bordered');
		table.setAttribute('id', 'setup_teams');
		tr = document.createElement('tr');
		for (var j = 1; j <= 3; j++) {
		    th = document.createElement('th'); //column
		    switch (j) {
			case 1:
			    text = document.createTextNode($('#home_short_team_name').val() + ' Total'); 
				break;
			case 2:
			    text = document.createTextNode('Stats Type'); 
				break;
			case 3:
			    text = document.createTextNode($('#away_short_team_name').val() + ' Total'); 
				break;
			}
			th.style='color:#008cff';
		    th.appendChild(text);
		    tr.appendChild(th);
		}
		
		thead = document.createElement('thead');
		thead.appendChild(tr);
		table.appendChild(thead);

		tbody = document.createElement('tbody');
		for(var i=0; i<=4; i++) {
			row = tbody.insertRow(tbody.rows.length);
			for(var j=0; j<=2; j++) {
			    div = document.createElement('div');
				switch(j) {
				case 0: case 2:
					for(var k=0; k<=2; k++) {
					    option = document.createElement('input');
						switch(k) {
						case 0:
						    option.type = 'button';
							switch(i) {
							case 0:
								switch(j) {
								case 0:
							    	option.name = 'home_increment_goals_btn';
									break;
								case 2:
							    	option.name = 'away_increment_goals_btn';
									break;
								}
						    	break;
							case 1:
								switch(j) {
								case 0:
							    	option.name = 'home_increment_yellow_cards_btn';
									break;
								case 2:
							    	option.name = 'away_increment_yellow_cards_btn';
									break;
								}
						    	break;
						    case 2:
								switch(j) {
								case 0:
							    	option.name = 'home_increment_red_cards_btn';
									break;
								case 2:
							    	option.name = 'away_increment_red_cards_btn';
									break;
								}
						    	break;
						    case 3:
								switch(j) {
								case 0:
							    	option.name = 'home_increment_assests_btn';
									break;
								case 2:
							    	option.name = 'away_increment_assests_btn';
									break;
								}
						    	break;
						    case 4:
								switch(j) {
								case 0:
							    	option.name = 'home_increment_corners_btn';
									break;
								case 2:
							    	option.name = 'away_increment_corners_btn';
									break;
								}
						    	break;
						    }
						    option.value = '+';
						    option.setAttribute('onclick','processUserSelection(this);');
							break;
						case 1:
						    option.type = 'text';
							switch(i) {
							case 0:
								switch(j) {
								case 0:
								    option.name = 'home_goal';
									break;
								case 2:
								    option.name = 'away_goal';
									break;
								}
						    	break;
							case 1:
								switch(j) {
								case 0:
								    option.name = 'home_yellow_card';
									break;
								case 2:
								    option.name = 'away_yellow_card';
									break;
								}
						    	break;
						    case 2:
								switch(j) {
								case 0:
								    option.name = 'home_red_card';
									break;
								case 2:
								    option.name = 'away_red_card';
									break;
								}
						    	break;
						    case 3:
								switch(j) {
								case 0:
								    option.name = 'home_assest';
									break;
								case 2:
								    option.name = 'away_assest';
									break;
								}
						    	break;
						    case 4:
								switch(j) {
								case 0:
								    option.name = 'home_corner';
									break;
								case 2:
								    option.name = 'away_corner';
									break;
								}
						    	break;
						    }
							dataToProcess.stats.forEach(function(item) {
							    if(option.name.toUpperCase().includes(item.statType)) {
									switch(j) {
									case 0:
									    option.value = item.homeStatCount;
										break;
									case 2:
									    option.value = item.awayStatCount;
										break;
									}
								}
							});			
							if(!option.value) {
							    option.value = '0';
							}			    
						    option.style = 'width:25%';
							//option.style = 'color:#008cff';
							break;
						case 2:
						    option.type = 'button';
							switch(i) {
							case 0:
								switch(j) {
								case 0:
								    option.name = 'home_decrement_goals_btn';
									break;
								case 2:
								    option.name = 'away_decrement_goals_btn';
									break;
								}
						    	break;
							case 1:
								switch(j) {
								case 0:
								    option.name = 'home_decrement_yellow_cards_btn';
									break;
								case 2:
								    option.name = 'away_decrement_yellow_cards_btn';
									break;
								}
						    	break;
						    case 2:
								switch(j) {
								case 0:
								    option.name = 'home_decrement_red_cards_btn';
									break;
								case 2:
								    option.name = 'away_decrement_red_cards_btn';
									break;
								}
						    	break;
						    case 3:
								switch(j) {
								case 0:
								    option.name = 'home_decrement_assests_btn';
									break;
								case 2:
								    option.name = 'away_decrement_assests_btn';
									break;
								}
						    	break;
						    case 4:
								switch(j) {
								case 0:
								    option.name = 'home_decrement_corners_btn';
									break;
								case 2:
								    option.name = 'away_decrement_corners_btn';
									break;
								}
						    	break;
						    }
						    option.value = '-';
						    option.setAttribute('onclick','processUserSelection(this);');
							break;
						}
					    option.id = option.name;
					    div.append(option);
					}
					break;
				case 1:
				    option = document.createElement('label');
					switch(i) {
					case 0:
					    option.innerHTML = 'Goals'
					    break;
					case 1:
					    option.innerHTML = 'Yellow Cards'
					    break;
					case 2:
					    option.innerHTML = 'Red Cards'
					    break;
					case 3:
					    option.innerHTML = 'Assests'
					    break;
					case 4:
					    option.innerHTML = 'Corners'
					    break;
					}
				    option.id = option.name;
				    div.append(option);
					break;
				}
				row.insertCell(j).appendChild(div);
			}
		}
		
		table.appendChild(tbody);
		
		document.getElementById('logging_stats_div').appendChild(table);
		document.getElementById('logging_stats_div').style.display = '';

		break;
		
	case 'LOAD_TEAMS':
		
		$('#team_selection_div').empty();
		document.getElementById('team_selection_div').style.display = 'none';
		
		if (dataToProcess)
		{
			if(dataToProcess.homeSquad.length <=0 || dataToProcess.awaySquad.length <=0) {
				if(dataToProcess.homeSquad.length <=0) {
					alert(dataToProcess.homeTeam.fullname + ' has no players in the database');
				} else if(dataToProcess.awaySquad.length <=0) {
					alert(dataToProcess.awayTeam.fullname + ' has no players in the database');
				}
				return false;
			}
			table = document.createElement('table');
			table.setAttribute('class', 'table table-bordered');
			table.setAttribute('id', 'setup_teams');
			tr = document.createElement('tr');
			for (var j = 0; j <= 3; j++) {
			    th = document.createElement('th'); //column
			    switch (j) {
				case 0:
				    text = document.createTextNode(dataToProcess.homeTeam.fullname); 
					break;
				case 1:
				    text = document.createTextNode(dataToProcess.homeTeam.shortname + ' captain/goal-keeper'); 
					break;
				case 2:
				    text = document.createTextNode(dataToProcess.awayTeam.fullname); 
					break;
				case 3:
				    text = document.createTextNode(dataToProcess.awayTeam.shortname + ' captain/goal-keeper'); 
					break;
				}
			    th.appendChild(text);
			    tr.appendChild(th);
			}
			
			thead = document.createElement('thead');
			thead.appendChild(tr);
			table.appendChild(thead);

			tbody = document.createElement('tbody');
			for(var i=0; i<=10; i++) {
				row = tbody.insertRow(tbody.rows.length);
				for(var j=0; j<=3; j++) {
					select = document.createElement('select');
					select.style = 'width:75%';
					switch(j) {
					case 0: case 2:
						if(j==0) {
							select.name = 'selectHomePlayers';
							select.id = 'homePlayer,' + (i + 1);
						} else if(j==2) {
							select.name = 'selectAwayPlayers';
							select.id = 'awayPlayer,' + (i + 1);
						}
						if(j==0) {
							dataToProcess.homeSquad.forEach(function(hp,index,arr){
								option = document.createElement('option');
								option.value = hp.playerId;
							    option.text = hp.full_name;
							    select.appendChild(option);
							});
						} else if (j==2) {
							dataToProcess.awaySquad.forEach(function(ap,index,arr){
								option = document.createElement('option');
								option.value = ap.playerId;
							    option.text = ap.full_name;
							    select.appendChild(option);
							});
						}
					    select.selectedIndex = i;
						break;
					case 1: case 3:
						if(j==1) {
							select.name = 'selectHomeCaptainGoalKeeper';
							select.id = 'homeCaptainGoalKeeper,' + (i + 1);
						} else {
							select.name = 'selectAwayCaptainGoalKeeper';
							select.id = 'awayCaptainGoalKeeper,' + (i + 1);
						}
						for(var k=0; k<=3; k++) {
							option = document.createElement('option');
							switch (k) {
							case 0:
								option.value = '';
							    option.text = '';
								break;
							case 1:
								option.value = 'captain';
							    option.text = 'Captain';
								break;
							case 2:
								option.value = 'goal_keeper';
							    option.text = 'Goal Keeper';
								break;
							case 3:
								option.value = 'captain_goal_keeper';
							    option.text = 'Captain And Goal Keeper';
								break;
							}
						    select.appendChild(option);
						}
						switch(j) {
						case 1: 
							select.value = dataToProcess.homeSquad[i].captainWicketKeeper;
							break;
						case 3:
							select.value = dataToProcess.awaySquad[i].captainWicketKeeper;
							break;
						}
						break;
					}
					row.insertCell(j).appendChild(select);
					$(select).select2();
				}
			}
			table.appendChild(tbody);
			document.getElementById('team_selection_div').appendChild(table);
			document.getElementById('team_selection_div').style.display = '';
		} 
		break;
	}
}
function checkEmpty(inputBox,textToShow) {

	var name = $(inputBox).attr('id');
	
	document.getElementById(name + '-validation').innerHTML = '';
	document.getElementById(name + '-validation').style.display = 'none';
	$(inputBox).css('border','');
	if(document.getElementById(name).value.trim() == '') {
		$(inputBox).css('border','#E11E26 2px solid');
		document.getElementById(name + '-validation').innerHTML = textToShow + ' required';
		document.getElementById(name + '-validation').style.display = '';
		document.getElementById(name).focus({preventScroll:false});
		return false;
	}
	return true;	
}
