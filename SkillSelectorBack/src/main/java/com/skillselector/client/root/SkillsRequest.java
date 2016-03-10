package main.java.com.skillselector.client.root;

import java.awt.List;
import java.io.File;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;

import main.java.com.skillselector.client.request.Consultant;
import main.java.com.skillselector.client.request.Skill;

public class SkillsRequest {
	

	
	
		
	public static int[] orderConsultantsByScore(double [] scores){
		
		int [] consultantsOrdered = new int[scores.length];
		
		//int nbOrdered = 0;
		double maxScore =-1;
		int indiceMax =-1;
		
		for(int i=0; i<scores.length;i++){
			
			for(int j=0; j<scores.length;j++){
				if(scores[j]>maxScore){
					maxScore = scores[j];
					indiceMax=j;
				}
			}
			if(indiceMax>-1){
				consultantsOrdered[i]=indiceMax;
				scores[indiceMax] = -1;
			}
			maxScore =-1;
			indiceMax =-1;
		}
		
		return consultantsOrdered;
	}
	
	public String fileNameOnTiumeStamp(){
		
		Date date= new java.util.Date();
		String fileName = new Timestamp(date.getTime()).toString();
		System.out.println(fileName);
		
		return fileName;
	}
	
	
	static double matchedSkill(Skill requestedSkill, String containeddSkills[][], int containedSkillsNumber, double perfectMatchingScore){
		double matchingScore = 0.0;
		
		double requestedYears = Double.valueOf(requestedSkill.years);
		if(requestedYears == -1.0){
			
			
			//+-50%
			for(int j =0 ; j<= containedSkillsNumber ; j++){
				
				//System.out.println("compare  requestedSkill.name "+requestedSkill.name+" and containeddSkills[j][0] "+containeddSkills[j][0] );
				if((requestedSkill.name).equalsIgnoreCase(containeddSkills[j][0])){
					
					
					matchingScore = perfectMatchingScore;
					
					
				}
				
			}
			
		}else{
			
			double minYears = (requestedYears-(requestedYears/2));
			double maxYears = (requestedYears+(requestedYears/2));
			
			//+-50%
			for(int j =0 ; j<= containedSkillsNumber ; j++){
				
				//System.out.println("compare  requestedSkill.name "+requestedSkill.name+" and containeddSkills[j][0] "+containeddSkills[j][0] );
				if((requestedSkill.name).equalsIgnoreCase(containeddSkills[j][0])){
					
					double skillYears = Double.valueOf(containeddSkills[j][1]);
					//double skillYears = 1.0;
					
					if((skillYears >= minYears) &&(skillYears <= maxYears)){
						matchingScore = perfectMatchingScore;
					}
					else{
						matchingScore = perfectMatchingScore/2;
					}
					
				}
				
			}	
		}
		
		
		return matchingScore;
		
	}
	public static float getPercentBySkill(int skillsNumber){
	
		float skillsNumberf = skillsNumber;
		
		float sd =100/skillsNumberf; 
		
		return sd;
	}
	
	static boolean existSkill(String skill){
		boolean exists = false;
		
		return exists;
	}
	
	
}
