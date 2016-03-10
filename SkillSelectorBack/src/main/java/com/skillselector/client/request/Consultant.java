package main.java.com.skillselector.client.request;

import java.io.*; 
public class Consultant 
{ 
  public String fname; 
  public String lname; 
  public String nname; 
  public String tjm; 
  public double score; 

  public Consultant(String fname, String lname, String nname, String tjm, double score) 
  {      this.fname = fname; 
         this.lname = lname; 
         this.nname = nname; 
         this.tjm = tjm; 
         this.score =score;
  } 
  public void afficher() 
  {
	  System.out.println("name : "+fname+" lname : "+lname+" tjm : "+tjm);
	} 

}