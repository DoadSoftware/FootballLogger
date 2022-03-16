package com.football.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import javax.persistence.Column;

@Entity
@Table(name = "Players")
public class Player implements Comparable<Player>
{

  @Id
  @Column(name = "PLAYERID")
  private int playerId;
	
  @Column(name = "FULLNAME")
  private String full_name;

  @Column(name = "SURNAME")
  private String surname;

  @Column(name = "ABBREVIATEDNAME")
  private String abbreviated_name;
  
  @Column(name = "TEAMID")
  private int teamId;
  
  @Transient
  private String captainGoalKeeper;
  
  @Transient
  private int playerPosition;

  @Transient
  private String captain;

public Player() {
	super();
}

public Player(int playerId, int playerPosition) {
	super();
	this.playerId = playerId;
	this.playerPosition = playerPosition;
}

public String getCaptainGoalKeeper() {
	return captainGoalKeeper;
}

public void setCaptainGoalKeeper(String captainGoalKeeper) {
	this.captainGoalKeeper = captainGoalKeeper;
}

public int getPlayerId() {
	return playerId;
}

public void setPlayerId(int playerId) {
	this.playerId = playerId;
}

public String getFull_name() {
	return full_name;
}

public void setFull_name(String full_name) {
	this.full_name = full_name;
}

public String getSurname() {
	return surname;
}

public void setSurname(String surname) {
	this.surname = surname;
}

public String getAbbreviated_name() {
	return abbreviated_name;
}

public void setAbbreviated_name(String abbreviated_name) {
	this.abbreviated_name = abbreviated_name;
}

public int getTeamId() {
	return teamId;
}

public void setTeamId(int teamId) {
	this.teamId = teamId;
}

public int getPlayerPosition() {
	return playerPosition;
}

public void setPlayerPosition(int playerPosition) {
	this.playerPosition = playerPosition;
}

public String getCaptain() {
	return captain;
}

public void setCaptain(String captain) {
	this.captain = captain;
}

@Override
public int compareTo(Player plyr) {
	return (int) (this.getPlayerPosition()-plyr.getPlayerPosition());
}

}