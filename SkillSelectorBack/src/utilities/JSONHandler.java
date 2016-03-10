/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package utilities;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Matcher;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author Pete
 */
public class JSONHandler {

    private JSONParser parser = new JSONParser();
    private String[] metricKey = new String[100]; //go to 100 levels, should be enough!
    private ArrayList<String>ignore = new ArrayList<String>();
    int level = -1;
    private final static Logger logger = Logger.getLogger(JSONHandler.class);

    public JSONHandler() {
    }

    public JSONObject getJsonObj(String jsonString) {
        Object obj = null;
        try {
            obj = parser.parse(jsonString);
        } catch (ParseException ex) {
            logger.error(ex);
        }
        JSONObject jsonObj = (JSONObject) obj;
        return jsonObj;
    }
    /*
     * Recursive method that processes JSON Objects to extract the key value pairs into a map
     */

    public Map<String, String> parse(JSONObject json, Map<String, String> out) {
        level++; //keep track of recursion level 
        Iterator<String> keys = json.keySet().iterator();
        while (keys.hasNext()) {
            String key = keys.next();
            String val = null;
            //See if the value of the current key is another JSON Object or a key,value pair
            try {
                JSONObject value = (JSONObject) json.get(key);
                metricKey[level] = key; // build up the metric name
                parse(value, out);
            } catch (ClassCastException ex) {
                //not an JSON Object
                val = json.get(key).toString();
                String name = "";
                for (int i = 0; i < level; i++) {
                    name += metricKey[i] + "_";
                }
            }
        }
        level--; //adjust recursion level
        return out;
    }
}
