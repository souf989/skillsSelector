package main.java.com.skillselector.servlet;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import main.java.com.skillselector.client.request.Consultant;
import main.java.com.skillselector.client.request.Skill;
import main.java.com.skillselector.client.root.Neo4JRequest;
import main.java.com.skillselector.client.root.SkillsRequest;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;


/**
 * Servlet implementation class GetClientTracking
 */
public class SelectProfile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static BufferedImage bi;
	private static final String redisIp = "localhost";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SelectProfile() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void init() {
		// loadImage();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print("Bienvenue");
		out.flush();
		System.out.println("Bienvenue");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {
		
		// TODO Auto-generated method stub
		StringBuilder buffer = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			buffer.append(line);
		}		
		String data = buffer.toString();
		System.out.println(data);
		
		
		JSONArray jsonPayload = new JSONArray(data);
		System.out.println(jsonPayload.length());
		Neo4JRequest skillcalculator = new Neo4JRequest();
		String query = "{\"query\":\"MATCH (n:`Profile`)-[r*1]-(m)  RETURN DISTINCT n.`name` AS `name`,m.`name` AS `skill`,m.`experience` AS `exp`\"}";
		String postAddress = "http://localhost:7474/db/data/cypher";
		Map<String, HashMap<String, String>> content = skillcalculator.getContent(postAddress, query);
		
		System.out.println(content);
		
		Skill skillsRequested [] = new Skill[100];
		int addedSkills = 0;
		for(int i =0 ; i< jsonPayload.length() ; i++ ){
			
			JSONObject json =  jsonPayload.getJSONObject(i);
			System.out.println(json.toString());
    		String key = (String) json.get("name");
    		String exp = (String) json.get("exp").toString() ;  		
    		Skill m_skill = new Skill(key,exp, "C");
    		skillsRequested[addedSkills] = m_skill;
    		addedSkills++;    		
    		
		}
		//System.out.println(skillsRequested.length);
		
		
		float power = SkillsRequest.getPercentBySkill(addedSkills);
		
		System.out.println(" power per skill for "+addedSkills+" est "+ power);		
		System.out.println(" Call calculate score");
		
		JSONObject jsonReturn =  skillcalculator.calculateScoresFromJsonNeo4J(skillsRequested, addedSkills, power, content);
		response.setContentType("application/json");
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.setCharacterEncoding("UTF-8");     
		response.getWriter().write(jsonReturn.toString());
		
		System.out.println("\nJson return "+jsonReturn.toString());
		
		

	}



	/**
	 * affichage du json des meilleures profiles
	 * 
	 * @param res
	 *            HttpServletResponse
	 * @throws IOException
	 *             ie
	 */
	private void sendProfiles(final HttpServletResponse response) throws IOException {

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print("Bienvenue");
		out.flush();
	}
}
