package com.football.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="stats")
@XmlAccessorType(XmlAccessType.FIELD)
public class Stats {

  @XmlElement(name = "statNumber")
  private int statNumber;

  @XmlElement(name = "statType")
  private String statType;
  
  @XmlElement(name = "homeStatCount")
  private int homeStatCount;

  @XmlElement(name = "awayStatCount")
  private int awayStatCount;

public Stats(int statNumber, String statType) {
	super();
	this.statNumber = statNumber;
	this.statType = statType;
}

public Stats() {
	super();
}

public int getStatNumber() {
	return statNumber;
}

public void setStatNumber(int statNumber) {
	this.statNumber = statNumber;
}

public String getStatType() {
	return statType;
}

public void setStatType(String statType) {
	this.statType = statType;
}

public int getHomeStatCount() {
	return homeStatCount;
}

public void setHomeStatCount(int homeStatCount) {
	this.homeStatCount = homeStatCount;
}

public int getAwayStatCount() {
	return awayStatCount;
}

public void setAwayStatCount(int awayStatCount) {
	this.awayStatCount = awayStatCount;
}
  
}