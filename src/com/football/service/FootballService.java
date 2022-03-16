package com.football.service;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.football.model.Ground;
import com.football.model.Player;
import com.football.model.Team;

public interface FootballService {
  Player getPlayer(String whatToProcess, String valueToProcess);
  Player getPlayer(String whatToProcess, Player player) throws IllegalAccessException, InvocationTargetException;
  Team getTeam(String whatToProcess, String valueToProcess);
  Ground getGround(int ground_id);
  List<Player> getPlayers(String whatToProcess, String valueToProcess);
  List<Team> getTeams();
  List<Ground> getGrounds();
}