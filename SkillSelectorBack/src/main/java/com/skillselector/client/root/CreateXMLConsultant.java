package main.java.com.skillselector.client.root;
import java.io.File;


import java.io.IOException;
 
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
 
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.Text;
import org.xml.sax.SAXException;

public class CreateXMLConsultant {
    
    private static Document creerConsultant(DocumentBuilder docBuilder) {
        Document doc = docBuilder.newDocument();
         
        Element consultant = doc.createElement("consultant");
        doc.appendChild(consultant);
         
       // Element infos = doc.createElement("infos");
       // consultant.appendChild(infos);
        
        createInfos("Billy", "Joe", "Said", "500", consultant, doc);
        
        Element skills = doc.createElement("skills");
        consultant.appendChild(skills);
        
        createSkill("gestion-de-projet", "2", "Bnpp,agipi,SG", skills, doc);
        createSkill("JavaEE", "6", "CGI,L'oreal,Eurler-Hermes", skills, doc);
        
        return doc;
    }
    public static void createInfos(String firstname, String lastname, String nickname, String tjmv, Element parentNode, Document document ){
    	
    	
         
         Element fname = document.createElement("firstName");
         fname.setTextContent(firstname);
         parentNode.appendChild(fname);
         
         Element lname = document.createElement("lastName");
         lname.setTextContent(lastname);
         parentNode.appendChild(lname);
         
         Element nname = document.createElement("nickName");
         nname.setTextContent(nickname);
         parentNode.appendChild(nname);
         
         Element tjm = document.createElement("tjm");
         tjm.setTextContent(tjmv);
         parentNode.appendChild(tjm);
        
    }

    public static void createSkill(String skillName, String nbYears, String skillClients, Element parentNode, Document document ){
    	
    	Element skill = document.createElement("skill");
        parentNode.appendChild(skill);
        
        Element name = document.createElement("skillName");
        name.setTextContent(skillName);
        skill.appendChild(name);
        
        Element nbyears = document.createElement("nbYears");
        nbyears.setTextContent(nbYears);
        skill.appendChild(nbyears);
        
        Element clients = document.createElement("skillClients");
        clients.setTextContent(skillClients);
        skill.appendChild(clients);
        
    }
     
    /**
     * �crit dans un fichier un document DOM, �tant donn� un nom de fichier.
     * 
     * @param doc le document � �crire
     * @param nomFichier le nom du fichier de sortie
     */
    public static void ecrireDocument(Document doc, String nomFichier) {
        // on consid�re le document "doc" comme �tant la source d'une 
        // transformation XML
        Source source = new DOMSource(doc);
         
        // le r�sultat de cette transformation sera un flux d'�criture dans
        // un fichier
        Result resultat = new StreamResult(new File(nomFichier));
         
        // cr�ation du transformateur XML
        Transformer transfo = null;
        try {
            transfo = TransformerFactory.newInstance().newTransformer();
        } catch(TransformerConfigurationException e) {
            System.err.println("Impossible de cr�er un transformateur XML.");
            System.exit(1);
        }
         
        // configuration du transformateur
         
        // sortie en XML
        transfo.setOutputProperty(OutputKeys.METHOD, "xml");
         
        // inclut une d�claration XML (recommand�)
        transfo.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
         
        // codage des caract�res : UTF-8. Ce pourrait �tre �galement ISO-8859-1
        transfo.setOutputProperty(OutputKeys.ENCODING, "utf-8");
         
        // idente le fichier XML
        transfo.setOutputProperty(OutputKeys.INDENT, "yes");
         
        try {
            transfo.transform(source, resultat);
        } catch(TransformerException e) {
            System.err.println("La transformation a �chou� : " + e);
            System.exit(1);
        }
    }
     
    /**
     * Lit un document XML � partir d'un fichier sur le disque, et construit
     * le document DOM correspondant.
     * 
     * @param docBuilder une instance de DocumentBuilder
     * @param nomFichier le fichier o� est stock� le document XML
     * @return un objet DOM Document correspondant au document XML 
     */
    public static Document lireDocument(DocumentBuilder docBuilder, 
            String nomFichier) {
         
        try {
            return docBuilder.parse(new File(nomFichier));
        } catch(SAXException e) {
            System.err.println("Erreur de parsing de " + nomFichier);
        } catch (IOException e) {
            System.err.println("Erreur d'entr�e/sortie sur " + nomFichier);
        }
         
        return null;
    }
     
    /**
     * Affiche � l'�cran un document XML fourni sous forme d'un objet DOM
     * Document.
     * 
     * @param doc le document
     */
    public static void afficherDocument(Document doc) {
        Element e = doc.getDocumentElement();
        afficherElement(e);
    }
     
    /**
     * Affiche � l'�cran un �l�ment XML, ainsi que ses attributs, ses noeuds
     * de texte, et ses sous-�l�ments.
     * 
     * @param e l'�l�ment � afficher
     */
    private static void afficherElement(Element e) {
        System.out.print("<" + e.getNodeName() + " ");
         
        NamedNodeMap attr = e.getAttributes();
        for(int i=0; i<attr.getLength(); i++) {
            Attr a = (Attr)attr.item(i);
            System.out.print(a.getName() + "=\"" + a.getNodeValue() + "\" ");
        }
        System.out.println(">");
         
        for(Node n = e.getFirstChild(); n != null; n = n.getNextSibling()) {
            switch(n.getNodeType()) {
            case Node.ELEMENT_NODE:
                afficherElement((Element)n);
                break;
            case Node.TEXT_NODE:
                String data = ((Text)n).getData();
                System.out.print(data);
                break;
            }
        }
        System.out.println("</" + e.getNodeName() + ">");
    }
     
    public static void main(String[] args) {
        // obtention d'un Document Builder qui permet de cr�er de nouveaux
        // documents ou de parser des documents � partir de fichiers
        DocumentBuilder docBuilder = null;
 
        try {
            docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
        } catch(ParserConfigurationException e) {
            System.err.println("Impossible de cr�er un DocumentBuilder.");
            System.exit(1);
        }
         
        // cr�e un petit document d'exemple
        Document doc = creerConsultant(docBuilder);
         
        // l'�crire sur le disque dans un fichier
        ecrireDocument(doc, "C:/Users/Consultant/workspace/CreateSkills/bin/xml/test.xml");
         
        // re-charger ce document � partir du fichier
        Document doc2 = lireDocument(docBuilder, "C:/Users/Consultant/workspace/CreateSkills/bin/xml/test.xml");
        if(doc2 == null) System.exit(1);
 
        afficherDocument(doc2);
    }
}