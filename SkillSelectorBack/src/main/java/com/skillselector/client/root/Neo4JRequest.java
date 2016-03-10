package main.java.com.skillselector.client.root;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.entity.StringEntity;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import main.java.com.skillselector.client.request.Consultant;
import main.java.com.skillselector.client.request.Skill;

import java.util.TreeMap;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Utilisateur
 */
public class Neo4JRequest {

    public Map<String, HashMap<String, String>> getContent(String postAddress, String Payload) {
        Map<String, HashMap<String, String>> content = new HashMap<String, HashMap<String, String>>();
        HttpClient client = new DefaultHttpClient();
        
        HttpPost httppost = new HttpPost(postAddress);
        httppost.setHeader("Content-Type", "text/x-gwt-rpc; charset=UTF-8");
        StringEntity se;
        try {
            se = new StringEntity(Payload);
            httppost.setEntity(se);
            HttpResponse response = client.execute(httppost);
            String json = EntityUtils.toString(response.getEntity());
            JSONObject temp1 = new JSONObject(json);
            JSONArray array = (JSONArray) temp1.get("data");
            //  System.out.println(json);
            for (int i = 0; i < array.length(); i++) {
                JSONArray subarray = (JSONArray) array.get(i);
                if (content.containsKey(subarray.get(0))) {
                    HashMap<String, String> submap = content.get(subarray.get(0));
                    submap.put(subarray.getString(1), subarray.getString(2));

                } else {
                    HashMap<String, String> submap = new HashMap<String, String>();
                    submap.put(subarray.getString(1), subarray.getString(2));
                    content.put((String) subarray.get(0), submap);
                }
            }
        } catch (UnsupportedEncodingException ex) {
            Logger.getLogger(Neo4JRequest.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException e) {
            Logger.getLogger(Neo4JRequest.class.getName()).log(Level.SEVERE, null, e);
        }

        return content;
    }
    
    public static void lireMapFromNeo4J( Map<String, HashMap<String, String>> content){
    	
    	Iterator it1 = content.entrySet().iterator();
    	
    	while(it1.hasNext()){
    		
    		Map.Entry pair = (Map.Entry) it1.next();
    		String key = (String) pair.getKey();
    		
    		System.out.println(key);//consultant
    		
    		HashMap<String, String> map = (HashMap<String, String>) pair.getValue();
    		Iterator it2 = map.entrySet().iterator();
        	
        	while(it2.hasNext()){
        		Map.Entry submap = (Map.Entry) it2.next();
        		String subkey = (String) submap.getKey();
        		String subvalue = (String) submap.getValue();
        		System.out.print(subkey);//skill
        		System.out.println(" "+subvalue);//ann�e
        	}
    	}
    	
    	
    }
    
    public static JSONObject calculateScoresFromJsonNeo4J( Skill requestedSkills[], int requestedSkillsNumber, double power, Map<String, HashMap<String, String>> content){
		
    	System.out.print("Enter calculateScoresFromJsonNeo4J ");
    	
    	int nbConsultant = 0;
    	Iterator it1c = content.entrySet().iterator();
    	
    	while(it1c.hasNext()){
    		Map.Entry pair = (Map.Entry) it1c.next();
    		nbConsultant++;
    	}
    	
    	System.out.print("nbConsultant "+nbConsultant);//skill
    	double totalScore = 0.0;
		
		
		DecimalFormat df = new DecimalFormat("00.00");
		
		int nbConsultants =0;

		JSONObject jsonReturn = new JSONObject();
		
		int nbskillsConsultant = 0;
		
		Iterator it1 = content.entrySet().iterator();
    	
    	while(it1.hasNext()){
    		
    		Map.Entry pair = (Map.Entry) it1.next();
    		String key = (String) pair.getKey();
    		
    		
    		
    		HashMap<String, String> map = (HashMap<String, String>) pair.getValue();
    		Iterator it2 = map.entrySet().iterator();
        	
    		nbskillsConsultant = 0;
    		while(it2.hasNext()){
    			Map.Entry submap = (Map.Entry) it2.next();
    			nbskillsConsultant++;
    		}
    		String [][] skillsTab = new String[nbskillsConsultant][2];
    		
    		Iterator it3 = map.entrySet().iterator();
    		int it3Number = -1;
    		
    		while(it3.hasNext()){
    			it3Number++;
    			
    			
        		Map.Entry submap = (Map.Entry) it3.next();
        		String subkey = (String) submap.getKey();
        		String subvalue = (String) submap.getValue();
        		
        		skillsTab[it3Number][0] = subkey;
        		skillsTab[it3Number][1] = subvalue;
        		
        		
        	}
    		
    		it3Number = -1;
    		// Test if skills in consultant and calculate score
			for(int j =0 ; j< requestedSkillsNumber ; j++){
				
				totalScore += SkillsRequest.matchedSkill(requestedSkills[j], skillsTab, nbskillsConsultant-1, power);
				
			}
			
			 nbskillsConsultant = 0;
			
			 System.out.print("\nConsultant "+key+" score "+totalScore);//consultant
			 int ts = (int)totalScore;
			 String chTotalScore = String.valueOf(ts);
			 if(!chTotalScore.contentEquals("0")){
			 jsonReturn.append(key, (String) chTotalScore);
			 }
			 totalScore =0;
			 
    	}
    	
    	
    	
    	return jsonReturn;
		
	}
	
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws UnsupportedEncodingException, IOException {
        // TODO code application logic here
        Neo4JRequest skillcalculator = new Neo4JRequest();
        String data = "{\"query\":\"MATCH (n:`Profile`)-[r*1]-(m)  RETURN DISTINCT n.`name` AS `name`,m.`name` AS `skill`,m.`experience` AS `exp`\"}";
        String postAddress = "http://localhost:7474/db/data/cypher";
         Map<String, HashMap<String, String>> content = skillcalculator.getContent(postAddress, data);
        
       
        System.out.println(content);
        //lireMapFromNeo4J(content);
        
        
    		
    		
		    
    		
    		Skill skillsRequested [] = new Skill[100];
    		
    		int addedSkills = 0;
    		Skill m_skill = new Skill("DataMining", "2", "C");
    		
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		m_skill = new Skill("CEP", "2", "B");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		m_skill = new Skill("TibcoBE", "2", "B");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		
    		m_skill = new Skill("TibcoBW", "2", "A");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		m_skill = new Skill("Management3.0", "2", "A");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		m_skill = new Skill("Java","3","B");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;
    		
    		float power = SkillsRequest.getPercentBySkill(addedSkills);
    		
    		System.out.println(" power per skill for "+addedSkills+" est "+ power);
    		
    		System.out.println(" Call calculate score");
    		
    		JSONObject jsonReturn = calculateScoresFromJsonNeo4J(skillsRequested, addedSkills, power, content);
    		
    		System.out.println("\nJson return "+jsonReturn.toString());
    		
    		
    		
    	
    	
        // System.out.println(array.get(1));

    }
}
