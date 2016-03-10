package main.java.com.skillselector.client.request;

import java.io.*; 
public class Skill 
{ 
  public String name; 
  public String years; 
  public String clients; 

  public Skill(String name, String years, String clients) 
  {      this.name = name; 
         this.years = years; 
         this.clients = clients; 
  } 
  public void afficher() 
  {
	  System.out.println("name : "+name+" years : "+years+" clients : "+clients);
	} 

}