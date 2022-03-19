package com.football.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map.Entry;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.football.model.Match;
import com.football.model.Player;
import com.football.model.Stats;
import com.football.service.FootballService;
import com.football.util.FootballUtil;

import net.sf.json.JSONObject;

@Controller
@SessionAttributes(value={"session_match","session_selected_broadcaster"})
public class IndexController 
{
	@Autowired
	FootballService footballService;

	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model)  
	{
		model.addAttribute("match_files", new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY).listFiles(new FileFilter() {
			@Override
		    public boolean accept(File pathname) {
		        String name = pathname.getName().toLowerCase();
		        return name.endsWith(".xml") && pathname.isFile();
		    }
		}));
		
		return "initialise";
	}

	@RequestMapping(value = {"/logger", "/setup_to_logger"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String loggerPage(ModelMap model, MultipartHttpServletRequest request,
			@ModelAttribute("session_match") Match session_match,
			@ModelAttribute("session_selected_broadcaster") String session_selected_broadcaster,
			@RequestParam(value = "select_broadcaster", required = false, defaultValue = "") String select_broadcaster,
			@RequestParam(value = "select_football_matches", required = false, defaultValue = "") String selectedMatch)
					throws UnknownHostException, IOException, JAXBException, IllegalAccessException, InvocationTargetException 
	{
		if (request.getRequestURI().contains("setup_to_logger")) {
			session_match = populateMatchVariables((Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
					new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + session_match.getMatchFileName())));
		} else {
			session_selected_broadcaster = select_broadcaster;
			session_match = populateMatchVariables((Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
					new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + selectedMatch)));
		}

		model.addAttribute("session_match", session_match);
		
		return "logger";
	}

	@RequestMapping(value = {"/setup"}, method = RequestMethod.POST)
	public String setupPage(ModelMap model)  
	{
		model.addAttribute("match_files", new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY).listFiles(new FileFilter() {
			@Override
		    public boolean accept(File pathname) {
		        String name = pathname.getName().toLowerCase();
		        return name.endsWith(".xml") && pathname.isFile();
		    }
		}));
		model.addAttribute("teams", footballService.getTeams());
		model.addAttribute("grounds", footballService.getGrounds());
		return "setup";
	}
	
	@RequestMapping(value = {"/upload_match_setup_data", "/reset_and_upload_match_setup_data", 
			"/save_stats_data"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String uploadFormDataToSessionObjects(MultipartHttpServletRequest request,
			@ModelAttribute("session_match") Match session_match)
					throws IllegalAccessException, InvocationTargetException, IOException, JAXBException 
	{
		if (request.getRequestURI().contains("upload_match_setup_data") || request.getRequestURI().contains("reset_and_upload_match_setup_data")) {
			
			List<Player> home_squad = new ArrayList<Player>(); List<Player> away_squad = new ArrayList<Player>();

			if(request.getRequestURI().contains("reset_and_upload_match_setup_data")) {
				session_match = new Match(); 
			}
			
			for (Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
	   			if(entry.getKey().contains(",")) {
   					if(entry.getKey().split(",")[0].equalsIgnoreCase(FootballUtil.HOME + FootballUtil.PLAYER)) {
   						if(home_squad.size() <= FootballUtil.MAXIMUM_PLAYERS) {
   		   					home_squad.add(new Player(Integer.parseInt(entry.getValue()[0]), 
   		   							Integer.parseInt(entry.getKey().split(",")[1])));
   						}
   					} else if(entry.getKey().split(",")[0].equalsIgnoreCase(FootballUtil.AWAY + FootballUtil.PLAYER)) {
   						if(away_squad.size() <= FootballUtil.MAXIMUM_PLAYERS) {
   	   						away_squad.add(new Player(Integer.parseInt(entry.getValue()[0]), 
   		   							Integer.parseInt(entry.getKey().split(",")[1])));
   						}
   					}
	   			} else {
	   				BeanUtils.setProperty(session_match, entry.getKey(), entry.getValue()[0]);
	   			}
	   		}
			
			session_match.setHomeSquad(home_squad);
			session_match.setAwaySquad(away_squad);
			
			for (Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
	   			if(entry.getKey().contains(",")) {
	   				if(entry.getKey().split(",")[0].equalsIgnoreCase(FootballUtil.HOME + FootballUtil.CAPTAIN + FootballUtil.GOAL_KEEPER.replace("_", ""))) {
	   					for(Player plyr:session_match.getHomeSquad()) {
	   						if(plyr.getPlayerPosition() == Integer.parseInt(entry.getKey().split(",")[1])) {
	   							plyr.setCaptainGoalKeeper(entry.getValue()[0]);
	   						}
	   					}
	   				} else if(entry.getKey().split(",")[0].equalsIgnoreCase(FootballUtil.AWAY + FootballUtil.CAPTAIN + FootballUtil.GOAL_KEEPER.replace("_", ""))) {
	   					for(Player plyr:session_match.getAwaySquad()) {
	   						if(plyr.getPlayerPosition() == Integer.parseInt(entry.getKey().split(",")[1])) {
	   							plyr.setCaptainGoalKeeper(entry.getValue()[0]);
	   						}
	   					}
   					}
	   			}
	   		}
			
			Collections.sort(session_match.getHomeSquad());
			Collections.sort(session_match.getAwaySquad());
			
			boolean player_found = false;
			home_squad = new ArrayList<Player>(); away_squad = new ArrayList<Player>();
			for(Player plyr : footballService.getPlayers(FootballUtil.TEAM,String.valueOf(session_match.getHomeTeamId()))) {
				player_found = false;
				for(Player subPlyr : session_match.getHomeSquad()) {
					if (subPlyr.getPlayerId() == plyr.getPlayerId()) {
						player_found = true;
					}
				}
				if(player_found == false) {
					home_squad.add(plyr);
				}
			}
			for(Player plyr : footballService.getPlayers(FootballUtil.TEAM,String.valueOf(session_match.getAwayTeamId()))) {
				player_found = false;
				for(Player subPlyr : session_match.getAwaySquad()) {
					if (subPlyr.getPlayerId() == plyr.getPlayerId()) {
						player_found = true;
					}
				}
				if(player_found == false) {
					away_squad.add(plyr);
				}
			}

			session_match.setHomeOtherSquad(home_squad);
			session_match.setAwayOtherSquad(away_squad);

			new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()).createNewFile();
			new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.EVENT_DIRECTORY + session_match.getMatchFileName()).createNewFile();
			
			session_match = populateMatchVariables(session_match);

			JAXBContext.newInstance(Match.class).createMarshaller().marshal(session_match, 
					new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()));

		} else if (request.getRequestURI().contains("save_stats_data")) {
			
			List<Stats> this_stats = new ArrayList<Stats>();
			for(int i=1; i <= FootballUtil.MAXIMUM_LOGGER_STATS; i++) {
				switch (i) {
				case 1:
					this_stats.add(new Stats(i, FootballUtil.GOAL));
					break;
				case 2:
					this_stats.add(new Stats(i, FootballUtil.YELLOW_CARD));
					break;
				case 3:
					this_stats.add(new Stats(i, FootballUtil.RED_CARD));
					break;
				case 4:
					this_stats.add(new Stats(i, FootballUtil.ASSEST));
					break;
				case 5:
					this_stats.add(new Stats(i, FootballUtil.CORNER));
					break;
				}
			}
			for (Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
				for(Stats stat : this_stats) {
					if(!entry.getKey().contains("_btn")) { // Ignore buttons. Just take statistics text box values
						if(entry.getKey().toUpperCase().contains(stat.getStatType())) {
							if(entry.getKey().toUpperCase().contains(FootballUtil.HOME)) {
								stat.setHomeStatCount(Integer.valueOf(entry.getValue()[0]));
							} else if(entry.getKey().toUpperCase().contains(FootballUtil.AWAY)) {
								stat.setAwayStatCount(Integer.valueOf(entry.getValue()[0]));
							}
						}
					}
				}
	   		}
			session_match.setStats(this_stats);
			JAXBContext.newInstance(Match.class).createMarshaller().marshal(session_match, 
					new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + session_match.getMatchFileName()));
		}
		return JSONObject.fromObject(session_match).toString();
	}
	
	@RequestMapping(value = {"/processFootballProcedures"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processFootballProcedures(
			@ModelAttribute("session_match") Match session_match,
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess) 
					throws IOException, IllegalAccessException, InvocationTargetException, JAXBException
	{	
		switch (whatToProcess.toUpperCase()) {
		case "POPULATE_AND_LOAD_LOGGER":
			return JSONObject.fromObject(session_match).toString();
		case FootballUtil.LOAD_MATCH: case FootballUtil.LOAD_SETUP:

			session_match = (Match) JAXBContext.newInstance(Match.class).createUnmarshaller().unmarshal(
					new File(FootballUtil.FOOTBALL_DIRECTORY + FootballUtil.MATCHES_DIRECTORY + valueToProcess));
			session_match = populateMatchVariables(session_match);
			
			return JSONObject.fromObject(session_match).toString();

		case FootballUtil.LOAD_TEAMS:
			
			if(!valueToProcess.trim().isEmpty()) {
				
				session_match.setHomeTeam(footballService.getTeam(FootballUtil.TEAM, valueToProcess.split(",")[0]));
				session_match.setAwayTeam(footballService.getTeam(FootballUtil.TEAM, valueToProcess.split(",")[1]));
				
				session_match.setHomeSquad(footballService.getPlayers(FootballUtil.TEAM, valueToProcess.split(",")[0]));
				session_match.setAwaySquad(footballService.getPlayers(FootballUtil.TEAM, valueToProcess.split(",")[1]));
			}
			return JSONObject.fromObject(session_match).toString();
		default:
			return JSONObject.fromObject(null).toString();
		}
	}
	
	public Match populateMatchVariables(Match match) throws IllegalAccessException, InvocationTargetException 
	{
		List<Player> players = new ArrayList<Player>();
		
		for(Player plyr:match.getHomeSquad()) 
			players.add(footballService.getPlayer(FootballUtil.PLAYER, plyr));
		match.setHomeSquad(players);
		
		players = new ArrayList<Player>();
		for(Player plyr:match.getAwaySquad()) 
			players.add(footballService.getPlayer(FootballUtil.PLAYER, plyr));
		match.setAwaySquad(players);

		if(match.getHomeTeamId() > 0)
			match.setHomeTeam(footballService.getTeam(FootballUtil.TEAM, String.valueOf(match.getHomeTeamId())));
		if(match.getAwayTeamId() > 0)
			match.setAwayTeam(footballService.getTeam(FootballUtil.TEAM, String.valueOf(match.getAwayTeamId())));
		
		return match;
	}
	
	@ModelAttribute("session_selected_broadcaster")
	public String session_selected_broadcaster(){
		return new String();
	}
	@ModelAttribute("session_match")
	public Match session_match(){
		return new Match();
	}
}