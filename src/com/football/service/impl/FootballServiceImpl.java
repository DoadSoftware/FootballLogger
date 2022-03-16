package com.football.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.football.dao.FootballDao;
import com.football.model.Ground;
import com.football.model.Player;
import com.football.model.Team;
import com.football.service.FootballService;

@Service("footballService")
@Transactional
public class FootballServiceImpl implements FootballService {

 @Autowired
 private FootballDao footballDao;
 
@Override
public Player getPlayer(String whatToProcess, String valueToProcess) {
	return footballDao.getPlayer(whatToProcess, valueToProcess);
}

@Override
public Team getTeam(String whatToProcess, String valueToProcess) {
	return footballDao.getTeam(whatToProcess, valueToProcess);
}

@Override
public List<Team> getTeams() {
	return footballDao.getTeams();
}

@Override
public List<Player> getPlayers(String whatToProcess, String valueToProcess) {
	return footballDao.getPlayers(whatToProcess, valueToProcess);
}

@Override
public List<Ground> getGrounds() {
	return footballDao.getGrounds();
}

@Override
public Player getPlayer(String whatToProcess, Player player) throws IllegalAccessException, InvocationTargetException {
	return footballDao.getPlayer(whatToProcess, player);
}

@Override
public Ground getGround(int ground_id) {
	return footballDao.getGround(ground_id);
}

}