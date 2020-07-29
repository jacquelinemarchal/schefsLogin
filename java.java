// Event.java
// by Jackie Marchal for Schefs
// Program converting typeform auto-generated pdf into corresponding schefs.us
//      event pages and rewrites index.html using templates.

import java.io.*;
import java.lang.*;
import java.util.*;
import java.util.ArrayList;

class Event{

    // Event variables
    File file;
    ArrayList<ArrayList<String>> arr = new ArrayList<>(); // arraylist holding events

    // constructor
    public Event(File file, ArrayList<ArrayList<String>> arr, String eventSeason){
        this.file = file;
        this.arr = arr;
    }

    public static void main(String args[]) throws FileNotFoundException{
        ArrayList<ArrayList<String>> events = new ArrayList<>();
        events.add("eroticismevent1");
        events.add("eroticismevent2");
        events.add("jackie");
        events.add("lola");
        events.add("citizensevent");
        events.add("corona");
        events.add("newevent");
        events.add("performativeevent");
        events.add("aievent");
        events.add("climateevent");

        // create instance of Event class
        File inputFile = new File(args[0]);

        File template = new File("template.html");
       
        arr = e.readIntoArr(inputFile);

        for (int i = 0; i < arr.size(); i++) {
            // name formatting
            String pageLower = (arr.get(i).get(5)).toLowerCase();
            String pageSpace = pageLower.replaceAll("\\s", "");
            String pageExcl = pageSpace.replaceAll("!", "");
            String pageName = pageExcl.substring(0, Math.min(pageExcl.length(), 10));
            String finalName = pageName + ".html";
            arr.get(i).add(pageName);
            arr.get(i).add(finalName);
            e.writeEventPage(arr.get(i), thisSeason, pageName);}

        // e.writeIndex(arr, month, year);

        // test-printing array
        /*

        for (int i = 0; i < arr.size(); i++) {
            for (int j = 0; j < arr.get(i).size(); j++) {
                System.out.print(arr.get(i).get(j) + " ");
                System.out.println();
            }
            System.out.println();
            System.out.println();
        }*/
    }

    private void writeIndex(ArrayList<ArrayList<String>> array, String month, String year){
        ArrayList<char []> preview = new ArrayList<>();
        char[] boilerPlate = new char[2620];
        char[] boilerPlateClose = new char[255];
        char[] openEventDiv = new char[100];
        char[] event1 = new char[600];

        try {
            InputStreamReader reader = null;
            FileInputStream fis = new FileInputStream("indextemplate.html");
            reader = new InputStreamReader(fis);

            OutputStream os = new FileOutputStream("index.html");
            OutputStreamWriter writer = new OutputStreamWriter(os);

            reader.read(boilerPlate, 0, 2616);
            writer.write(boilerPlate, 0, 2616);
            writer.write(month + " " + year + " " + "Experiences");

            reader.read(boilerPlateClose, 0, 254);
            writer.write(boilerPlateClose, 0, 254);

            reader.read(openEventDiv, 0, 91);
            //reader.read(event1, 0, 429);
            //writer.write(event1, 0, 429);

            char[] prev = new char[75];
            reader.read(prev, 0, 72); // + link to html page
            char[] imgSrc = new char[25];
            reader.read(imgSrc, 0, 24); // + link to img
            char[] title = new char[105];
            reader.read(title, 0, 104); // + title of event
            char[] type = new char[80];
            reader.read(type, 0, 77); // + title of event

            /*
            <br> + time date
            <br></p> + from x school

            <br> <br>
            </a>
            </div>
            */
            for (int i = 0; i < array.size(); i++) {
                char[] eventPrev = new char[500];
                for (int j=0; j<75; j++){
                    eventPrev[i] = prev[i];}
                for (int k=0; k<array.get(i).get(14).length(); k++){
                    eventPrev[k] = array.get(i).get(14).charAt(k);
                }
               preview.add(eventPrev);
            }

            for (int i = 0; i < preview.size(); i++){
                    System.out.println(preview.get(i));
            }

            writer.flush();
            reader.close();
        }
        catch(IOException e){
            System.out.println("IO Exception");
            e.printStackTrace();
        }
    }

    private String writeEventPage(ArrayList<String> array, String season, String pageName){

        String finalName = pageName + ".html";
        // buffers for reading portions of template.html
        char[] titleOpen = new char[2350];
        char[] typeOpen = new char[65];
        char[] linkOpen = new char[130];
        char[] eoHeader = new char[575];
        char[] dateOpen = new char[405];
        char[] descOpen = new char[335];
        char[] prepOpen = new char[145];
        char[] aboutOpen = new char[160];
        char[] hostPic = new char[205];
        char[] hostName = new char[140];
        char[] hostSchool = new char[155];
        char[] hostMajor = new char[155];
        char[] eoFile = new char[290];

        try {
            InputStreamReader isr = null;
            FileInputStream fis = new FileInputStream("template.html");
            isr = new InputStreamReader(fis);

            OutputStream os = new FileOutputStream(finalName);
            OutputStreamWriter writer = new OutputStreamWriter(os);

            isr.read(titleOpen, 0, 2301);
            writer.write(titleOpen, 0, 2301);
            writer.write(array.get(5));


            writer.flush();
            isr.close();
        }
        catch(IOException e){
            System.out.println("IO Exception");
            e.printStackTrace();
        }
        System.out.println("Successfully created " + finalName);
        return pageName;
    }

}
